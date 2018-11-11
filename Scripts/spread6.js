var defFontSize = 10; // Use from preferences
var defFont = "Arial";// Use from preferences
var needsResize = true;
var curCell = {
    row: null,
    column: null
};
/* saved selection before/after print() */
var lastSelection;
/* saved charts before/after print() */
var chartsPrintedFloatObjs = [];
/* print info */
var printPageNumberFooterText = "&P/&N";
/* selected/focused charts, used for copy to clipboard */
var focusedCharts = [];
 
//var rightPanelDisplayId;
var mousePos;
var spreadNS = GcSpread.Sheets;
var localization;
 
/* Side bar IDs */
var ID_EDIT = 0;
var ID_FORMAT = 1;
var ID_SELECT = 2;
var ID_HIDE_ALL  = 3;
var ID_PRINT  = 4;
var ID_PANEL_FIND  = 5;
var ID_PANEL_CHART = 6;
 
var analysisPanel = 'menuCmdsSidebar'; /* ID IN DOM*/
var modalWindowId = "#data-input-window";
var sideBarId = '#menuCmdsSidebar';
 
/* Spread helpers */
function getSpreadJS() { return $('#ss').wijspread('spread');}
function isSpreadJSReady() { return !!getSpreadJS();}
function isDefined(arg) { return (typeof arg !== 'undefined'); }
/* may not work on Safari; Don't use */
function isDefinedFunction(arg) { return (typeof arg === 'function'); }
 
 
// prepare fonts list
function setFontFamilies(styles) {
    var fontSelector = document.getElementById('fontStyle');
    for (var i = 0; i < styles.length; i++) {
        fontSelector.options[i] = new Option(styles[i], styles[i].replace(/\s/g, ""));
    }
    setTimeout(updateFontStyle, 50);
}
 
// set spreadJS zoom
function setZoom(zoom) {
    var oldZoom = getZoom();
    var sheet = getSpreadJS().getActiveSheet();
    sheet.zoom(zoom / 100);
    repaintFloatingCharts(oldZoom, zoom);
}
 
// get spreadJS zoom
function getZoom() {
    var sheet = getSpreadJS().getActiveSheet();
    return sheet.zoom() * 100;
}
 
// spreadJS zoom changed
function spreadUserZooming(e, info) {
    var curSheet = sheet;
    var sheet = info.sheet;
    if (info && info.oldZoomFactor && info.newZoomFactor)
        repaintFloatingChartsSheet(info.oldZoomFactor*100,info.newZoomFactor*100,sheet);
    updateWindowControllerZoom(Math.round(info.newZoomFactor*100));
    runUpdateZoomTimer(info.sheet);
    sheet = curSheet;
}
 
// hack to fix spreadJS bug when zooming with fingers on iPad or Control+Wheel.
// Zoom=0.7499999 paints wrong, while Zoom=0.75 paints correct
function finishUpdateZoom(sheet) {
    clearTimeout(updateZoomTimer);
    var z = Math.round(sheet.zoom() * 100) / 100;
    sheet.zoom(z);
}
var updateZoomTimer = null;
 
function runUpdateZoomTimer(sheet) {
    clearTimeout(updateZoomTimer);
    updateZoomTimer = setTimeout(function() {finishUpdateZoom(sheet);}, 200);
}
 
// set def font size
function setDefFont(newDefFontFamily,newDefFontSize) {
    if (newDefFontFamily)
        defFont = newDefFontFamily;
    if (defFontSize)
        if (newDefFontSize >= 6 && newDefFontSize <= 36)
            defFontSize = newDefFontSize;
}
 
var fc = null;
 
function repaintFloatingChartsSheet(oldZoom, zoom, sheet) {
    var charts = sheet.getFloatingObjects();
    var k = (zoom / oldZoom);
    for (var i = 0; i < charts.length; i++) {
        try{
            var floatChart = charts[i];
            if (i == 0) fc = floatChart;
            floatChart["options"].width *= k;
            floatChart["options"].height *= k;
            floatChart.repaint(floatChart["options"], zoom / 100);
        }catch(e){}
    }
}
 
function repaintFloatingCharts(oldZoom, zoom) {
    var sheet = getSpreadJS().getActiveSheet();
    repaintFloatingChartsSheet(oldZoom, zoom, sheet);
}
 
function setActiveSheet(name){
    getSpreadJS().setActiveSheet(name);
}
 
function setSheetTabColor(sheetIndex, color) {
    getSpreadJS().getSheet(sheetIndex).sheetTabColor(color);
    getSpreadJS().repaint();
}
 
function getFloatingObjectContents(name) {
    var floatingObject = getSpreadJS().getActiveSheet().findFloatingObject(name);
    return floatingObject["chartContainer"].innerHTML;
}
 
function getFloatingObjectContentsObj(obj) {
    return obj["chartContainer"].innerHTML;
}
 
 
function getChartOptions(name) {
    var floatingObject = getSpreadJS().getActiveSheet().findFloatingObject(name);
    return floatingObject["options"];
}
 
function getChartOptionsObj(obj) {
    return obj["options"];
}
 
function convertToSvgBase64(svg) {
    return "data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(svg)));
}
 
function convertToPng(svg, width, height) {
    var canvas = document.getElementById("canvas");
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    var ctx = canvas.getContext('2d');
    /* TODO: [d3] apply different chart background color */
    var ctxFillStyle = ctx.fillStyle;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = ctxFillStyle;
    ctx.drawSvg(convertToSvgBase64(svg), 0, 0, width, height);
    return canvas.toDataURL("image/png");
}
 
function setLocalization(loc) {
    localization = new Localization();
    localization.setLoc(loc);
    localization.updateUi();
}
 
function setSheetSize(rowCount, colCount) {
    var spread = getSpreadJS();
    var sheet = spread.getActiveSheet();
    sheet.setColumnCount(colCount);
    sheet.setRowCount(rowCount);
}
 
function changeToolbarFont(family, size) {
    $("#OfficeUI").css("font-size", size);
    $("#OfficeUI").css("font-family", family);
    $("#OfficeUI select").css("font-size", size);
    $("#OfficeUI select").css("font-family", family);
    $(".formulaBox").css("font-size", size);
    $(".formulaBox").css("font-family", family);
    $(".colpick input").css("font-size", size);
    $(".colpick input").css("font-family", family);
    $(".colpick .colpick_field_letter").css("font-size", size);
    $(".colpick .colpick_field_letter").css("font-family", family);
    $(".colpick .colpick_submit").css("font-size", size);
    $(".colpick .colpick_submit").css("font-family", family);
    $(".menuItem").css("font-size", size);
    $(".menuItem").css("font-family", family);
}
 
function hideColpicker() {
    var e1 = document.createEvent("MouseEvents");
    e1.initMouseEvent("mousedown", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    $('html')[0].dispatchEvent(e1);
}
 
 
// format & editing panels should be on top
function spreadZidx_add() {
    $('#ss').css('position', 'absolute');
    $('#ss').css('z-index', '0');
}
 
// probably unneeded, but the app hadn't been tested well with "z-index:0; position:absolute;" for #ss
function spreadZidx_remove() {
    $('#ss').css('position', '');
    $('#ss').css('z-index', '');
}
 
var panelNames = ['editPanel','formatPanel','selectRangePanel', '','printPanel','findPanel','chartPanel'];
 
function getPanelNameById(panelId) {
    return '#'+panelNames[panelId];
}
 
function togglePanel(panelId) {
    var panelToToggle = getPanelNameById(panelId);
    hideColpicker();
    if(panelId == 5){
        document.getElementById('findPanel').addEventListener('keypress', function(e){focusFindNext(e)})
    } else {
        // document.getElementById('findPanel').removeEventListener('keypress');
    }
    var scrollBottom = $('#ss').find('td')[9].getElementsByClassName('scroll-container')[0];
    if (scrollBottom) {
        var oldScroll = scrollBottom.style.width;
        var deltaHide = scrollBottom.style.width.slice(0, -2) + +$('.rightMenuPanel').width() + 'px';
        var deltaShow = scrollBottom.style.width.slice(0, -2) - $('.rightMenuPanel').width() + 'px';
    }
    // hide all others
    panelNames.forEach(function(panelName, i) {
                       if (i != panelId){
                       $("#"+panelName).hide();
                       }
                       });
    if (panelNames[panelId] != '') {
        // show/hide panel[panelId]
        if ($(panelToToggle).is(":visible")) {
            $(panelToToggle).hide();
            spreadZidx_remove();
            if (scrollBottom) scrollBottom.style.width = deltaHide;
        }
        else {
//            if (typeof cmds !== "undefined") cmds.sidebarIfVisibleHide();
            $(panelToToggle).show();
            spreadZidx_add();
            if (scrollBottom) scrollBottom.style.width = deltaShow;
        }
    }
    $(window).resize();    
    return true;
}
 
function showPanel(panelToToggle) {
    $(panelToToggle).show();
    spreadZidx_add();
    $(window).resize();
}
 
function showPanelById(panelId) {
    showPanel(getPanelNameById(panelId));
}
 
function hidePanel(panelToToggle) {
    $(panelToToggle).hide();
    spreadZidx_remove();
    $(window).resize();
}
 
function hideAllPanels() {
    togglePanel(ID_HIDE_ALL);
}
 
 
function showPrintPanel() {
    hostWantsToShowFormatChartPanel = false;
    printPanelUpdateSheet();
    showPanelById(ID_PRINT);
}
 
function printPanelUpdateSheet() {
    var printInfo = getSpreadJS().getActiveSheet().printInfo();
    if (!isDefined(printInfo)) return;
    $("#printScaleWide").val(0);
    $("#printScaleTall").val(0);
    if (isDefined(printInfo)) {
        document.getElementById("printHeader").checked = printInfo.showColumnHeader() == spreadNS.PrintVisibilityType.Show;
        document.getElementById("printGridlines").checked = printInfo.showGridLine();
        document.getElementById("printPageNumber").checked = printInfo.footerCenter() == printPageNumberFooterText;
        var printFitPagesTall = printInfo.fitPagesTall();
        if (printFitPagesTall > 0)
            $("#printScaleTall").val(Math.min(printFitPagesTall,9));
        var printFitPagesWide = printInfo.fitPagesWide();
        if (printFitPagesWide > 0)
            $("#printScaleWide").val(Math.min(printFitPagesWide,9));
    }
}
 
function restoreAfterPrint() {
    needsResize = true;
/*    $("#formulaBar").show();
    onResize(); */
    var spread = getSpreadJS();
    var printSheetIdx = spread.getActiveSheetIndex();
    sheet = spread.getActiveSheet();
    /* restore charts if any */
    restoreAfterPrintCharts(printSheetIdx);
/*    spread.showHorizontalScrollbar(true);
    spread.showVerticalScrollbar(true);
    spread.tabStripVisible(true);
    sheet.showCell(curCell.row, curCell.column);
    spread.repaint();
    for (var i = 0; i < lastSelection.length; i++) {
        sheet.addSelection(lastSelection[i].row, lastSelection[i].col, lastSelection[i].rowCount, lastSelection[i].colCount);
    } */
}
 
function prepareForPrint() {
    var spread = getSpreadJS();
    sheet = spread.getActiveSheet();
    var printSheetIdx = spread.getActiveSheetIndex();
    // convert charts to png
    prepareForPrintCharts(printSheetIdx);
    // page set up
    var printInfo = sheet.printInfo();
    /* zoom should be 0.1 .. 4.0 */
    var zoom = 1.0;
    if (isDefined(hostPrintInfo) && hostPrintInfo) {
        var rotatePage = (isDefined(hostPrintInfo.portrait) && hostPrintInfo.portrait.toString()=='false');
        if (isDefined(hostPrintInfo.zoom) && hostPrintInfo.zoom >= 10 && hostPrintInfo.zoom <= 400)
            zoom = hostPrintInfo.zoom / 100.0;
        if (isDefined(hostPrintInfo.width) && isDefined(hostPrintInfo.height) &&
            hostPrintInfo.width > 200 && hostPrintInfo.height > 200 && hostPrintInfo.width < 10000 && hostPrintInfo.height < 10000) {
            if (!rotatePage)
                printInfo.paperSize(new spreadNS.PaperSize(hostPrintInfo.width, hostPrintInfo.height));
            else {
                /* TODO: better way to prevent empty pages when landscape? */
                printInfo.paperSize(new spreadNS.PaperSize(hostPrintInfo.width, hostPrintInfo.height*98/100));
            }
        }
        if (isDefined(hostPrintInfo.extraheader) && hostPrintInfo.extraheader) {
            /* le print header */
            printInfo.headerCenter(hostPrintInfo.extraheader);
        } else {
            printInfo.headerCenter('');
        }
    }
    /* get from host */
    if ($("#printPageNumber").prop('checked'))
        printInfo.footerCenter(printPageNumberFooterText);
    var showHeaders = $("#printHeader").prop('checked');
    var showHeadersValue = showHeaders ?  spreadNS.PrintVisibilityType.Show : spreadNS.PrintVisibilityType.Hide;
    var showGridLineValue = $("#printGridlines").prop('checked');
    printInfo.showColumnHeader(showHeadersValue);
    printInfo.showRowHeader(showHeadersValue);
//    printInfo.showBorder(true);
    printInfo.showGridLine(showGridLineValue);
    var optScaleWide = parseInt($("#printScaleWide :selected").val());
    /* NaN > 0 is also false, otherwise use isNaN() */
    if (optScaleWide > 0) {
        printInfo.fitPagesWide(optScaleWide);
    } else
        printInfo.fitPagesWide(-1);
    var optScaleTall = parseInt($("#printScaleTall :selected").val());
    /* NaN > 0 is also false, otherwise use isNaN() */
    if (optScaleTall > 0) {
        printInfo.fitPagesTall(optScaleTall);
    } else
        printInfo.fitPagesTall(-1);
    //    printInfo.zoomFactor(zoom);
    //    printInfo.margin({top:10, bottom:10, left:0, right:0, header:10, footer:10});
    //    printInfo.bestFitColumns(true);http://help.grapecity.com/spread/SpreadJSWeb/JavascriptLibrary~GcSpread.Sheets.PrintInfo~bestFitColumns.html
    setTimeout(function(){
    spread.print(printSheetIdx);
    if (typeof hostPrint === 'function')
        setTimeout(function(){
                   hostPrint();
                   }, 100);
               },100);
}
 
function prepareForPrintChartsTemporaryImageName(idx){
    return '_printChartPng' + idx;
}
 
function prepareForPrintCharts(printSheetIdx) {
    var spread = getSpreadJS();
    var printSheet = spread.sheets[printSheetIdx];
    chartsPrintedFloatObjs = printSheet.getFloatingObjects();
     
    for (var k = 0; k < chartsPrintedFloatObjs.length; k++) {
        var chartOptions = getChartOptionsObj(chartsPrintedFloatObjs[k]);
        var chartPng = convertToPng(getFloatingObjectContentsObj(chartsPrintedFloatObjs[k]),chartOptions.width,chartOptions.height);
        var chartPngPicture = printSheet.addPicture(prepareForPrintChartsTemporaryImageName(k), chartPng,
            chartsPrintedFloatObjs[k]._startRow,chartsPrintedFloatObjs[k]._startColumn,chartsPrintedFloatObjs[k]._endRow,chartsPrintedFloatObjs[k]._endColumn,
            chartsPrintedFloatObjs[k]._startRowOffset,chartsPrintedFloatObjs[k]._startColumnOffset,chartsPrintedFloatObjs[k]._endRowOffset,chartsPrintedFloatObjs[k]._endColumnOffset);
        printSheet.removeFloatingObject(chartsPrintedFloatObjs[k].name())
    }
}
 
function restoreAfterPrintCharts(printSheetIdx) {
    var spread = getSpreadJS();
    var printSheet = spread.sheets[printSheetIdx];
    if (chartsPrintedFloatObjs.length > 0) {
        for (var k = 0; k < chartsPrintedFloatObjs.length; k++) {
            printSheet.removePicture(prepareForPrintChartsTemporaryImageName(k));
            printSheet.addFloatingObject(chartsPrintedFloatObjs[k]);
        }
        chartsPrintedFloatObjs = [];
    }
}
 
/* prepares active sheet (canvas in frame) and calls printHost() to start printing */
function performPrint() {
    prepareForPrint();
    togglePanel(ID_HIDE_ALL);
}
 
function getUndoStack() {
    return getSpreadJS()._undoManager._undoStack;
}
 
function canUndo() {
    return getUndoStack().length > 0;
}
 
function getRedoStack() {
    return getSpreadJS()._undoManager._redoStack;
}
 
function canRedo() {
    return getRedoStack().length > 0;
}
 
function hasPendingChanges(){
    var spread = $("#ss").wijspread("spread");
    var sheets = spread.sheets;
    for (var i = 0; i < sheets.length; i++) {
        if (sheets[i].hasPendingChanges())
            return true;
    }
    return false;
}
 
function log(str){
    $("#consolelog").append(str+ '&#xA;');
}
 
function paste(json, notToAddToUndoRedoManager) {
    var spread = getSpreadJS(); // get instance of Spread
    var sheet = spread.getActiveSheet(); // get active worksheet of the wijspread widget
 
    if (sheet.isEditing())
        return;
 
    var sel = sheet.getSelections()[0];
    if (json.data) {
        json.data = json.data.replace(/\r\n/g, "\r").replace(/\n/g, "\r").replace(/\r/g, "\r\n");
        var rows = json.data.split("\r\n");
        var cols = rows[0].split("\t");
 
        var rowsCount = sel.row + rows.length,
            colsCount = sel.col + cols.length;
        if (rowsCount > sheet.getRowCount())
            sheet.setRowCount(rowsCount);
        if (colsCount > sheet.getColumnCount())
            sheet.setColumnCount(colsCount);
 
 
        var pastedRanges = [new spreadNS.Range(sel.row, sel.col, rows.length, cols.length)];
        var fromSheet = null;
        var fromRange = null;
        var isCutting = false;
        var pasteOption = 0;
        var clipboardText = json.data;
        var pasteExtent = {
            fromRange: fromRange, pastedRanges: pastedRanges.slice(0, 1), isCutting: isCutting, clipboardText: clipboardText
        };
        var pasteUndoAction = new spreadNS.UndoRedo.ClipboardPasteUndoAction(sheet, fromSheet, sheet, pasteExtent, pasteOption);
        sheet._doCommand(pasteUndoAction);
    }
    if (json.images) {
        var names = [];
        for (var i = 0; i < json.images.length; i++) {
            var name = json.images[i].name ? json.images[i].name : new Date().toString().hashCode();
            names.push(name);
            if (!notToAddToUndoRedoManager) {
                json.images[i].name = name;
                json.images[i].row = sel ? sel.row : sheet.getViewportTopRow(1) + i;
                json.images[i].col = sel ? sel.col : sheet.getViewportLeftColumn(1);
            }
            if (json.images[i].chart) {
                var options = JSON.parse(json.images[i].chart);
                if (!notToAddToUndoRedoManager) {
                    options.name = json.images[i].name;
                    options.col = json.images[i].col;
                    options.row = json.images[i].row;
                    json.images[i].chart = JSON.stringify(options);
                }
                createChart(sheet, options);
            }
            else
                sheet.addPicture(names[i], json.images[i].base64, json.images[i].row, json.images[i].col);
        }
        json.data = null;
        if (!notToAddToUndoRedoManager) {
            var clipboardPasteFloatingObjectUndoAction = new spreadNS.UndoRedo.ClipboardPasteFloatingObjectUndoAction(sheet, { names: names, clipboardData: json }, null);
            sheet._doCommand(clipboardPasteFloatingObjectUndoAction)
        }
    }
}
 
function copy(toClear) {
    var result = {
        data: "",
        images: []
    };
 
    var spread = getSpreadJS();
    var sheet = spread.getActiveSheet();
 
    if (sheet.isEditing())
        return result;
    var sel = sheet.getSelections();
     
    for (var i = 0; i < sel.length; i++) {
        result.data += sheet._clipboardCopy(sel[i], false, true);
    }
    /* TODO: check under Windows "-2" */
    result.data = result.data.substring(0, result.data.length - 2).replace(/\r\n/g,"\n");
    if (toClear) {
        var ranges = sheet.getSelections();
        var action = new spreadNS.UndoRedo.ClearValueUndoAction(sheet, ranges);
        if (action.canExecute(sheet)) {
            sheet._doCommand(action)
        }
    }
 
    var objToRemove = [];
    var clipboardHandled = false;
    for (var i = 0; i < focusedCharts.length; i++) {
        if (sheet.findFloatingObject(focusedCharts[i])) {
            clipboardHandled = true;
            var options = getChartOptions(focusedCharts[i]);
            objToRemove.push(focusedCharts[i]);
            result.images.push({
                base64: convertToPng(getFloatingObjectContents(focusedCharts[i]), options.width, options.height),
                chart: JSON.stringify(options)
            });
        }
    }
 
    var pictures = sheet.getPictures();
    for (var i = 0; i < pictures.length; i++) {
        if (pictures[i].isSelected()) {
            clipboardHandled = true;
            objToRemove.push(pictures[i].name());
            result.images.push({
                base64: pictures[i]._src,
                chart: ""
            });
        }
    }
 
    if (toClear) {
        var deleteExtent = { names: objToRemove };
        var deleteFloationgObjectUndoAction = new spreadNS.UndoRedo.DeleteFloatingObjectUndoAction(sheet, deleteExtent);
        sheet._doCommand(deleteFloationgObjectUndoAction);
    }
    if (clipboardHandled)
        sheet._eventHandler._clipboardFloatingObjectData = null;
    return result;
}
 
// format/editing panel (toolbar) click
function ribbonClick(event, id) {
    event.stopPropagation();
    event.preventDefault();
    $(".uk-button-group.active").removeClass("active");
    spreadAction(id,true);
}
 
function spreadAction(id,fromJS) {
    /* force to boolean */
    fromJS = String(fromJS) == "true";
    /* get spread and active sheet instances and process action */
    var spread = $("#ss").wijspread("spread");
    var sheet = spread.getActiveSheet();
    sheet.isPaintSuspended(true);
    switch (id) {
        case "undo":
            undo();
            break;
        case "redo":
            redo();
            break;
        case "toolbar":
            var tableWindowController = window.tableWindowController;
            if (tableWindowController)
            try {
                tableWindowController.ShowToolbar();
                toogleRibbon();
            }
            catch(err) {
                log(err.message);
            }
            break;
        case "increaseFS":
        case "decreaseFS":
            if (id == "decreaseFS") {
                if ($("#fontSize :selected").prev())
                    $($("#fontSize :selected").prev()[0]).prop("selected", true);
            }
            else {
                if ($("#fontSize :selected").next())
                    $($("#fontSize :selected").next()[0]).prop("selected", true);
            }
        case "fontStyle":
        case "fontSize":
        case "bold":
        case "italic":
            var styleElem = document.getElementById("styleElem");
            var fontStr = styleElem.style.font,
                resultFont = "";
            // XOR to toggle a style
            resultFont += ((fontStr.search("bold ") != -1) ^ (id == "bold")) ? "bold " : "";
            resultFont += ((fontStr.search("italic ") != -1) ^ (id == "italic")) ? "italic " : "";
            resultFont += $("#fontSize :selected").val() + " " + $("#fontStyle :selected").text();
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                sheet.getCells(sel.row, sel.col, sel.row + sel.rowCount - 1, sel.col + sel.colCount - 1,
                    spreadNS.SheetArea.viewport).font(resultFont);
            }
            break;
        case "underline":
            var sels = sheet.getSelections();
            var isUnderline = !$("#underline").hasClass("active");
            var underline = spreadNS.TextDecorationType.Underline;
            if (isUnderline) {
                $("#underline").addClass("active");
            }
            else {
                $("#underline").removeClass("active");
            }                
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount()),
                        textDecoration = sheet.getCell(sel.row, sel.col, spreadNS.SheetArea.viewport).textDecoration();
                if ((textDecoration & underline) === underline) {
                    textDecoration = textDecoration - underline;
                }
                else {
                    textDecoration = textDecoration | underline;
                }
                sheet.getCells(sel.row, sel.col, sel.row + sel.rowCount - 1, sel.col + sel.colCount - 1,
                    spreadNS.SheetArea.viewport).textDecoration(textDecoration);
            }
            break;
        case "bordersBottom":
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                for (var i = sel.row; i < sel.row + sel.rowCount; i++) {
                    for (var k = sel.col; k < sel.col + sel.colCount; k++) {
                        if (i == sel.row + sel.rowCount - 1)
                            sheet.getCell(i, k).borderBottom(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.medium));
                    }
                }
            }
            break;
        case "bordersTop":
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                for (var i = sel.row; i < sel.row + sel.rowCount; i++) {
                    for (var k = sel.col; k < sel.col + sel.colCount; k++) {
                        if (i == sel.row)
                            sheet.getCell(i, k).borderTop(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.medium));
                    }
                    break;
                }
            }
            break;
        case "bordersLeft":
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                for (var i = sel.col; i < sel.col + sel.colCount; i++) {
                    for (var k = sel.row; k < sel.row + sel.rowCount; k++) {
                        if (i == sel.col)
                            sheet.getCell(k, i).borderLeft(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.medium));
                    }
                    break;
                }
            }
            break;
        case "bordersRight":
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                for (var i = sel.col; i < sel.col + sel.colCount; i++) {
                    for (var k = sel.row; k < sel.row + sel.rowCount; k++) {
                        if (i == sel.col + sel.colCount - 1)
                            sheet.getCell(k, i).borderRight(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.medium));
                    }
                }
            }
            break;
        case "noBorders":
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                var cells = sheet.getCells(sel.row, sel.col, sel.row + sel.rowCount - 1, sel.col + sel.colCount - 1);
                cells.borderRight(null);
                cells.borderLeft(null);
                cells.borderBottom(null);
                cells.borderTop(null);
            }
            break;
        case "outsideBorders":
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                for (var i = sel.col; i < sel.col + sel.colCount; i++) {
                    for (var k = sel.row; k < sel.row + sel.rowCount; k++) {
                        if (i == sel.col + sel.colCount - 1)
                            sheet.getCell(k, i).borderRight(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.medium));
                        if (i == sel.col)
                            sheet.getCell(k, i).borderLeft(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.medium));
                        if (k == sel.row)
                            sheet.getCell(k, i).borderTop(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.medium));
                        if (k == sel.row + sel.rowCount - 1)
                            sheet.getCell(k, i).borderBottom(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.medium));
                    }
                }
            }
            break;
        case "thickBoxBorder":
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                for (var i = sel.col; i < sel.col + sel.colCount; i++) {
                    for (var k = sel.row; k < sel.row + sel.rowCount; k++) {
                        if (i == sel.col + sel.colCount - 1)
                            sheet.getCell(k, i).borderRight(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.thick));
                        if (i == sel.col)
                            sheet.getCell(k, i).borderLeft(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.thick));
                        if (k == sel.row)
                            sheet.getCell(k, i).borderTop(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.thick));
                        if (k == sel.row + sel.rowCount - 1)
                            sheet.getCell(k, i).borderBottom(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.thick));
                    }
                }
            }
            break;
        case "doubleBottomBorders":
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                for (var i = sel.col; i < sel.col + sel.colCount; i++) {
                    for (var k = sel.row; k < sel.row + sel.rowCount; k++) {
                        if (k == sel.row + sel.rowCount - 1)
                            sheet.getCell(k, i).borderBottom(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.double));
                    }
                }
            }
            break;
        case "thickBottomBorder":
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                for (var i = sel.col; i < sel.col + sel.colCount; i++) {
                    for (var k = sel.row; k < sel.row + sel.rowCount; k++) {
                        if (k == sel.row + sel.rowCount - 1)
                            sheet.getCell(k, i).borderBottom(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.thick));
                    }
                }
            }
            break;
        case "topBottomBorders":
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                for (var i = sel.col; i < sel.col + sel.colCount; i++) {
                    for (var k = sel.row; k < sel.row + sel.rowCount; k++) {
                        if (k == sel.row)
                            sheet.getCell(k, i).borderTop(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.medium));
                        if (k == sel.row + sel.rowCount - 1)
                            sheet.getCell(k, i).borderBottom(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.medium));
                    }
                }
            }
            break;
        case "topThickBottomBorders":
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                for (var i = sel.col; i < sel.col + sel.colCount; i++) {
                    for (var k = sel.row; k < sel.row + sel.rowCount; k++) {
                        if (k == sel.row)
                            sheet.getCell(k, i).borderTop(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.medium));
                        if (k == sel.row + sel.rowCount - 1)
                            sheet.getCell(k, i).borderBottom(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.thick));
                    }
                }
            }
            break;
        case "topDoubleBottomBordes":
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                for (var i = sel.col; i < sel.col + sel.colCount; i++) {
                    for (var k = sel.row; k < sel.row + sel.rowCount; k++) {
                        if (k == sel.row)
                            sheet.getCell(k, i).borderTop(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.medium));
                        if (k == sel.row + sel.rowCount - 1)
                            sheet.getCell(k, i).borderBottom(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.double));
                    }
                }
            }
            break;
        case "allBorders":
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                var cells = sheet.getCells(sel.row, sel.col, sel.row + sel.rowCount - 1, sel.col + sel.colCount - 1);
                cells.borderRight(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.medium));
                cells.borderLeft(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.medium));
                cells.borderBottom(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.medium));
                cells.borderTop(new spreadNS.LineBorder("black",
                                spreadNS.LineStyle.medium));
            }
            break;
        case "topAlign":
        case "middleAlign":
        case "bottomAlign":
            var align;
            switch (id) {
                case "topAlign":
                    align = spreadNS.VerticalAlign.top;
                    break;
                case "middleAlign":
                    align = spreadNS.VerticalAlign.center;
                    break;
                case "bottomAlign":
                    align = spreadNS.VerticalAlign.bottom;
                    break;
            }
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                sheet.getCells(sel.row, sel.col, sel.row + sel.rowCount - 1, sel.col + sel.colCount - 1, spreadNS.SheetArea.viewport).vAlign(align);
            }
            break;
        case "leftAlign":
        case "centerAlign":
        case "rightAlign":
            var align;
            switch (id) {
                case "leftAlign":
                    align = spreadNS.HorizontalAlign.left;
                    break;
                case "centerAlign":
                    align = spreadNS.HorizontalAlign.center;
                    break;
                case "rightAlign":
                    align = spreadNS.HorizontalAlign.right;
                    break;
            }
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                sheet.getCells(sel.row, sel.col, sel.row + sel.rowCount - 1, sel.col + sel.colCount - 1, spreadNS.SheetArea.viewport).hAlign(align);
            }
            break;
        case "increaseIndent":
        case "decreaseIndent":
            var selections = sheet.getSelections();
            var offset = 1;
            if (id == "decreaseIndent")
                offset = -1;
            for (var n = 0; n < selections.length; n++) {
                var selection = getActualCellRange(selections[n], sheet.getRowCount(), sheet.getColumnCount());
                for (var i = 0; i < selection.rowCount; i++) {
                    for (var j = 0; j < selection.colCount; j++) {
                        var indent = sheet.getCell(i + selection.row, j + selection.col, spreadNS.SheetArea.viewport).textIndent();
                        if (isNaN(indent) || indent < 0)
                            indent = 0;
                        sheet.getCell(i + selection.row, j + selection.col, spreadNS.SheetArea.viewport).textIndent(indent + offset);
                    }
                }
            }
            break;
        case "wrapText":
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                sheet.getCells(sel.row, sel.col, sel.row + sel.rowCount - 1, sel.col + sel.colCount - 1, spreadNS.SheetArea.viewport).wordWrap($("#wrapText").is(":checked"));
            }
            break;
        case "mergeCenter":
            var selections = sheet.getSelections();
            for (var i = 0; i < selections.length; i++) {
                var selection = sheet.getCell(selections[i].row, selections[i].col);
                selection.hAlign(spreadNS.HorizontalAlign.center);
                selection.vAlign(spreadNS.VerticalAlign.center);
            }
        case "mergeCells":
            var selections = sheet.getSelections();
            for (var i = 0; i < selections.length; i++) {
                selection = selections[i];
                sheet.addSpan(selection.row, selection.col, selection.rowCount, selection.colCount, spreadNS.SheetArea.viewport);
            }
            break;
        case "mergeAcross":
            var selections = sheet.getSelections();
            for (var i = 0; i < selections.length; i++) {
                var selection = getActualCellRange(selections[i], sheet.getRowCount(), sheet.getColumnCount());
                for (var r = 0; r < selection.rowCount; r++) {
                    sheet.addSpan(selection.row + r, selection.col, 1, selection.colCount, spreadNS.SheetArea.viewport);
                }
            }
            break;
        case "unmerge":
            var selections = sheet.getSelections();
            for (var i = 0; i < selections.length; i++) {
                var selection = getActualCellRange(selections[i], sheet.getRowCount(), sheet.getColumnCount());
                for (var r = 0; r < selection.rowCount; r++) {
                    for (var c = 0; c < selection.colCount; c++) {
                        var span = sheet.getSpan(r + selection.row, c + selection.col, spreadNS.SheetArea.viewport);
                        if (span) {
                            sheet.removeSpan(span.row, span.col, spreadNS.SheetArea.viewport);
                        }
                    }
                }
            }
            break;
        case "addCellsRight":
            var selections = sheet.getSelections();
            /* OnlyCells ? */
            if (getSelectionType(spread) == 3) {
                var sortedRanges = getSortedColumnSelections(sheet);
                var colCount = sheet.getColumnCount();
                if (canInsertRight(sortedRanges,sheet)) {
                for (var i = 0; i < sortedRanges.length; i++) {
                    var r = sortedRanges[i];
                    var option = 256 /* BindingPath */ | 2 /* Formula */ | 8 /* RangeGroup */ | 32 /* Span */ | 16 /* Sparkline */ | 64 /* Style */ | 128 /* Tag */ | 1 /* Value */;
                    sheet.addColumns(colCount, r.colCount);
                    sheet.moveTo(r.row, r.col, r.row, r.col + r.colCount, r.rowCount, colCount - r.col, option);
                }
                }
                else {
                    var msgError_ = localization ? localization.translate('ui.msg.spread.cannotInsertMerged') : null;
                    if (msgError_ && (msgError_.length > 0)) alertHost(msgError_);
                }
            }
            break;
        case "addCellsDown":
            var selections = sheet.getSelections();
            if (getSelectionType(spread) == 3 /* OnlyCells */) {
                var sortedRanges = getSortedRowSelections(sheet);
                var rowCount = sheet.getRowCount();
                if (canInsertDown(sortedRanges,sheet)) {
                for (var i = 0; i < sortedRanges.length; i++) {
                    var r = sortedRanges[i];
                    var option = 256 /* BindingPath */ | 2 /* Formula */ | 8 /* RangeGroup */ | 32 /* Span */ | 16 /* Sparkline */ | 64 /* Style */ | 128 /* Tag */ | 1 /* Value */;
                    sheet.addRows(rowCount, r.rowCount);
                    sheet.moveTo(r.row, r.col, r.row + r.rowCount, r.col, rowCount - r.row, r.colCount, option);
                }
                }
                else {
                    var msgError_ = localization ? localization.translate('ui.msg.spread.cannotInsertMerged') : null;
                    if (msgError_ && (msgError_.length > 0)) alertHost(msgError_);
                }
            }
             
            break;
        case "addCol":
            var selections = sheet.getSelections();
            var selection = getActualCellRange(selections[0], sheet.getRowCount(), sheet.getColumnCount());
            sheet.addColumns(sheet.getActiveColumnIndex(), selection.colCount);
            break;
        case "addRow":
            var selections = sheet.getSelections();
            var selection = getActualCellRange(selections[0], sheet.getRowCount(), sheet.getColumnCount());
            sheet.addRows(sheet.getActiveRowIndex(), selection.rowCount);
            break;
        case "addSheet":
            spread.addSheet(spread.getActiveSheetIndex());
            break;
        case "deleteCellsLeft":
            if (sheet.getRowCount() > 2) {
                var sortedRanges = getSortedColumnSelections(sheet);
                for (var i = 0; i < sortedRanges.length; i++) {
                    var r = sortedRanges[i];
                    var option = 256 /* BindingPath */ | 2 /* Formula */ | 8 /* RangeGroup */ | 32 /* Span */ | 16 /* Sparkline */ | 64 /* Style */ | 128 /* Tag */ | 1 /* Value */;
                    sheet.moveTo(r.row, r.col + r.colCount, r.row, r.col, r.rowCount, sheet.getColumnCount() - (r.col + r.colCount), option);
                }
                sheet.clearSelection();
            }
            break;
        case "deleteCellsUp":
            if (sheet.getRowCount() > 2) {
                var sortedRanges = getSortedRowSelections(sheet);
                for (var i = 0; i < sortedRanges.length; i++) {
                    var r = sortedRanges[i];
                    var option = 256 /* BindingPath */ | 2 /* Formula */ | 8 /* RangeGroup */ | 32 /* Span */ | 16 /* Sparkline */ | 64 /* Style */ | 128 /* Tag */ | 1 /* Value */;
                    sheet.moveTo(r.row + r.rowCount, r.col, r.row, r.col, sheet.getRowCount() - (r.row + r.rowCount), r.colCount, option);
                }
                sheet.clearSelection();
            }
            break;
        case "deleteRow":
            if (sheet.getRowCount() > 2) {
                /* var sel = sheet.getSelections()[0];sheet.deleteRows(sheet.getActiveRowIndex(), sel.rowCount);*/
                var sortedRanges = getSortedRowSelections(sheet);
                for (var i = 0; i < sortedRanges.length; i++) {
                    sheet.deleteRows(sortedRanges[i].row, sortedRanges[i].rowCount);
                }
                sheet.clearSelection();
            }
            break;
        case "deleteCol":
            if (sheet.getColumnCount() > 2) {
                /* var sel = sheet.getSelections()[0];sheet.deleteColumns(sheet.getActiveColumnIndex(), sel.colCount);*/
                var sortedRanges = getSortedColumnSelections(sheet);
                for (var i = 0; i < sortedRanges.length; i++) {
                    sheet.deleteColumns(sortedRanges[i].col, sortedRanges[i].colCount);
                }
                sheet.clearSelection();
            }
            break;
        case "deleteSheet":
            if (spread.getSheetCount() > 1)
                spread.removeSheet(spread.getActiveSheetIndex());
            break;
        case "autoSum":
        case "autoAverage":
        case "autoCount":
        case "autoMax":
        case "autoMin":
            var selections = sheet.getSelections();
            for (var n = 0; n < selections.length; n++) {
                selection = selections[n];
                var formula = "";
                for (var i = 0; i < selection.colCount; i++) {
                    var resCellRow = selection.row >= 0 ? selection.row + selection.rowCount : selection.row + selection.rowCount + 1;
                    var resCellCol = selection.col + i;
 
                    var styleName = sheet.getStyleName(selection.row, selection.col + i);
                    if (styleName)
                        sheet.setStyleName(resCellRow, resCellCol, styleName);
                    else
                        sheet.setFormatter(resCellRow, resCellCol, sheet.getFormatter(selection.row, selection.col + i));
 
                    switch (id) {
                        case "autoSum":
                            formula = "=SUM(";
                            break;
                        case "autoAverage":
                            formula = "=AVERAGE(";
                            break;
                        case "autoCount":
                            formula = "=COUNT(";
                            break;
                        case "autoMax":
                            formula = "=MAX(";
                            break;
                        case "autoMin":
                            formula = "=MIN(";
                            break;
                    }
                    formula += sheet.getText(0, selection.col + i, spreadNS.SheetArea.colHeader)
                                + sheet.getText(selection.row < 0 ? 0 : selection.row, 0, spreadNS.SheetArea.rowHeader) + ":"
                                + sheet.getText(0, selection.col + i, spreadNS.SheetArea.colHeader)
                                + sheet.getText(selection.row >= 0 ? selection.row + selection.rowCount - 1 : selection.row
                                        + selection.rowCount, 0, spreadNS.SheetArea.rowHeader) + ")";
                    sheet.setFormula(resCellRow, resCellCol, formula);
                }
            }
            break;
        case "fillUp":
            var selections = sheet.getSelections();
            for (var n = 0; n < selections.length; n++) {
                var selection = getActualCellRange(selections[n], sheet.getRowCount(), sheet.getColumnCount());
                for (var i = 0; i < selection.colCount; i++) {
                    sheet.setValue(selection.row, i + selection.col, sheet.getValue(selection.row + selection.rowCount - 1, selection.col + i));
                }
            }
        case "fillDown":
            var selections = sheet.getSelections();
            for (var n = 0; n < selections.length; n++) {
                var selection = getActualCellRange(selections[n], sheet.getRowCount(), sheet.getColumnCount());
                for (var i = 0; i < selection.colCount; i++) {
                    var start = new spreadNS.Range(selection.row, i + selection.col, 1, 1);
                    var r = new spreadNS.Range(selection.row, i + selection.col, selection.rowCount, 1);
                    sheet.fillGrowth(start, r, spreadNS.FillSeries.Column, 1);
                }
            }
            break;
        case "fillLeft":
            var selections = sheet.getSelections();
            for (var n = 0; n < selections.length; n++) {
                var selection = getActualCellRange(selections[n], sheet.getRowCount(), sheet.getColumnCount());
                for (var i = 0; i < selection.rowCount; i++) {
                    sheet.setValue(i + selection.row, selection.col, sheet.getValue(i + selection.row, selection.col + selection.colCount - 1));
                }
            }
        case "fillRight":
            var selections = sheet.getSelections();
            for (var n = 0; n < selections.length; n++) {
                var selection = getActualCellRange(selections[n], sheet.getRowCount(), sheet.getColumnCount());
                for (var i = 0; i < selection.rowCount; i++) {
                    var start = new spreadNS.Range(i + selection.row, selection.col, 1, 1);
                    var r = new spreadNS.Range(i + selection.row, selection.col, 1, selection.colCount);
                    sheet.fillGrowth(start, r, spreadNS.FillSeries.Row, 1);
                }
            }
            break;
        case "clearAll":
        case "clearFormat":
        case "clearContent":
        case "clearComments":
            var selections = sheet.getSelections();
            for (var n = 0; n < selections.length; n++) {
                var selection = getActualCellRange(selections[n], sheet.getRowCount(), sheet.getColumnCount());
                switch (id) {
                    case "clearAll":
                        sheet.clear(selection.row, selection.col, selection.rowCount,
                            selection.colCount, spreadNS.SheetArea.viewport, spreadNS.StorageType.Comment);
                        sheet.clear(selection.row, selection.col, selection.rowCount,
                            selection.colCount, spreadNS.SheetArea.viewport, spreadNS.StorageType.Data);
                        sheet.clear(selection.row, selection.col, selection.rowCount,
                            selection.colCount, spreadNS.SheetArea.viewport, spreadNS.StorageType.Sparkline);
                    case "clearFormat":
                        sheet.clear(selection.row, selection.col, selection.rowCount,
                            selection.colCount, spreadNS.SheetArea.viewport, spreadNS.StorageType.Style);
                        break;
                    case "clearContent":
                        sheet.clear(selection.row, selection.col, selection.rowCount,
                            selection.colCount, spreadNS.SheetArea.viewport, spreadNS.StorageType.Data);
                        break;
                    case "clearComments":
                        sheet.clear(selection.row, selection.col, selection.rowCount,
                            selection.colCount, spreadNS.SheetArea.viewport, spreadNS.StorageType.Comment);
                        break;
                }
            }
            break;
        case "sortaz":
        case "sortza":
            var sels = sheet.getSelections();
            for (var n = 0; n < sels.length; n++) {
                var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
                sheet.sortRange(sel.row, sel.col, sel.rowCount, sel.colCount, true, [
                    { index: sel.col, ascending: id == "sortaz" }
                ]);
            }
            break;
        case "addFilter":
            var sels = sheet.getSelections();
            if (sels.length > 0) {
                var sel = sels[0];
                sheet.rowFilter(new spreadNS.HideRowFilter(sel));
            }
            break;
        case "clearFilter":
            sheet.rowFilter(null);
            break;
        case "generalUiSetings":
            showGeneralOptions();
            break;
        case "rowHeaderChB":
            sheet.setRowHeaderVisible(!sheet.getRowHeaderVisible());
            break;
        case "columnHeaderChB":
            sheet.setColumnHeaderVisible(!sheet.getColumnHeaderVisible());
            break;
        case "vGridlineChB":
            var vGridLine = sheet.gridline.showVerticalGridline;
            var hGridLine = sheet.gridline.showHorizontalGridline;
            sheet.setGridlineOptions({ showVerticalGridline: !vGridLine, showHorizontalGridline: hGridLine });
            break;
        case "hGridlineChB":
            var hGridLine = sheet.gridline.showHorizontalGridline;
            var vGridLine = sheet.gridline.showVerticalGridline;
            sheet.setGridlineOptions({ showVerticalGridline: vGridLine, showHorizontalGridline: !hGridLine });
            break;
        case "tabStripChB":
            spread.tabStripVisible(!spread.tabStripVisible());
            break;
        case "newTabChB":
            spread.newTabVisible(!spread.newTabVisible());
            break;
        case "zoom100":
            sheet.zoom(1);
            break;
        case "zoomSelection":
            sheet.getSelections().zoom(1);
            break;
        case "freezepane":
            sheet.setFrozenRowCount(sheet.getActiveRowIndex());
            sheet.setFrozenColumnCount(sheet.getActiveColumnIndex());
            break;
        case "freezeTopRow":
            sheet.setFrozenRowCount(1);
            break;
        case "freezeFirstColumn":
            sheet.setFrozenColumnCount(1);
            break;
        case "freezeBottomRow":
            sheet.setFrozenTrailingRowCount(1);
            break;
        case "freezeLastColumn":
            sheet.setFrozenTrailingColumnCount(1);
            break;
        case "unfreeze":
            sheet.setFrozenRowCount(0);
            sheet.setFrozenColumnCount(0);
            sheet.setFrozenTrailingRowCount(0);
            sheet.setFrozenTrailingColumnCount(0);
            break;
    }
    sheet.isPaintSuspended(false);
    if (fromJS && id != "") {
        $("html").click();
    }
    updateFontStyle();
}
 
function deleteHoveredSheet(){
    var spread = $("#ss").wijspread("spread");
//    spread._tab._hitTest(100,0);
    if (spread.getSheetCount() > 1)
        spread.removeSheet(getHoverTabId());
}
 
 
function getHoverTabId(){
    var spread = $("#ss").wijspread("spread");
    var hoverId = spread._tab._hoverTab;
    var t = $(spread._tab._getCanvas()).offset();
    var left = mousePos.x - t.left;
    var top = mousePos.y - t.top;
    var hitTestInfo = spread._tab.hitTest(left, top);
    if (hitTestInfo.element == "tab")
        return hitTestInfo.index;
    return -1;
}
 
function insertSheet(){
    var spread = $("#ss").wijspread("spread");
    if (spread._tab._hoverTab < 0)
        spread.addSheet();
    else
        spread.addSheet(spread._tab._hoverTab);
}
 
function renameHoveredSheet(){
    var spread = $("#ss").wijspread("spread");
    var hoverId = getHoverTabId();
    if (hoverId < 0)
        return;
    var t = $(spread._tab._getCanvas()).offset();
    var left = mousePos.x - t.left;
    var top = mousePos.y - t.top;
    var hitTestInfo = spread._tab.hitTest(left, top);
 
    spread._tab.doSheetTabClick(hitTestInfo.index,
                                hitTestInfo.position)
    spread._tab._doMouseDbClickImp(left, top);
}
 
function getHoveredSheetName(){
    var spread = getSpreadJS();
    var hoverId = getHoverTabId();
    if (hoverId>=0){
        return spread.sheets[hoverId]._name;
    }
    return spread.getActiveSheet()._name;
}
 
function getActiveSheetName(){
    var spread = getSpreadJS();
    return spread.getActiveSheet()._name;
}
 
 
function removeImage(){
    var spread = getSpreadJS();
    var sheet = spread.getActiveSheet();
 
    var objToRemove = [];
     
    for (var i = 0; i < focusedCharts.length; i++) {
        if (sheet.findFloatingObject(focusedCharts[i])) {
            objToRemove.push(focusedCharts[i]);
        }
    }
     
    var pictures = sheet.getPictures();
    for (var i = 0; i < pictures.length; i++) {
        if (pictures[i].isSelected()) {
            objToRemove.push(pictures[i].name());
        }
    }
     
    var deleteExtent = { names: objToRemove };
    var deleteFloationgObjectUndoAction = new spreadNS.UndoRedo.DeleteFloatingObjectUndoAction(sheet, deleteExtent);
    sheet._doCommand(deleteFloationgObjectUndoAction);
    if (typeof panelChartEditDisable === 'function')
        panelChartEditDisable();
}
 
function markImgCheckbox(id, checked) {
    var img = $("img", "#" + id);
    if(checked){
        img.addClass('select');
    } else {
        img.removeClass('select');
    }
}
 
function initRibbon() {
    /* remove */
    if (typeof $("#mainRibbon").Ribbon == 'function') $("#mainRibbon").Ribbon();
    //
    if (typeof OfficeUICore !== 'undefined') OfficeUICore.Init();
     
    $("#fontStyle").change(function (event) { ribbonClick(event, "fontStyle") });
    $("#fontSize").change(function (event) { ribbonClick(event, "fontSize") });
    $("#wrapText").change(function (event) { ribbonClick(event, "wrapText") });;
    $(".uk-button").click(function (event) { ribbonClick(event, this.id) });
    $(".menuEntry").click(function (event) { ribbonClick(event, this.id) });
    /* mac app only: override JS menus with native controls */
    if (typeof menuPopupAtControl == 'function') {
        $("#rmn-insert-rows-menu").click(function (event) { menuPopupAtControl(event || window.event,"rmn-insert-rows"); });
        $("#rmn-remove-rows").click(function (event) { menuPopupAtControl(event || window.event,"rmn-remove-rows"); });
        $("#rmn-clear").click(function (event) { menuPopupAtControl(event || window.event,"rmn-clear"); });
        document.getElementById("insertMenu").innerHTML = "";
        document.getElementById("deleteMenu").innerHTML = "";
        document.getElementById("clearMenu").innerHTML = "";
    }
    $(".ribbon-dropdown .uk-button").click(function (event) {
        event.stopPropagation();
        event.preventDefault();
        $(".uk-button-group.active").removeClass("active");
        var parent = $(event.target).parent();
        if (!parent.hasClass("ribbon-dropdown"))
            parent = parent.parent();
        parent.find(".menu").addClass("active").addClass("OfficeUI_absolute").css("display", "block").css("transform", "none");
    });
    $(".uk-button-group .smallicon").click(function () {
        event.stopPropagation();
        event.preventDefault();
        $(".uk-button-group.active").removeClass("active");
        $(this).parent().addClass("active");
    });
/*    $(document).click(function () {
        $(".uk-button-group.active").removeClass("active");
    }); */
    $('#fontColor').colpick({
        layout: 'full',
        submit: 0,
        onChange: function (hsb, hex, rgb, el, bySetColor) {
            $(".colorHandler", '#fontColor').css("background", "#" + hex);
 
            if (bySetColor)
                return;
 
            setColorForSelection("#" + hex, 1);
        },
        onSubmit: function (hsb, hex, rgb, el) {
            setColorForSelection(null, 1);
 
            updateFontStyle();
 
            $(el).colpickHide();
        }
    });
    $('#backgroundColor').colpick({
        layout: 'full',
        submit: 0,
        onChange: function (hsb, hex, rgb, el, bySetColor) {
            $(".colorHandler", '#backgroundColor').css("background", "#" + hex);
 
            if (bySetColor)
                return;
 
            setColorForSelection("#" + hex, 0);
        },
        onSubmit: function (hsb, hex, rgb, el) {
            setColorForSelection(null, 0);
 
            updateFontStyle();
 
            $(el).colpickHide();
        }
    });
    $('#buttonPrint').click(function (event) { performPrint(); });
    $('#buttonPrintPageSetup').click(function (event) { hostPageSetup(); });
    $('#buttonPrintCancel').click(function (event) { togglePanel(ID_HIDE_ALL); });
    /* chart series color picker  #chartSeriesColor*/
    $('#chartSeriesColor').colpick({
                                   layout: 'full',
                                   submit: 0,
                                   onChange: function (hsb, hex, rgb, el, bySetColor) {
                                   $(".colorHandler",'#chartSeriesColor').css("background", "#" + hex);
                                   if (bySetColor)
                                        return;
                                   var seria  = document.getElementById('chart__axis--series').value;
                                   setColorForChartSeriesSelection("#" + hex, seria);
                                   },
                                   onSubmit: function (hsb, hex, rgb, el) {
                                   $(el).colpickHide();
                                   }
                                   });
    $('#chartBorderColor').colpick({
                                   layout: 'full',
                                   submit: 0,
                                   onChange: function (hsb, hex, rgb, el, bySetColor) {
                                   $(".colorHandler",'#chartBorderColor').css("background", "#" + hex);
                                   if (bySetColor)
                                        return;
                                    setColorForChartBorder("#" + hex);
                                   },
                                   onSubmit: function (hsb, hex, rgb, el) {
                                   // Code for Auto
                                   setColorForChartBorder(chartsDefaultBorderColor);
                                   $(el).colpickHide();
                                   }
                                   });
    /* remove "auto" button */
    var chartSeriesColorId = $('#chartSeriesColor').data('colpickId');
    var chartSeriesColorIdElement = $("#"+chartSeriesColorId);
    chartSeriesColorIdElement.find('.colpick_submit').each(function(i, item){    item.remove(); });
    chartSeriesColorIdElement.height(chartSeriesColorIdElement.height() - 30);
}
 
//type - 0 - background; 1 - foreground;
function setColorForSelection(color, type) {
    var spread = $("#ss").wijspread("spread");
    var sheet = spread.getActiveSheet();
    sheet.isPaintSuspended(true);
    var sels = sheet.getSelections();
    for (var n = 0; n < sels.length; n++) {
        var sel = getActualCellRange(sels[n], sheet.getRowCount(), sheet.getColumnCount());
        var cells = sheet.getCells(sel.row, sel.col, sel.row + sel.rowCount - 1, sel.col + sel.colCount - 1,
            spreadNS.SheetArea.viewport);
        if (type == 1)
            cells.foreColor(color);
        else
            cells.backColor(color);
    }
    sheet.isPaintSuspended(false);
}
 
function undo() {
    var spread = $("#ss").wijspread("spread");
    var sheet = spread.getActiveSheet();
    spreadNS.SpreadActions.undo.call(sheet);
}
 
function redo() {
    var spread = $("#ss").wijspread("spread");
    var sheet = spread.getActiveSheet();
    spreadNS.SpreadActions.redo.call(sheet);
}
 
function onScroll(event) {
    if (event.wheelDeltaX != 0 && Math.abs(event.wheelDeltaX) > Math.abs(event.wheelDeltaY))
        $("#ss").wijspread("spread")._scrollbarH._scrollContainerMousewheel(event);
    else if (event.wheelDeltaY != 0)
        $("#ss").wijspread("spread")._scrollbarV._scrollContainerMousewheel(event);
}
 
function initTips() {
    var spread = $("#ss").wijspread("spread");
    spread.showScrollTip(3);
    spread.showResizeTip(3);
    spread.showDragDropTip(true);
    spread.showDragFillTip(true);
}
 
$(document).ready(function () {
                   
    document.oncontextmenu = function (event) {
        mousePos = {
            x: event.pageX,
            y: event.pageY
        };
    };
                   
    // format panel helpers
    $.cssHooks.backgroundColor = {
        get: function (elem) {
            if (elem.currentStyle)
                var bg = elem.currentStyle["backgroundColor"];
            else if (window.getComputedStyle)
                var bg = document.defaultView.getComputedStyle(elem,
                    null).getPropertyValue("background-color");
            if (bg.search("rgb") == -1 || bg.search("rgba") != -1)
                return "";
            else {
                bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                function hex(x) {
                    return ("0" + parseInt(x).toString(16)).slice(-2);
                }
                return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
            }
        }
    }
    onResize();
    // init spread
    if (isDefined(defSheetName) && (typeof defSheetNameLocValue == 'function'))
        defSheetNameLocValue();
    $("#ss").wijspread({ sheetCount: 1 }); // create wijspread widget instance
    $("#ssForSave").wijspread({ sheetCount: 1 });
    initTips()
    // get instance of wijspread widget
    var spread = $("#ss").wijspread("spread");
    spread.useWijmoTheme = true;
    spread.repaint();
    // get active worksheet of the wijspread widget
    var sheet = spread.getActiveSheet();
    // bind event when selection is changed
    spread.bind(GcSpread.Sheets.Events.SelectionChanged, selectionChanged);
    spread.bind(GcSpread.Sheets.Events.UserZooming,spreadUserZooming);
    // Formula box
    var fbx = new spreadNS.FormulaTextBox(document.getElementById('formulabox'));
    fbx.spread(spread);
    // default cell style
    var style = new spreadNS.Style();
    style.hAlign = 2;
    style.vAlign = 2;
    style.name = 'styleDefNumber';
    //                          style.formatter = data.namedStyles[i].formatter;
    spread.addNamedStyle(style);
    selectionChanged();
 
    var activeSheet = spread.getActiveSheet();
    activeSheet.setActiveCell(0, 0);
 
    activeSheet.bind(spreadNS.Events.ClipboardPasted, clipboardPasted);
    spread.bind(spreadNS.Events.ActiveSheetChanged, activeSheetChanged);
    spread.bind(spreadNS.Events.SheetTabClick, function (sender, args) {
        if (args.sheet === null && args.sheetName === null) {
            setTimeout(function () {
                var activeSheet = spread.getActiveSheet();
                var defStyle = new spreadNS.Style();
                defStyle.vAlign = 2;
                activeSheet.setDefaultStyle(defStyle);
                activeSheet.isPaintSuspended(true);
                       //TODO:
//                for (var i = 0; i < activeSheet.getRowCount() ; i++) {
//                    for (var j = 0; j < activeSheet.getColumnCount() ; j++) {
//                        activeSheet.getCell(i, j).vAlign(2);
//                    }
//                }
                activeSheet.isPaintSuspended(false);
            }, 300);
        }
    });
    initRibbon();
    sheetRemoveKeyMap(activeSheet);
    updateFontStyle();
    if (document.getElementById('copyChartToClipboard'))
        initChartPanelCopyToClipboard();
});

function initChartPanelCopyToClipboard() {
    /* Chart Panel: Copy Button */
    var clipboard = new ClipboardJS('#copyChartToClipboard');
    clipboard.on('success', function(e) {
        $('#imgtocopy').src = ''; /*   $('#imgtocopy').hide(); */
        e.clearSelection();
    });
    document.getElementById('copyChartToClipboard').addEventListener('click', function(e){
        chartPrepareImg();
    });
    clipboard.on('error', function(e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });
    /* patch: adding "uk-button" in html results in adding extra event handler calling spreadAction()
    See:
    $(".uk-button").click(function (event) { ribbonClick(event, this.id) });
    in InitRibbon() method. */
    $("#copyChartToClipboard").addClass("uk-button");
}
 
function sheetRemoveKeyMap(arg) {
    arg.removeKeyMap(90, false, false, false, true);
}
 
function activeSheetChanged(sender, args) {
    updateWindowControllerZoom(args.newSheet.zoom()*100);
    args.oldSheet.unbind(spreadNS.Events.ClipboardPasted, clipboardPasted);
    args.newSheet.bind(spreadNS.Events.ClipboardPasted, clipboardPasted);
    sheetRemoveKeyMap(args.newSheet);
    setTimeout(selectionChanged, 300);
    if (typeof printPanelUpdateSheet === 'function')
        printPanelUpdateSheet();
}
 
 
function clipboardPasted(sender, args) {
    for (var i =0; i < args.cellRange.colCount;i++){
        for (var j = 0; j< args.cellRange.rowCount;j++){
            if($.isNumeric(args.sheet.getValue(args.cellRange.row+j,args.cellRange.col+i))){
                args.sheet.setStyleName(args.cellRange.row+j, args.cellRange.col+i, 'styleDefNumber');
            }
        }
    }
 
    selectionChanged();
    autofitSelection();
}
 
function setFormatter(formatter){
    var spread = $("#ss").wijspread("spread");
    var style = spread.getNamedStyle('styleDefNumber');
    if(!style)return;
    style.formatter=formatter;
    var activeSheet = spread.getActiveSheet();
    activeSheet.repaint();
}
 
function autofitSelection() {
    var minWidth = 64;
    var spread = $("#ss").wijspread("spread");
    var sheet = spread.getActiveSheet();
    var selections = sheet.getSelections();
    var selection = getActualCellRange(selections[selections.length - 1], sheet.getRowCount(), sheet.getColumnCount());
    for (var i = selection.col; i < selection.colCount + selection.col; i++) {
        sheet.autoFitColumn(i);
        if (sheet.getColumnWidth(i) < minWidth)
            sheet.setColumnWidth(i, minWidth);
    }
}
 
function selectionChanged(sender, args) {
    $("#positionbox").val(getSelectionAddress().range);
    updateFontStyle();
     
    var spread = $("#ss").wijspread("spread");
    var sheet = spread.getActiveSheet();
    var selections = sheet.getSelections();
    var selection = getActualCellRange(selections[selections.length - 1], sheet.getRowCount(), sheet.getColumnCount());
    var isChanged = sheet.hasPendingChanges();
    if ((selection.col + selection.colCount - 1) == sheet.getColumnCount() - 1)
        sheet.addColumns(sheet.getColumnCount(), 1);
    if ((selection.row + selection.rowCount - 1) == sheet.getRowCount() - 1)
        sheet.addRows(sheet.getRowCount(), 1);
    if (!isChanged)
        sheet.clearPendingChanges();
    platformSelectionChanged();
    if (typeof panelChartEditDisable === 'function')
        panelChartEditDisable();
}
 
// selects size from font size selector (in pt). if option
function selectFontSize(sizePt,forcePx) {
    var sz = parseInt(sizePt,10);
    if ((sizePt.indexOf("px") >0) || forcePx)
    {
        sz = Math.round(sz * 72 / 96);
    }
    if (sz < 5 || sz > 96) sz = defFontSize;
    var szpt = sz + "pt";
    if ($("#fontSize option[value='"+szpt+"']").length > 0)
        $("#fontSize option[value='" + szpt + "']").prop("selected", true);
    else {
        var optn = new Option(sz,szpt);
        optn.selected=true;
        var fss = document.getElementById("fontSize");
        var idx = null;
        for (i = 0; i < fss.options.length; i++)
            if (parseInt(fss.options[i].value,10) > sz)
            {
                idx = i;
                break;
            }
        /*  jQuery for $('#fontSize').append("<option value='"+szpt+"'>"+sz+"</option>"); */
        if (idx == null)
            fss.add(optn);
        else
            fss.add(optn,fss[idx]);
    }
}
 
function updateFontStyle() {
    var spread = $("#ss").wijspread("spread");
    var sheet = spread.getActiveSheet();
 
    markImgCheckbox("bold", false);
    markImgCheckbox("italic", false);
    markImgCheckbox("underline", false);
    $("#wrapText").prop('checked', false);
    markImgCheckbox("leftAlign", false);
    markImgCheckbox("centerAlign", false);
    markImgCheckbox("rightAlign", false);
    markImgCheckbox("topAlign", false);
    markImgCheckbox("middleAlign", false);
    markImgCheckbox("bottomAlign", false);
    var styleElem = document.getElementById("styleElem");
    var curentCell = sheet.getCell(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex(), spreadNS.SheetArea.viewport);
    if (!sheet.getSpan(curentCell.row, curentCell.col, spreadNS.SheetArea.viewport))
        $("#unmerge").attr("disabled", "disabled");
    else
        $("#unmerge").removeAttr('disabled');
    var font = curentCell.font();
    if (font != undefined)
        styleElem.style.font = font;
    else
        styleElem.style.font = "10pt Arial";
    if (styleElem.style.font.search("bold ") != -1)
        markImgCheckbox("bold", true);
    if (styleElem.style.font.search("italic ") != -1)
        markImgCheckbox("italic", true);
 
    var fontStyle = styleElem.style.fontFamily,
        fontSize = styleElem.style.fontSize;
    var sizeInPx = false;
    if (!fontStyle || !fontSize)
        try {
            sizeInPx = ( styleElem.style.font.indexOf("px") >0);
            var fontArr = styleElem.style.font.replace("px", "pt").replace("/normal", "").split("pt");
            if (fontArr.size > 1) {
            fontStyle = fontArr[1].replace(/\s/g, "");
            fontArr = fontArr[0].split(" ");
            fontSize = fontArr[fontArr.length - 1] + "pt";
            }
        } catch(err) {}
    $("#fontStyle").children().removeAttr("selected");
    $("#fontSize").children().removeAttr("selected");
    if (fontStyle) {
    $("#fontStyle option[value=" + fontStyle.replace(/\s/g, "") + "]").prop("selected", true);
    }
    if (fontSize) {
        selectFontSize(fontSize,sizeInPx);
    }
    if (curentCell.textDecoration() == spreadNS.TextDecorationType.Underline)
        markImgCheckbox("underline", true);
    if (curentCell.wordWrap() == true)
        $("#wrapText").prop('checked', true);
    switch (curentCell.hAlign()) {
        case 0:
            markImgCheckbox("leftAlign", true);
            break;
        case 1:
            markImgCheckbox("centerAlign", true);
            break;
        case 2:
            markImgCheckbox("rightAlign", true);
            break;
        default:
    }
    switch (curentCell.vAlign()) {
        case 0:
            markImgCheckbox("topAlign", true);
            break;
        case 1:
            markImgCheckbox("middleAlign", true);
            break;
        case 2:
            markImgCheckbox("bottomAlign", true);
            break;
        default:
    }
    $('#backgroundColor').colpickHide();
    $('#fontColor').colpickHide();
    var backColor = curentCell.backColor() != undefined ? curentCell.backColor() : "#FFFFFF";
    $('#backgroundColor').colpickSetColor(backColor.replace("#", ""));
    var fontColor = curentCell.foreColor() != undefined ? curentCell.foreColor() : "#000000";
    $('#fontColor').colpickSetColor(fontColor.replace("#", ""));
}
 
function getActualCellRange(cellRange, rowCount, columnCount) {
    if (isDefined(cellRange))
    if (cellRange.row == -1 && cellRange.col == -1) {
        return new spreadNS.Range(0, 0, rowCount, columnCount);
    }
    else if (cellRange.row == -1) {
        return new spreadNS.Range(0, cellRange.col, rowCount, cellRange.colCount);
    }
    else if (cellRange.col == -1) {
        return new spreadNS.Range(cellRange.row, 0, cellRange.rowCount, columnCount);
    }
    return cellRange;
}
 
function onResize() {
    if (!needsResize)
        return;
    if (!$("#ss").is(':empty')){
        getSpreadJS().getActiveSheet().isPaintSuspended(true);
    }
    var height = Math.max(document.documentElement.clientHeight, parseInt($("body").css("min-height")))
        - formulaBar.clientHeight;
    $("#ss").height(height);
    var width = document.documentElement.clientWidth - (($(".rightMenuPanel").is(":visible") ) ? $(".rightMenuPanel").width() : 0);
     
    $("#ss").width(width);
    $("#formulaBar").width(width - 5);
    if (!$("#ss").is(':empty')) {
        getSpreadJS().getActiveSheet().isPaintSuspended(false);
        getSpreadJS()._doResize();
    }
}
 
$(window).resize(onResize)
 
function getSpreadsheets() {
    var spread = $("#ss").wijspread("spread");
    var sheets = spread.sheets;
    var arr = [];
    for (var i = 0; i < sheets.length; i++) {
        arr.push([sheets[i]._name]);
    }
    var sheetName = spread.getActiveSheet()._name;
    var workbookName = "";
    var arr1 = [arr,workbookName, sheetName];
    return arr1;
}
 
function getFirstRow(sheetName) {
    var spread = $("#ss").wijspread("spread");
    var sheet = spread.getSheetFromName(sheetName);
    var rowIndex = 0;
    var lastDirtyCellIndex = sheet.getColumnCount() - 1;
    var arr = [];
    for (var i = 0; i <= lastDirtyCellIndex; i++) {
        arr.push(sheet.getValue(rowIndex, i));
    }
    return arr;
}
 
function getSelectionAddress() {
    var spread = $("#ss").wijspread("spread");
    var sheet = spread.getActiveSheet();
    var selections = sheet.getSelections();
    var selection = getActualCellRange(selections[selections.length - 1], sheet.getRowCount(), sheet.getColumnCount());
    var position;
    position = sheet.getText(0, selection.col, spreadNS.SheetArea.colHeader)
               + sheet.getText(selection.row, 0, spreadNS.SheetArea.rowHeader);
    if (selection.colCount > 1 || selection.rowCount > 1) {
        position += ":" + sheet.getText(0, selection.col + selection.colCount - 1, spreadNS.SheetArea.colHeader)
               + sheet.getText(selection.row + selection.rowCount - 1, 0, spreadNS.SheetArea.rowHeader);
    }
                
    var result = {sheet: sheet._name, range: position};
    return result;
    return sheet._name+"!"+position;
}
 
function getData(firstRow, firstCol, lastRow, lastCol, sheetName) {
    var spread = $("#ss").wijspread("spread");
    var sheet = spread.getSheetFromName(sheetName);
    var lastDirtyRowIndex = sheet.getRowCount() - 1;
    if (lastRow<0 || lastRow>lastDirtyRowIndex){
        lastRow = lastDirtyRowIndex;
    }
    var arr = [];
    for (var i = firstRow; i <= lastRow; i++) {
        var col = [];
        for (var j = firstCol; j <= lastCol; j++) {
            col.push(sheet.getValue(i, j));
        }
        arr.push(col);
    }
    return arr;
}
 
function getNextSheetTitle(title){
    var spread = $("#ss").wijspread("spread");
    if (spread.getSheetFromName(title) == null)
        return title;
    else
        for (var i = 1; i < 9999; i++)
            if (spread.getSheetFromName(title + "(" + i + ")") == null) {
                return title + "(" + i + ")";
            }
    return title;
 
}
 
function addRawData(data, title) {
    var spread = $("#ss").wijspread("spread");
    spread.addSheet(spread.getSheetCount());
    var sheet = spread.setActiveSheetIndex(spread.getSheetCount() - 1);
    sheet = spread.getActiveSheet();
    sheet.isPaintSuspended(true);
    sheet.setName(getNextSheetTitle(title));
    if(data.length==0){
        return
    }
    var colCnt = data[0].length;
    sheet.setColumnCount(Math.max(colCnt, 20));
    sheet.setRowCount(Math.max(data.length, 200));
    sheet.setArray(0, 0,data);
//    <!--        for (var i = 0; i < data[0].length; i++) {-->
//        <!--            for (var k = 0; k < data.length; k++) {-->
//            <!--                sheet.setValue(k, i, data[k][i]);-->
//            <!--            }-->
//        <!--            sheet.autoFitColumn(i);-->
//        <!--        }-->
    sheet.isPaintSuspended(false);
    sheetRemoveKeyMap(sheet);
    selectionChanged();
}
 
 
function populateSpreadFromJson(data,colCount){
    var spread = $("#ss").wijspread("spread");
    spread.isPaintSuspended(true);
    spread.fromJSON(data);
    sheet = spread.getActiveSheet();
//    <!--        for (var i = 0; i < colCount; i++) {-->
//        <!--            sheet.autoFitColumn(i);-->
//        <!--        }-->
     
    spread.isPaintSuspended(false);
}

function showAnalysisResult(data, title) {
    return showAnalysisResultSheet(data,title,true,false);
}

// parse analysis report
function showAnalysisResultSheet(data, title, newSheet, disableAddNewSheet) {
    if (data.status == "success") {
        var spread = getSpreadJS();
        //        spread.addSheet(spread.getSheetCount());
        if (newSheet)
            spread._tab.doNewTabClick(0);
        if (disableAddNewSheet)
            spread.newTabVisible(false); 
        var sheet = spread.setActiveSheetIndex(spread.getSheetCount() - 1);
        sheet = spread.getActiveSheet();
        sheet.isPaintSuspended(true);
        sheet.setName(getNextSheetTitle(title));
        if(data.namedStyles && data.namedStyles.length)
        for (var i =0,len=data.namedStyles.length; i<len;i++){
            var style = new spreadNS.Style();
            style.hAlign = data.namedStyles[i].hAlign;
            style.vAlign = data.namedStyles[i].vAlign;
            style.name = data.namedStyles[i].name;
            style.formatter = data.namedStyles[i].formatter;
            spread.addNamedStyle(style);
        }
        var defStyle = new spreadNS.Style();
        defStyle.font = defFontSize.toString() + "pt " + defFont;
        defStyle.vAlign = 2;
        sheet.setDefaultStyle(defStyle);
        sheet.setColumnCount(Math.max(data.width, 20));
        sheet.setRowCount(Math.max(data.height, 200));
        if (data.frozenCols > 0) sheet.setFrozenColumnCount(data.frozenCols);
        if (data.frozenRows > 0) sheet.setFrozenRowCount(data.frozenRows);
        for (var i = 0; i < data.width; i++) {
            for (var k = 0; k < data.height; k++) {
                var cell = data.data[k][i];
                if (cell) {
                    /* for direct out rec:  for (var j = 0; j < data.dataCount; j++) { for (var k = 0; k < data.height; k++) {
                    var cell = data.data[j];var i = cell.Col;var k = cell.Row;*/
                    var sheetCell = sheet.getCell(k, i);
                    if (cell.Style){
                        sheet.setStyleName(k, i, cell.Style);
                        }
                        if (cell.CellFormat) {
                            sheetCell.formatter(cell.CellFormat);
                            sheet.setValue(k, i, cell.Value.replace(",", "."));
                        }
                        else
                            sheet.setValue(k, i, cell.Value);
                        if (cell.HexBackColor)
                            sheetCell.backColor(cell.HexBackColor);
                        if (cell.HexFontColor)
                            sheetCell.foreColor(cell.HexFontColor);
                if (cell.HorzAlign)
                        sheetCell.hAlign(cell.HorzAlign);
                if (cell.VertAlign)
                        sheetCell.vAlign(cell.VertAlign);
                switch (cell.FontStyle) {
                            case 0:
                            case 1:
                            case 2:
                            {
                                var styleElem = document.getElementById("styleElem");
                                var cellFs = defFontSize;
                                if (cell.FontSizeInc != 0) cellFs += cell.FontSizeInc;
                                styleElem.style.font = sheetCell.font();
                                if (styleElem.style.font == undefined || cell.FontSizeInc != 0)
                                    styleElem.style.font = cellFs.toString() + "pt " + defFont;
                                if (cell.FontStyle & 1)
                                    styleElem.style.fontWeight = "bold";
                                if (cell.FontStyle & 2)
                                    styleElem.style.fontStyle = "italic";
                                sheetCell.font(styleElem.style.font);
                                break;
                            }
                            case 4:
                            {
                                sheetCell.textDecoration(spreadNS.TextDecorationType.Underline);
                                break;
                            }
                            default:
                        }
                    // parse color and width
                    /* TODO broken border for merged cells: Use BorderWidth 1 = spreadNS.LineStyle.medium, 2 = spreadNS.LineStyle.thick, 3 = spreadNS.LineStyle.double*/                
                    if (cell.ColMerge > 0)
                            sheet.addSpan(sheetCell.row, sheetCell.col, 1, cell.ColMerge);
                    if (cell.RowMerge > 0)
                            sheet.addSpan(sheetCell.row, sheetCell.col, cell.RowMerge, 0);
                    if (cell.Border) {
                    parseCellBorder(cell.Border[0], function (borderline) { sheetCell.borderLeft(borderline); });
                    parseCellBorder(cell.Border[1], function (borderline) { sheetCell.borderTop(borderline); });
                    parseCellBorder(cell.Border[2], function (borderline) { sheetCell.borderRight(borderline); });
                    parseCellBorder(cell.Border[3], function (borderline) { sheetCell.borderBottom(borderline); });
                    }
                }
                }
                    sheet.autoFitColumn(i);
                    var minWidth = 64;
                    if (sheet.getColumnWidth(i) < minWidth)
                        sheet.setColumnWidth(i, minWidth);
                    else sheet.setColumnWidth(i,sheet.getColumnWidth(i) * 1.1);
             
 
                }
                if (data.charts)
                for (var i = 0; i < data.charts.length; i++) {
                    try {
                        createChart(sheet, data.charts[i]);
                    }catch(e){}
                }
                sheet.isPaintSuspended(false);
                selectionChanged();
                spread._tab.doNavButtonClick(3);
                sheetRemoveKeyMap(sheet);
                if (sheet.printInfo()) sheet.printInfo().fitPagesWide(1);
            }
}
 
// parse color and width
function parseCellBorder(borderObj, cellCallback) {
    if (!borderObj) return;
    if (borderObj.Width) {
 
        var borderColor = (borderObj.Color) ? borderObj.Color : "black";
        var borderLine = 1; //$.wijmo.wijspread.LineStyle.thin;
        if (borderObj.Width == 2) borderLine = 2;//$.wijmo.wijspread.LineStyle.medium; OR thick = 5
        else if (borderObj.Width == 3) borderLine = 6;//$.wijmo.wijspread.LineStyle.double;
        cellCallback(new $.wijmo.wijspread.LineBorder(borderColor, borderLine));
    }
}
 
// adds chart from "options" JSON to the "sheet"
function createChart(sheet, options) {
    var ns = spreadNS;
    var chartContainer;
     // TODO: add hash
    var id = options.name ? options.name : options.title + sheet.getFloatingObjects().length;
    zoom = getZoom();
    var customZoom = zoom && (zoom != 100) && (zoom > 0);
    var zoomRatio = getZoom() / 100.0;
    if (customZoom) {
        if (options.height) options.height = options.height * 100.0 / zoom;
        if (options.width) options.width = options.width * 100.0 / zoom ;
    }
    try {
        if (options.row + options.cheight > sheet.getRowCount())
            sheet.setRowCount(options.row + options.cheight + 30);
        if (options.col + options.cwidth > sheet.getColumnCount())
            sheet.setColumnCount(options.col + options.cwidth + 10);
    }catch(err) {}
    var recreateChart  = function (container, options, zoom) {
        if (container) {
            chartContainer.innerHTML = "";
            chartD3 = new D3Chart(d3.select(chartContainer));
            if (zoom)
                chartD3.setZoom(zoom);
            chartD3.createChart(floatChart["options"]);
        }
    };
 
    var updateChart = function (container, options, zoom) {
        recreateChart(container,options,zoom);
        if (container) floatChart["chartContainer"] = chartContainer;
    };
    sheet.bind(ns.Events.CustomFloatingObjectLoaded, function (sender, args) {
        if (args.customFloatingObject == null || args.customFloatingObject.name() !== id) {
            return;
        }
        chartContainer = args.element;
        updateChart(chartContainer, floatChart["options"],zoomRatio);
    });
    sheet.bind(ns.Events.FloatingObjectRemoved, function (sender, args) {
               if (typeof panelChartEditDisable === 'function') panelChartEditDisable();
               });
    sheet.bind(ns.Events.FloatingObjectChanged, function (sender, args) {
        /* update selected charts array */
        if (args.propertyName == "isSelected") {
            if (args.floatingObject._isSelected) {
                if(focusedCharts.indexOf(args.floatingObject._name) == -1)
                    focusedCharts.push(args.floatingObject._name);
            }
            else
                focusedCharts.splice(focusedCharts.indexOf(args.floatingObject._name), 1);
        }
        if ((focusedCharts.length < 1) && typeof panelChartEditDisable === 'function')
               panelChartEditDisable();
        /* event from another chart? if yes - exit */
        if (args.floatingObject == null || args.floatingObject._name !== id) {
            return;
        }
        if (args.propertyName === "width" || args.propertyName === "height") {
            var newWidth = args.floatingObject._location.width * (getZoom() / 100);
            var newHeight = args.floatingObject._location.height * (getZoom() / 100);
            if ((Math.abs(floatChart["options"].width - newWidth) > 2) || (Math.abs(floatChart["options"].height - newHeight)>2)) {
                floatChart["options"].width = newWidth;
                floatChart["options"].height = newHeight;
                recreateChart(chartContainer,floatChart["options"],getZoom() / 100);
            } else
                console.log("---> skip!");
        }
        if ((focusedCharts.length > 0) && typeof panelChartEditEnable === 'function') {
                // TODO: check if the same chart is selected and skip rebuilding the panel 
                panelChartEditEnable(args.floatingObject);
            }
    });
 
    if (!options.height) {
        options.height = getRowsHeight(options.row, options.row + options.cheight);
        if (options.height > 120) options.height -= 2;
    }
    if (!options.width) {
        options.width = getColsWidth(options.col, options.col + options.cwidth)
        if (options.width > 120) options.width -= 2;
    }
    var floatChart = new ns.CustomFloatingObject(id, getColsWidth(0, options.col), getRowsHeight(0, options.row), options.width, options.height);
    floatChart.startRow(options.row);
    floatChart.startColumn(options.col);
//    floatChart.endRow(options.row+options.cheight);
//    floatChart.endColumn(options.col+options.cwidth);
     
    floatChart["options"] = options;
    floatChart["repaint"] = function(options, zoom){
        updateChart(chartContainer, options, zoom);
    };
    /* add to spreadJS */
    var chart = document.createElement("div");
    var borderColor = "#e6e6e6"; 
    // $(chart).attr("style", "background:white; border:1px solid "+borderColor);
    $(chart).attr("style", "background:white;");
    var chartD3 = new D3Chart(d3.select(chart));
    chartD3.setZoom(zoomRatio);
    options.width *= zoomRatio;
    options.height *= zoomRatio;
    chartD3.createChart(options);
    floatChart.Content(chart);
    sheet.addFloatingObject(floatChart);
}
 
function getRowsHeight(from, to) {
    var sheet = $("#ss").wijspread("spread").getActiveSheet();
 
    if (from < 0 || to >= sheet.getRowCount() || from > to)
        return 0;
 
    var height = 0;
    for (var i = from; i < to; i++) {
        height += sheet.getRow(i).height();
    }
    return height;
}
 
function getColsWidth(from, to) {
    var sheet = $("#ss").wijspread("spread").getActiveSheet();
 
    if (from < 0 || to >= sheet.getColumnCount() || from > to)
        return 0;
 
    var width = 0;
    for (var i = from; i < to; i++) {
        width += sheet.getColumn(i).width();
    }
    return width;
}
 
function getColumnByWidth(width) {
    var sheet = $("#ss").wijspread("spread").getActiveSheet();
    var curWidth = 0;
    var colIndex = -1;
    do {
        colIndex++;
        curWidth += sheet.getColumn(colIndex).width();
    } while (curWidth <= width && colIndex < sheet.getColumnCount())
    return colIndex;
}
 
function getRowByHeight(height) {
    var sheet = $("#ss").wijspread("spread").getActiveSheet();
    var curHeight = 0;
    var rowIndex = -1;
    do {
        rowIndex++;
        curHeight += sheet.getRow(rowIndex).height();
    } while (curHeight < height && rowIndex < sheet.getRowCount())
    return rowIndex;
}
 
 
function getCssValuePrefix() {
    var rtrnVal = '';
    var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];
     
    var dom = document.createElement('div');
     
    for (var i = 0; i < prefixes.length; i++) {
        dom.style.background = prefixes[i] + 'liner-gradient(#000000, #ffffff)';
         
        if (dom.style.background) {
            rtrnVal = prefixes[i];
        }
    }
    dom = null;
    delete dom;
    return rtrnVal;
}
 
// returns all charts as JSON
function getChartsJson() {
    var spread = getSpreadJS();
    var charts = [];
    for (var i = 0; i < spread.sheets.length; i++) {
        var sheetCharts = spread.getSheet(i).getFloatingObjects();
        for (var k = 0; k < sheetCharts.length; k++) {
            sheetCharts[k].options.col = sheetCharts[k].startColumn();/*getColumnByWidth(sheetCharts[k]._location.x);*/
            sheetCharts[k].options.row = sheetCharts[k].startRow();/*getRowByHeight(sheetCharts[k]._location.y);*/
            charts.push({
                "sheetIndex": i,
                "options": sheetCharts[k].options
            });
        }
    }
    return charts;
}
 
// save workbook as JSON
function spreadToJson() {
    var spread = getSpreadJS();
    var spreadToSave = $("#ssForSave").wijspread("spread");
    spreadToSave.fromJSON(spread.toJSON());
 
    var sheet = spread.getActiveSheet();
    var isChanged = sheet.hasPendingChanges();
 
    for (var i = 0; i < spreadToSave.sheets.length; i++) {
        var sheetCharts = spreadToSave.getSheet(i).getFloatingObjects();
        for (var k = 0; k < sheetCharts.length; k++) {
            spreadToSave.getSheet(i).removeFloatingObject(sheetCharts[k].name())
        }
    }
 
    if (!isChanged)
        sheet.clearPendingChanges();
 
    return JSON.stringify({
        "workbook": spreadToSave.toJSON(),
        "charts": getChartsJson()
    });
}
 
// load workbook from JSON
function loadDataFromJson(jsonData) {
    var spread = $("#ss").wijspread("spread");
    var spreadJSON = jsonData;//JSON.parse(jsonData);
 
    spread.fromJSON(spreadJSON.workbook);
    var sheet = spread.getActiveSheet();
    var isChanged = sheet.hasPendingChanges();
    if (sheet.getColumnCount() < 15) sheet.addColumns(sheet.getColumnCount(), 5);
    if (sheet.getRowCount() < 50)    sheet.addRows(sheet.getRowCount(), 5);
    if (!spread.showHorizontalScrollbar()) spread.showHorizontalScrollbar(true);
    if (!spread.showVerticalScrollbar()) spread.showVerticalScrollbar(true);
    if (!spread.tabStripVisible()) spread.tabStripVisible(true);
    if (spreadJSON.charts)
    for (var i = 0; i < spreadJSON.charts.length; i++) {
        var chart = spreadJSON.charts[i];
        createChart(spread.getSheet(chart.sheetIndex), chart.options);
    }
    if (!isChanged)
        sheet.clearPendingChanges();
    if (typeof closeAnyWindow === 'function')
        closeAnyWindow();
    return 1;
}
 
 
function getSortedRowSelections(sheet) {
    var sortedRanges = sheet.getSelections();
    for (var i = 0; i < sortedRanges.length - 1; i++) {
        for (var j = i + 1; j < sortedRanges.length; j++) {
            if (sortedRanges[i].row < sortedRanges[j].row) {
                var temp = sortedRanges[i];
                sortedRanges[i] = sortedRanges[j];
                sortedRanges[j] = temp;
            }
        }
    }
    return sortedRanges;
};
 
function getSortedColumnSelections(sheet) {
    var sortedRanges = sheet.getSelections();
    for (var i = 0; i < sortedRanges.length - 1; i++) {
        for (var j = i + 1; j < sortedRanges.length; j++) {
            if (sortedRanges[i].col < sortedRanges[j].col) {
                var temp = sortedRanges[i];
                sortedRanges[i] = sortedRanges[j];
                sortedRanges[j] = temp;
            }
        }
    }
    return sortedRanges;
};
 
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (s) {
        return this.length >= s.length && this.substr(this.length - s.length) == s;
    }
}
 
 
function GetColumnName(columnNumber) {
    var dividend = columnNumber;
    var columnName = "";
    var modulo;
    while (dividend > 0) {
        modulo = (dividend - 1) % 26;
        columnName = String.fromCharCode(65 + modulo) + columnName;
        dividend = Math.floor((dividend - modulo) / 26);
    }
    return columnName;
}
 
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
};

if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
                          enumerable: false,
                          configurable: true,
                          writable: true,
                          value: function(target, firstSource) {
                          'use strict';
                          if (target === undefined || target === null) {
                          throw new TypeError('Cannot convert first argument to object');
                          }
                          
                          var to = Object(target);
                          for (var i = 1; i < arguments.length; i++) {
                          var nextSource = arguments[i];
                          if (nextSource === undefined || nextSource === null) {
                          continue;
                          }
                          
                          var keysArray = Object.keys(Object(nextSource));
                          for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                          var nextKey = keysArray[nextIndex];
                          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                          if (desc !== undefined && desc.enumerable) {
                          to[nextKey] = nextSource[nextKey];
                          }
                          }
                          }
                          return to;
                          }
                          });
}
 
//Get the selection area's type
function getSelectionType(spread) {
    var selections = spread.getActiveSheet().getSelections();
    var selectionType;
    for (var i = 0; i < selections.length; i++) {
        var selection = selections[i];
        if (selection.col == -1 && selection.row == -1) {
            return 0 /* Sheet */;
        } else if (selection.row == -1) {
            if (selectionType == undefined) {
                selectionType = 2 /* OnlyColumn */;
            } else if (selectionType != 2 /* OnlyColumn */) {
                return 4 /* Mixture */;
            }
        } else if (selection.col == -1) {
            if (selectionType == undefined) {
                selectionType = 1 /* OnlyRow */;
            } else if (selectionType != 1 /* OnlyRow */) {
                return 4 /* Mixture */;
            }
        } else {
            if (selectionType == undefined) {
                selectionType = 3 /* OnlyCells */;
            } else if (selectionType != 3 /* OnlyCells */) {
                return 4 /* Mixture */;
            }
        }
    }
    return selectionType;
}
 
function canInsertRight(sortedRanges,sheet) {
    var result = true;
    for (var i = 0; i < sortedRanges.length; i++) {
        var range = sortedRanges[i];
        var arrayFormulaRanges = [];
        var row = range.row;
        var col = range.col;
        var endRow = range.row + range.rowCount;
        var endCol = range.col + range.colCount;
        //find if the selection has a arrayFormula, if it has, push it's range to an Array
        for (var r = row; r < endRow; r++) {
            for (var c = col; c < endCol; c++) {
                var index;
                for (index = 0; index < arrayFormulaRanges.length; index++) {
                    if (arrayFormulaRanges[index].contains(r, c)) {
                        break;
                    }
                }
                if (index === arrayFormulaRanges.length) {
                    if (sheet.getFormulaInformation(r, c).isArrayFormula) {
                        arrayFormulaRanges.push(sheet.getFormulaInformation(r, c).baseRange)
                    }
                }
            }
        }
        if (arrayFormulaRanges.length === 0) {
            return result;
        }
        //find the border of all the arrayFormula Ranges.
        var left = arrayFormulaRanges[0].col;
        var top = arrayFormulaRanges[0].row;
        var bottom = arrayFormulaRanges[0].row + arrayFormulaRanges[0].rowCount;
        for (var j = 1; j < arrayFormulaRanges.length; j++) {
            if (arrayFormulaRanges[j].col < left) {
                left = arrayFormulaRanges[j].col;
            }
            if (arrayFormulaRanges[j].row < top) {
                top = arrayFormulaRanges[j].row;
            }
            if (arrayFormulaRanges[j].row + arrayFormulaRanges[j].rowCount < bottom) {
                bottom = arrayFormulaRanges[j].row + arrayFormulaRanges[j].rowCount;
            }
        }
        //if meet these conditions, then can't insert and shift cells right
        if (left < range.col || top < range.row || bottom > range.row + range.rowCount) {
            result = false;
            break;
        }
    }
    return result;
}
 
function canInsertDown(sortedRanges, sheet) {
    var result = true;
    for (var i = 0; i < sortedRanges.length; i++) {
        var range = sortedRanges[i];
        var arrayFormulaRanges = [];
        var row = range.row;
        var col = range.col;
        var endRow = range.row + range.rowCount;
        var endCol = range.col + range.colCount;
        //find if the selection has a arrayFormula, if it has, push it's range to an Array
        for (var r = row; r < endRow; r++) {
            for (var c = col; c < endCol; c++) {
                var index;
                for (index = 0; index < arrayFormulaRanges.length; index++) {
                    if (arrayFormulaRanges[index].contains(r, c)) {
                        break;
                    }
                }
                if (index === arrayFormulaRanges.length) {
                    if (sheet.getFormulaInformation(r, c).isArrayFormula) {
                        arrayFormulaRanges.push(sheet.getFormulaInformation(r, c).baseRange)
                    }
                }
            }
        }
        if (arrayFormulaRanges.length === 0) {
            return result;
        }
        //find the border of all the arrayFormula Ranges.
        var left = arrayFormulaRanges[0].col;
        var top = arrayFormulaRanges[0].row;
        var right = arrayFormulaRanges[0].col + arrayFormulaRanges[0].colCount;
        for (var j = 1; j < arrayFormulaRanges.length; j++) {
            if (arrayFormulaRanges[j].col < left) {
                left = arrayFormulaRanges[j].col;
            }
            if (arrayFormulaRanges[j].row < top) {
                top = arrayFormulaRanges[j].row;
            }
            if (arrayFormulaRanges[j].col + arrayFormulaRanges[j].colCount < right) {
                right = arrayFormulaRanges[j].row + arrayFormulaRanges[j].rowCount;
            }
        }
        //if meet these conditions, then can't insert and shift cells down
        if (left < range.col || top < range.row || right > range.col + range.colCount) {
            result = false;
            break;
        }
    }
    return result;
};

function spreadEnable() {
    var spread = getSpreadJS();
    for (i = 0; i < spread.getSheetCount(); i++)
        spread.getSheet(i).setIsProtected(false);
}

function spreadDisable() {
    var spread = getSpreadJS();
    if (spread.getActiveSheet() && spread.getActiveSheet().isEditing())
        getSpreadJS().getActiveSheet().endEdit();
    for (i = 0; i < spread.getSheetCount(); i++)
        spread.getSheet(i).setIsProtected(true);
    // OR spreadNS.SpreadActions.cancelInput.call(getSpreadJS().getActiveSheet()) ;
}