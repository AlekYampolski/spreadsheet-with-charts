var SearchOrder = null;
var $searchby = null;
var searchOrder = null;

var SearchFlags = null;
var SearchFoundFlags = null;
var SearchCondition = null;
var findCache;

var msgNoMatch = "Cannot find ";

function doFindNext(searchInformation) {
  function getStartPosition(searchOrder, cellRange) {
    if (!cellRange) {
      return;
    }
    var row = cellRange.row,
      firstRow = row,
      col = cellRange.col,
      firstColumn = col,
      lastRow = row + cellRange.rowCount - 1;
    lastColummn = col + cellRange.colCount - 1;

    if (searchOrder == SearchOrder.ZOrder) {
      if (
        findCache.activeCellColumnIndex == -1 &&
        findCache.activeCellRowIndex == -1
      ) {
        findCache.rowStart = 0;
        findCache.columnStart = 0;
      } else if (findCache.activeCellColumnIndex < lastColummn) {
        findCache.rowStart = findCache.activeCellRowIndex;
        findCache.columnStart = findCache.activeCellColumnIndex + 1; //to do
      } else if (findCache.activeCellColumnIndex == lastColummn) {
        findCache.rowStart = findCache.activeCellRowIndex + 1;
        findCache.columnStart = 0;
      } else {
        findCache.rowStart = firstRow;
        findCache.columnStart = firstColumn;
      }
    } // by columns
    else {
      if (
        findCache.activeCellColumnIndex == -1 &&
        findCache.activeCellRowIndex == -1
      ) {
        findCache.rowStart = 0;
        findCache.columnStart = 0;
      } else if (findCache.activeCellRowIndex < lastRow) {
        findCache.rowStart = findCache.activeCellRowIndex + 1;
        findCache.columnStart = findCache.activeCellColumnIndex;
      } else if (findCache.activeCellRowIndex == lastRow) {
        findCache.rowStart = 0;
        findCache.columnStart = findCache.activeCellColumnIndex + 1;
      } else {
        findCache.rowStart = firstRow;
        findCache.columnStart = firstColumn;
      }
    }
  }

  function findWithinWorksheet(searchInformation, sheet) {
    var rowCount = sheet.getRowCount(),
      columnCount = sheet.getColumnCount(),
      endRow = rowCount - 1,
      endColumn = columnCount - 1;

    getStartPosition(
      searchInformation.SearchOrder,
      new spreadNS.Range(0, 0, rowCount, columnCount)
    );

    var searchCondition = new SearchCondition();

    searchCondition.searchString = searchInformation.SearchString;
    searchCondition.searchFlags = searchInformation.SearchFlags;
    searchCondition.searchOrder = searchInformation.SearchOrder;
    searchCondition.searchTarget = searchInformation.SearchFoundFlags;
    searchCondition.sheetArea = spreadNS.SheetArea.viewport;
    searchCondition.rowStart = findCache.rowStart;
    searchCondition.columnStart = findCache.columnStart;
    searchCondition.rowEnd = endRow;
    searchCondition.columnEnd = endColumn;

    var result = sheet.search(searchCondition);

    var row = result.foundRowIndex,
      col = result.foundColumnIndex;

    findCache.findRowIndex = row;
    findCache.findColumnIndex = col;

    return row != -1 && col != -1;
  }

  function isWorksheetContains(searchInformation, sheet) {
    var findRow, findColumn;
    var searchCondition = new SearchCondition();

    searchCondition.searchString = searchInformation.SearchString;
    searchCondition.searchFlags =
      searchInformation.SearchFlags | SearchFlags.BlockRange;
    searchCondition.searchOrder = searchInformation.SearchOrder;
    searchCondition.searchTarget = searchInformation.SearchFoundFlags;
    searchCondition.sheetArea = spreadNS.SheetArea.viewport;

    var result = sheet.search(searchCondition);

    findRow = result.foundRowIndex;
    findColumn = result.foundColumnIndex;
    if (findRow != -1 && findColumn != -1) {
      return true;
    }

    return false;
  }

  function findNextWithinWorksheet(searchInformation, sheet) {
    findCache.findRowIndex = -1;
    findCache.findColumnIndex = -1;

    var found = findWithinWorksheet(searchInformation, sheet);

    if (found) {
      findCache.activeCellRowIndex = findCache.findRowIndex;
      findCache.activeCellColumnIndex = findCache.findColumnIndex;

      spread
        .getActiveSheet()
        .addSelection(findCache.findRowIndex, findCache.findColumnIndex, 1, 1);
      spread
        .getActiveSheet()
        .showCell(
          findCache.findRowIndex,
          findCache.findColumnIndex,
          3 /*nearest*/,
          3 /*nearest*/
        );

      return true;
    } else {
      findCache.activeCellRowIndex = -1;
      findCache.activeCellColumnIndex = -1;

      return findWithinWorksheet(searchInformation, sheet);
    }
  }

  function getFindWorksheetList(withWorksheet) {
    var worksheetList = [];

    var startFindSheetIndex = findCache.activeSheetIndex,
      sheets = spread.sheets,
      sheetCount = sheets.length;
    for (var i = startFindSheetIndex; i < sheetCount; i++) {
      worksheetList.push(spread.sheets[i]);
    }

    for (var j = 0; j < startFindSheetIndex; j++) {
      worksheetList.push(sheets[j]);
    }

    return worksheetList;
  }

  function markFindCell(sheet, row, col) {
    sheet.setSelection(row, col, 1, 1);
    sheet.setActiveCell(row, col);
    spread.getActiveSheet().showCell(row, col, 3, 3);
  }

  function findNextWithinWorksheets(searchInformation) {
    var worksheetList = getFindWorksheetList(searchInformation.WithinWorksheet);

    findCache.findRowIndex = -1;
    findCache.findColumnIndex = -1;
    findCache.findSheetIndex = -1;

    for (var i = 0; i < worksheetList.length; i++) {
      var worksheet = worksheetList[i];

      var sheetIndex = spread.sheets.indexOf(worksheet);

      if (sheetIndex != spread.getActiveSheetIndex()) {
        findCache.activeCellRowIndex = -1;
        findCache.activeCellColumnIndex = -1;
      }

      var found = findWithinWorksheet(searchInformation, worksheet);

      if (found) {
        findCache.findSheetIndex = sheetIndex;
        break;
      }
    }

    if (findCache.findSheetIndex != -1) {
      findCache.activeSheetIndex = findCache.findSheetIndex;
      var row = (findCache.activeCellRowIndex = findCache.findRowIndex),
        col = (findCache.activeCellColumnIndex = findCache.findColumnIndex);

      spread.setActiveSheetIndex(findCache.findSheetIndex);
      markFindCell(spread.getActiveSheet(), row, col);

      return true;
    } else {
      return false;
    }
  }

  var found;
  if (searchInformation.WithinWorksheet) {
    var sheet = getSpreadJS().getActiveSheet();

    if (!isWorksheetContains(searchInformation, sheet)) {
      findCache.findRowIndex = -1;
      findCache.findColumnIndex = -1;
      findCache.findSheetIndex = -1;

      return false;
    }

    found = findNextWithinWorksheet(searchInformation, sheet);
    if (found) {
      var col = (findCache.activeCellColumnIndex = findCache.findColumnIndex),
        row = (findCache.activeCellRowIndex = findCache.findRowIndex);

      markFindCell(sheet, row, col);
    }
    findCache.findSheetIndex = spread.getActiveSheetIndex();
  } else {
    found = findNextWithinWorksheets(searchInformation);
  }

  return found;
}

function findnext() {
  var searchInformation = getSearchInformation();

  if (!searchInformation || !searchInformation.SearchString) {
    return;
  }

  var found = doFindNext(searchInformation);

  if (!found) {
    alert(msgNoMatch +'"'+searchInformation.SearchString+'"');
  }
}

function focusFindNext(e){
   // Cancel the default action, if needed
  //  event.preventDefault();
   // Number 13 is the "Enter" key on the keyboard
   if (e.keyCode === 13) {
     // Trigger the button element with a click
     document.getElementById("find-next--action").click();
   }
}

function getSearchInformation() {
  var searchString = getTextValue("find-next");
  if (searchString === "")
      return null;
  spread = getSpreadJS(); 
  SearchOrder = spreadNS.SearchOrder;
  $searchby = $("option[name='radio-search']");
 
  var $lookin = $("option[name='radio-look']");
  searchOrder = $searchby.first().is(':selected')
    ? SearchOrder.ZOrder
    : SearchOrder.NOrder;
  var withinWorksheet = $("option[name='radio-within']")
    .first()
    .is(':selected');

  SearchFlags = spreadNS.SearchFlags;
  SearchFoundFlags = spreadNS.SearchFoundFlags;
  SearchCondition = spreadNS.SearchCondition;
  findCache;

  var sheet = spread.getActiveSheet();
  findCache = {
    activeSheetIndex: spread.getActiveSheetIndex(),
    activeCellRowIndex: sheet.getActiveRowIndex(),
    activeCellColumnIndex: sheet.getActiveColumnIndex()
  };
  var searchOrder = $searchby.first().is(':selected')
    ? SearchOrder.ZOrder
    : SearchOrder.NOrder; // <== ? SearchOrder -?
  var searchFoundFlags;
  var searchFlags = 0;

  if (!getCheckValue("checkbox-match--case")) {
    searchFlags |= SearchFlags.IgnoreCase;
  }
  if (getCheckValue("checkbox-match--exactly")) {
    searchFlags |= SearchFlags.ExactMatch;
  }
  if (getCheckValue("checkbox-match--wildcards")) {
    searchFlags |= SearchFlags.UseWildCards;
  }

  if ($lookin.first().is(':selected')) {
    searchFoundFlags = SearchFoundFlags.CellText;
  } else {
    searchFoundFlags = SearchFoundFlags.CellFormula;
    searchString =
      searchString.charAt(0) === "="
        ? searchString.substr(1, searchString.length)
        : searchString; // <==
  }

  return {
    WithinWorksheet: withinWorksheet,
    SearchString: searchString,
    SearchFlags: searchFlags,
    SearchOrder: searchOrder,
    SearchFoundFlags: searchFoundFlags
  };
}
function getTextValue(name) {
  return $("#" + name).val();
}

function getCheckValue(name) {
  return $("#" + name).prop("checked");
}
