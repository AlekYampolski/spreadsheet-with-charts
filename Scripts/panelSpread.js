//spreadNS // = GC.Spread.Sheets; 
//  $searchby = $("input[name='searchby']", $container),
/* 
    var spreadNS = GcSpread.Sheets;
    var SearchOrder = spreadNS.SearchOrder;
    var $searchby = $("input[name='radio-search']"). $lookin = $("input[name='radio-look']");
      var searchOrder = $searchby.first().is(":checked") ? SearchOrder.ZOrder : SearchOrder.NOrder; 

      var SearchFlags = spreadNS.SearchFlags;
    var SearchFoundFlags = spreadNS.SearchFoundFlags;
      
*/
// var SearchOrder = spreadNS.Search.SearchOrder;
// var $searchby = $("input[name='radio-search']");

var spreadNS = GcSpread.Sheets;
var SearchOrder = spreadNS.SearchOrder;
var $searchby = $("input[name='radio-search']"); var $lookin = $("input[name='radio-look']");
  var searchOrder = $searchby.first().is(":checked") ? SearchOrder.ZOrder : SearchOrder.NOrder; 

  var SearchFlags = spreadNS.SearchFlags;
var SearchFoundFlags = spreadNS.SearchFoundFlags;


function findnext() {
    var searchInformation = getSearchInformation(); // <== get it

    if (!searchInformation || !searchInformation.SearchString) {
        return;
    }

    var found = doFindNext(searchInformation);

    if (!found) {
        alert(uiResource.find.result.nomatch);
    }
}

function getSearchInformation() {  // <== works
    var searchString = getTextValue("find-next");
    if (searchString === "")
        return null;

    var withinWorksheet = $('#radio-within--worksheet').first().is(":checked");
    var searchOrder = $searchby.first().is(":checked") ? SearchOrder.ZOrder : SearchOrder.NOrder; // <== ? SearchOrder -?
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

    if ($lookin.first().is(":checked")) {
        searchFoundFlags = SearchFoundFlags.CellText;
    }
    else {
        searchFoundFlags = SearchFoundFlags.CellFormula;
        searchString = searchString.charAt(0) === "=" ? searchString.substr(1, searchString.length) : searchString; // <==
    }

    return {
        WithinWorksheet: withinWorksheet,
        SearchString: searchString,
        SearchFlags: searchFlags,
        SearchOrder: searchOrder,
        SearchFoundFlags: searchFoundFlags
    };
}

function doFindNext(searchInformation) {

    
    function getStartPosition(searchOrder, cellRange) {
        if (!cellRange) {
            return;
        }
        var row = cellRange.row, firstRow = row,
            col = cellRange.col, firstColumn = col,
            lastRow = row + cellRange.rowCount - 1;
        lastColummn = col + cellRange.colCount - 1;

        if (searchOrder == SearchOrder.ZOrder) {
            if (findCache.activeCellColumnIndex == -1 && findCache.activeCellRowIndex == -1) {
                findCache.rowStart = 0;
                findCache.columnStart = 0;
            }
            else if (findCache.activeCellColumnIndex < lastColummn) {
                findCache.rowStart = findCache.activeCellRowIndex;
                findCache.columnStart = findCache.activeCellColumnIndex + 1;//to do
            }
            else if (findCache.activeCellColumnIndex == lastColummn) {
                findCache.rowStart = findCache.activeCellRowIndex + 1;
                findCache.columnStart = 0;
            }
            else {
                findCache.rowStart = firstRow;
                findCache.columnStart = firstColumn;
            }
        }
        else // by columns
        {
            if (findCache.activeCellColumnIndex == -1 && findCache.activeCellRowIndex == -1) {
                findCache.rowStart = 0;
                findCache.columnStart = 0;
            }
            else if (findCache.activeCellRowIndex < lastRow) {
                findCache.rowStart = findCache.activeCellRowIndex + 1;
                findCache.columnStart = findCache.activeCellColumnIndex;
            }
            else if (findCache.activeCellRowIndex == lastRow) {
                findCache.rowStart = 0;
                findCache.columnStart = findCache.activeCellColumnIndex + 1;
            }
            else {
                findCache.rowStart = firstRow;
                findCache.columnStart = firstColumn;
            }
        }
    }
}

function getTextValue(name) {
    return $("#" + name).val();
}

function getCheckValue(name) {
    return $("#" + name ).prop('checked');
}