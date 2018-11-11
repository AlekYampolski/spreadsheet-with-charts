/*
Read data from spread for each input field and option.
Version 1.00
*/ 

/* should we pass missing values as NaN? */
function getWriteNan() {
    return false;
}

function maxColForAnalysis() {
    return 65536;
}

function maxRowForAnalysis(){
    return 65536;
}

var labelsInFirstRow = false;

function stringToRange(rangeText, sheet) {
    var rowStr = rangeText.replace(/\D+/g, "");
    var colStr = rangeText.replace(rowStr, "");
    var row = Number(rowStr) - 1;
    var col = 0;
    var multiplier = 1
    for (var i = colStr.length - 1; i >= 0; i--) {
        col += (colStr.charCodeAt(0) - 64) * multiplier;
        multiplier *= 26;
    }
    col -= 1;
    return {
        "col": col,
        "row": row
    };
    /*if (!rangeText || !sheet) {
        return null;
    }
    console.log(rangeText);
    var spreadNS = spreadNS, CalcNS = spreadNS.Calc;
    var baseRow = sheet._activeRowIndex,
        baseCol = sheet._activeColIndex,
        useR1C1 = (sheet.referenceStyle() === spreadNS.ReferenceStyle.R1C1);

    try {
        return CalcNS.formulaToRange(rangeText, baseRow, baseCol, useR1C1);
    } catch (ex) {
        return null;
    }*/
}

function dataInput_firstRowIndex() {
    $('#data-has-row').find('option').each(function(i,item){
        if(item.selected) {
            return item.value
        }
    });
}

/* json for each variables (input field */
function dataInput_getVarFieldsJson() {
    var dataJSON = '[';
    var jsonToSent = [];
    var spread = getSpreadJS();
    var writeNan = getWriteNan();
    var firstRowIdx = dataInput_firstRowIndex();
    var fieldsNum = $('#inputs-fields').children().length;
    for (var i = 0; i < fieldsNum; i++) {
        var inputBox = getInputDrop(i);
        /* data-attr's are in div with id "data-input-field-%N%" */
        var inputField = getInputField(i);
        if (inputBox) {
           /* value is stored in input */
           var inputBoxValue = inputBox.querySelector('input').value; 
           var inputFieldType = inputField.getAttribute("data-type");
           /*  if non empty */
           if (inputBoxValue.replace(/\s/g, "") != "") {               
                var numericRange =  (inputFieldType == "VarRange");
                var isValid = true;
                if (numericRange)
                    var validator = new $.wijmo.wijspread.DefaultDataValidator.createNumberValidator(7, -9999999, -9999999, false);
                if (i != 0)
                    dataJSON += ',';
                var minCols = inputField.getAttribute("data-mincols");
                if (!minCols) minCols = 1;
                var minRows = inputField.getAttribute("data-minrows");
                if (!minRows) minRows = 2;
                var isMulti = inputField.getAttribute("data-multi") == "true";
                var constsubstitute = inputBox.getAttribute("constsubstitute") == "true";
                /* Cell or constsubstitute (text instead of VarRange) */
                //WAS: if (inputField.getAttribute("type") == "Cell" || ( constsubstitute && isNumber(inputBoxValue))) {
                if (inputField.getAttribute("data-type") == "Cell" || ( constsubstitute && isNumber(inputBoxValue))) {
                    dataJSON += '{ "ValueReference":"' + inputBoxValue.replace(",", ".") + '", "Cols":[], "text":false, "multi":false}';
                    jsonToSent.push({
                        ValueReference : inputBoxValue.replace(",", "."),
                        Cols : [],
                        text : false,
                        multi : false
                    })
                    continue;
                }
                /* else prepare matrix */
                dataJSON += '{ "ValueReference" :"' + inputBoxValue + '", "text":' + !numericRange + ', "multi":' + isMulti + ', "Cols":[{';
                jsonToSent.push({
                    ValueReference : inputBoxValue,
                    text : !numericRange,
                    multi : isMulti,
                    Cols : []
                })

                //WAS: var refs = inputBoxValue.split(";");
                var refs = inputBoxValue.split(",");
                /* 
                var refs = checkSavedVal()[i];
                 

                */
                var groupsIndex = 0;
                var curentColCount = 0;
                for (var j = 0; j < refs.length; j++) {
                    console.log(j);
                    var refValue = refs[j];//"Sheet1!A1:A10";
                    if (refValue != "" && curentColCount < maxColForAnalysis()) {
                        var sheet = spread.getSheetFromName(refValue.split("!")[0]);
                        var selection = refValue.split("!")[1].split(":");
                        var startRowIndex, finishRowIndex, startColIndex, finishColIndex;
                        var varIndex = 1;
                        if (selection[0].search(/[0-9]{1}/) == -1 && selection[0] == selection[1]) {
                            startRowIndex = firstRowIdx;
                            finishRowIndex = Math.min(sheet.getRowCount(), maxRowForAnalysis());
                            startColIndex = finishColIndex = stringToRange(selection[0] + "1", sheet).col;
                            curentColCount++;
                        }
                        else {
                            var startCell = stringToRange(selection[0], sheet);
                            var finishCell = stringToRange(selection[1], sheet);
                            var remainingColCount = maxColForAnalysis - curentColCount;
                            startRowIndex = startCell.row + firstRowIdx;
                            startColIndex = startCell.col;
                            finishRowIndex = Math.min(finishCell.row, maxRowForAnalysis() + startRowIndex);
                            finishColIndex = Math.min(finishCell.col, remainingColCount + startColIndex);
                            curentColCount += finishColIndex - startColIndex + 1;
                            //console.log(startColIndex);console.log(finishColIndex);console.log(startRowIndex);console.log(finishRowIndex);
                            if ((finishRowIndex - startRowIndex + 1) < minRows) {
                                return { "isIncorrect": true, "data": "Invalid number of rows! Please, enter more then " + minRows + " rows for " + $(inputBox).attr("fieldtitle").replace('\r', '').replace('\n', '') + " field" };
                            }
                        }
                        sheet.isPaintSuspended(true);
                        for (var k = startColIndex, arrI = 0; k <= finishColIndex; k++, arrI++) {
                            var label;
                            if (firstRowIdx > 0) {
                                label = sheet.getValue(startRowIndex - 1, startColIndex);
                            }
                            else {
                                label = "Var" + varIndex++;
                            }
                            if (groupsIndex != 0)
                                dataJSON += ',{';
                            groupsIndex++;
                            dataJSON += '"Label":"' + label + '", "Cells":[';
                            
                            var newArr = []; //ADD
                            for (var m = startRowIndex; m <= finishRowIndex; m++) {
                               
                                if (sheet.getValue(m, k) === null || ("" + sheet.getValue(m, k)).replace(/\s/g, "") == "") {
                                    if (writeNan == "1") {
                                        if (m != startRowIndex)
                                            dataJSON += ',';
                                        dataJSON += '""';
                                    }
                                    continue;
                                }
                                if (m != startRowIndex)
                                    dataJSON += ',';
                                if (numericRange) {
                                    sheet.setDataValidator(m, k, validator);
                                    if (isValid) {
                                        isValid = (Number(sheet.getValue(m, k)).toString() != "NaN");
                                    }
                                }
                                dataJSON += '"' + sheet.getValue(m, k) + '"';
                                newArr.push(sheet.getValue(m, k))
                            }
                            dataJSON += ']}';
                            if(jsonToSent[i]){

                                jsonToSent[i].Cols.push({
                                    Label : label,
                                    Cells : newArr
                                });
                            }

                        }
                        sheet.isPaintSuspended(false);
                    }
                }
                if (curentColCount < minCols) {
                    return { "isIncorrect": true, "mes": "Invalid number of variables. Please select at least " + minCols + " columns for " + $(inputBox).attr("fieldtitle").replace('\r', '').replace('\n', '') + " field" };
                }
                dataJSON += ']}';
            }
            else {
                /* input field is empty */
                if (i != 0)
                    dataJSON += ',';
                dataJSON += '{ "ValueReference":"' + inputBoxValue.replace(".", ",") + '", "Cols":[], "text":"false", "multi":"false"}';
                jsonToSent.push({
                    ValueReference : inputBoxValue.replace(".", ","),
                    Cols : [],
                    text : false,
                    multi : false
                })
            }
        }
        else
            break;
    }
    if (!isValid)
        return null;
    dataJSON += ']';
    // return { "result": false, "data": dataJSON };
    jsonToSent = {
        result : false,
        data : jsonToSent
    }
    return JSON.stringify(jsonToSent);
}
//Gets advanced options and converts it to JSON
function dataInput_getAdvOptionJson() {
    //WAS: var optionsJSON = '[';

    var jsonToSent = []; 

    var countOptions = $('#advanced-options').find('.advanced-options__content').children().length;
    for (var i = 0; i <= countOptions; i++) {
        var advOpt = document.getElementById("option-" + i);
        var value;
        /* <input type="number" value="0" class="numberint"> */
        if (advOpt != null) {
            switch (advOpt.getAttribute("data-type")) {
                case "checkbox":
                    {
                        //WAS: value = advOpt.classList.contains('checked') ? "true" : "false";
                        jsonToSent.push({ 
                            Value :  advOpt.classList.contains('checked') ? "true" : "false",
                            Type : "checkbox"
                        });
                        break;
                    }
                case "number":
                case "numberint":
                    {
                        //WAS: value = advOpt.querySelector('input').value;
                        jsonToSent.push({
                            Value : advOpt.querySelector('input').value,
                            Type : advOpt.getAttribute("data-type")
                        })
                        break;
                    }
                case "list":
                    {
                        //WAS: value = advOpt.querySelector('.selected').getAttribute('data-value');
                        jsonToSent.push({
                            Value : advOpt.querySelector('.selected').getAttribute('data-value'),
                            Type : "list"
                        })
                        break;
                    }
            }
            /*WAS: if (i != 0)
                optionsJSON += ',';
            optionsJSON += '{"Value":"' + value + '", "Type":"'
             + advOpt.getAttribute("data-type") + '"}'; */
        }
        else
            break;
    }
    /*
    TODO: pass prefs
    optionsJSON += ']', "OptGeneral":['
    for (var i = 1; i <= 6; i++) {
        var advOpt = document.getElementById("advOptGeneralDef" + i);
        if (i != 1)
            optionsJSON += ',';
        if (i == 2) {
            optionsJSON += '{"Value":"' + pairwiseVal() + '", "Type":"' + advOpt.getAttribute("name") + '"}';
        }
        else
            optionsJSON += '{"Value":"' + $(advOpt).val() + '", "Type":"'
                + advOpt.getAttribute("name") + '"}';
    }*/
    //WAS: optionsJSON += ']';
    
    /* ПЕРЕВЕСТИ js object to string  */
    
    return JSON.stringify(jsonToSent);
}

function dataInput_getDataJson() {
// get values for input fields and options
varFieldsJson = dataInput_getVarFieldsJson();
var dataOpts = dataInput_getAdvOptionJson()
var windowJSON = '{ "Vars": ' + varFieldsJson.data + ', "AdvOpts": ' + dataOpts + '}';
return windowJSON;
}

function onSelectionFromSheetUpdated(rangeText, cols, rows) {
    $("#pnl-select-range").text(rangeText);
    var lab = $('#datalabelsfirstrow-list').find('.text').text();
    $('#pnl-select-rows-columns').find('strong')[0].textContent = rows;
    $('#pnl-select-rows-columns').find('strong')[1].textContent = cols;
    var text = $('#pnl-select-label').find('strong')[0];
    text.textContent = lab;
}
