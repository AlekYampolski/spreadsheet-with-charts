/* Helper for running SpreadView in FMX app / WebKit */ 
function showDataInputWindowForId(methodId, groupId){
    eventPrepareDataInputWindow(methodId,groupId);
}

function showDataInputWindowJSON(jsonData) {    
    /* getDataInputWindow(methodId); */
    
    dataInputWindow = jsonData;

    
    showModalWindow();
}



function getDataInputWindow(cmdId) {
    return dataInputWindow;
}


function eventDataInputWindowDataReady(param){
    window.location.href = "host:webDataInputWindowReady("+param+")";
}

function eventPrepareDataInputWindow(cmdId,groupId){
    if (typeof groupId == 'undefined') groupId = 0;      
    console.log("eventPrepareDataInputWindow:"+cmdId+", group:"+groupId);
    window.location.href = "host:webPrepareDataInputWindow("+cmdId+","+groupId+")";
}

function eventAlertHost(msg){
    msg = msg.replaceAll(',','&comma;');
    msg = msg.replaceAll('(','&#40;');
    msg = msg.replaceAll(')','&#41;');
    window.location.href = "host:alertHost('"+msg+"')";
    console.log("alertHost("+msg+")");
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function panelChartEditDisable(floatingObject) {
    panelChartEditReset();
    hideAllPanels();
}

function panelChartEditEnable(floatingObject) {
    if (panelChartEditPrepare(floatingObject)) {
            hideAllPanels();
            showPanelById(ID_PANEL_CHART);
        }
}

/* data input flow procedures */

var spreadStatesConst = ["spread","cmdsmenu","diwindow","diselect"];
var spreadStateSpread = 0, spreadStateCmdsMenu = 1, spreadStateDataInputWindow = 2, spreadStateDataInputSelection = 3;
var spreadStateCurrent = 0;

function spreadCurrentState(newState) {
    if (typeof newState == 'undefined')     
        return spreadStatesConst[spreadStateCurrent];
    else {
        spreadStateCurrent = newState;
        webOnChangeState(spreadStatesConst[spreadStateCurrent]);
        return spreadStatesConst[spreadStateCurrent];
    }
}

function webOnChangeState(newState) {
    window.location.href = "host:webOnChangeState("+newState+")";
}

function webShowHelpID(aID) {
    window.location.href = "host:webShowHelpID("+aID+")";
}


function spreadGoBack() {
    if (spreadStateCurrent == spreadStateSpread) return "";
    else if (spreadStateCurrent == spreadStateCmdsMenu) {
        closeAnyWindow();
        return spreadCurrentState(spreadStateSpread);
    }
    else if (spreadStateCurrent == spreadStateDataInputWindow) {
        var curWindowId = selectedCmdId || $('#' + fcConsts.modalWindowId).find("." + fcConsts.dTitleCl).attr(fcConsts.attributeForId);
        closeAnyWindow();
        spreadCurrentState(spreadStateCmdsMenu);
        showCmdsMenu(curWindowId, selectedCmdGroupid);
        return spreadCurrentState();
    }
    else if (spreadStateCurrent == spreadStateDataInputSelection) {
        spreadCurrentState(spreadStateDataInputWindow);
        // click cancel on selection panel
        $("#pnlSelectRangeClose").click();
        return spreadCurrentState();
    }    
}

function spreadGoForward() {
    if (spreadStateCurrent == spreadStateSpread) {
        spreadCurrentState(spreadStateCmdsMenu);
        showCmdsMenu();
        return spreadCurrentState();        
    } else if (spreadStateCurrent == spreadStateCmdsMenu) {
        var btnStatus = $('#btn__run--btn__run--run-it-pls').css('display');
        if(btnStatus == "block"){
            //spreadCurrentState(spreadStateDataInputWindow);            
            $('#btn__run--btn__run--run-it-pls').click();
        }
        return spreadCurrentState();
    }
    else if (spreadStateCurrent == spreadStateDataInputWindow) {
        $('#dialog__actionBtns--ok').click();
        return spreadCurrentState();
    }
    else if (spreadStateCurrent == spreadStateDataInputSelection) {
        spreadCurrentState(spreadStateDataInputWindow);
        // click cancel on selection panel
        $("#pnlSelectRangeBtnRangeSelected").click();
        return spreadCurrentState();
    }    
}