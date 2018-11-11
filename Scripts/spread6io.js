var selFromSheetType = "none";
var selectMode = false;
var selectedInputId;
var selectModeInputSelected;
var selectModeInputFieldType;
var selectModeInputFieldIsMulti;
var selectModeLabels = true;
var dataInputWindow;
var methodId = 0;
var dataForCmdJSON;

function getdataForCmdJSON() {
    if  (dataForCmdJSON) {
    /*var jsonWin = JSON.parse(dataForCmdJSON);
    return JSON.stringify(jsonWin);
    */
   return JSON.stringify(dataForCmdJSON)
 } else return "";
}

$(document).ready(function () {
  if (window.jsonToLoad) {
  loadDataFromJson(JSON.parse(window.jsonToLoad))
  var tableWindowController = window.tableWindowController;
  tableWindowController.SetZoom_(getZoom());
  }
});

function updateWindowControllerZoom(zoom) {
//
}

function platformSelectionChanged() {
    // data selection mode active?
    if (selectMode == true && selectModeInputFieldType) {
      inputFieldSelectionChanged(selectModeInputFieldType, selectModeInputFieldIsMulti);
    }
  }

function alertHost(msg) {
    /* TODO: alert custom style */
    if (msg)
      alert(msg);
}

function getInputDrop(id) {
  var dropId = "drop-" + id;
  var inputId = "input-"+ id;
  var el = document.getElementById(dropId);
  if(!el){
      el = document.getElementById(inputId)
  }

  return el;
}


function getInputField(id) {
  var dropId = "data-input-field-" + id;
  return document.getElementById(dropId);
} 


function inputFieldSelectionChanged(inputFieldType, inputFieldIsMulti) {
    if (selectMode == true) {
        var position = "";
        var spread = $("#ss").wijspread("spread");
        var sheet = spread.getActiveSheet();
        var selections = sheet.getSelections();
        var selection = getActualCellRange(selections[selections.length - 1], sheet.getRowCount(), sheet.getColumnCount());
        var rows = selection.rowCount;
        var cols = selection.colCount;
        switch (inputFieldType) {
            case "cell": {
                position = sheet.getValue(selection.row, selection.col);
                rows = 1;
                cols = 1;
                break;
            }
            default:
            case "VarRange":
                {
                    // TODO: handle single cell selected
                    if (!inputFieldIsMulti) {
                        cols = 1;
                        position = sheet.getName() + "!" +
                            sheet.getText(0, selection.col, spreadNS.SheetArea.colHeader)
                           + sheet.getText(selection.row, 0, spreadNS.SheetArea.rowHeader)
                           + ":" + sheet.getText(0, selection.col, spreadNS.SheetArea.colHeader)
                           + sheet.getText(selection.row + selection.rowCount - 1, 0, spreadNS.SheetArea.rowHeader);
                        break;
                    } else {
                        position = sheet.getName() + "!" +
                            sheet.getText(0, selection.col, spreadNS.SheetArea.colHeader)
                           + sheet.getText(selection.row, 0, spreadNS.SheetArea.rowHeader)
                           + ":" + sheet.getText(0, selection.col + selection.colCount - 1, spreadNS.SheetArea.colHeader)
                           + sheet.getText(selection.row + selection.rowCount - 1, 0, spreadNS.SheetArea.rowHeader);
                        break;
                    }

                }
        }
        $("#pnlSelectRangeSelectedRange").val(position);
        if (typeof onSelectionFromSheetUpdated == 'function')
            onSelectionFromSheetUpdated(position,cols,rows);
    
    }
}