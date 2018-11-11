/*  Create data input window objects */

/* Init column list checkboxes (#columns-place)*/
/* FOR SHEET-LIST EVENTS ADDS CLASS .selected TO SELECTED CHECKBOX */
function isChecked() {
  var checkedItemdId = $('#columns-place').find('.ui.checkbox').checkbox({  });
}

/* init input field #drop-id dropdown */
function initVarRangeDropdownOptions(id, selSheetCols, selDropdownRanges) {
  var dropId = "#drop-" + id;
  //var selDropdownRanges = current selected  dropdown values: {name: Var1-x, value: Sheet2!A:A}
  var selDropdownRangesValues = selDropdownRanges.map(function (item) {
    return item.value;
  })
  /* TODO: review: WAS: var dropData = selSheetCols.concat(selDropdownRanges).unique(); */
  var dropData = selSheetCols.concat(selDropdownRanges);
  dropData = removeDuplicates(dropData, 'value');
  var currentInputField = $("#data-input-field-" + id);
  var currentInputFieldIsMulti = currentInputField.attr("data-multi") == "true";
  var shortLabels = dropData.map(function(item){
    if (item.name.length > 15 && currentInputFieldIsMulti) {
      item.name = item.name.slice(0,13)+'...';
    } 
    return {
      name : item.name, /* shorter name */
      value: item.value
    }
  });
  var maxSelectionCount = currentInputFieldIsMulti ? 9999 : 1;
  $(dropId).dropdown({
    values: shortLabels,
    showOnFocus : false,
    allowTab : false,
    allowAdditions: false,
    /*maxSelections: maxSelectionCount,*/
    sortSelect: false
    /*,
    action: function (text, value) {
      if (value != "custom") {
        $(this).dropdown("set selected", value);
      } else {
        $(this).dropdown("activate");
        // alert("custom action");
      }
    }*/
    ,
    placeholder: "Select numeric/text variables"
  })
    .dropdown('set selected', selDropdownRangesValues);
}

/*  Returns selected ranges/vars that point to **other worksheets** to prevent them from losing when changing active sheet */
function checkSavedVal() {
  var selectedIdentity = ".item.active";
  /* TODO : change selectedIdentity = ".active" , remove checkSaveValNotMulti  */
  // Save selected columns in data- attr for each drop
  var inputWindowFields = dataInputWindow.window.items;
  var savedVal = [];
  inputWindowFields.forEach(function(item, dropIndex) {
    var dropId = "#drop-" + dropIndex;
    savedVal[dropIndex] = [];
    /* var notMulti = checkSavedValNotMulti(); // */
    var test = $(dropId).find(selectedIdentity);
    if (test.length > 0) {
      for (var i = 0; i < test.length; i++) {
        // var miniTest = test[]
        var name = test[i].textContent; // Var1-y

        var value = test[i].dataset.value; // Sheet1!A:A

        savedVal[dropIndex].push({
          name: name,
          value: value
        });
      }
    /* } else if (notMulti[dropIndex]){
      savedVal[dropIndex] = notMulti[dropIndex]; // Если drop-{id} пуст */
    }
  });
  return savedVal;
}

/*  Event Listeners for .rightMenuPanel toggle.  */
$("#pnlSelectRangeClose").click(function () {
  togglePanel(2);
  selectMode = false;
  $("#data-input-window").modal("show");
});

$("#pnlSelectRangeBtnRangeSelected").click(function () {
  var refSelection = $("#pnlSelectRangeSelectedRange").val();
  var sheetName = $('#sheet-list').find('.text')[0].textContent;
  var selectedData = [];
  var selectedDataOld = checkSavedVal()[selectedInputId];
  selectedData.push({
    name: refSelection,
    value: refSelection
  });
  /*WAS: selectedDataOld = selectedDataOld.concat(selectedData).unique(); */
  selectedDataOld = selectedDataOld.concat(selectedData);
  selectedDataOld = removeDuplicates(selectedDataOld, 'value');
  var dataForDrops = createColumnsLeftList(sheetName);
  // init input field
  initVarRangeDropdownOptions(selectedInputId, dataForDrops, selectedDataOld);
  $("#pnlSelectRangeClose").click();
});

/*  clean DOM for data input window */
function deleteElements() {
  /* remove header */
  var header = document
    .getElementById("data-input-window")
    .getElementsByClassName("header")[0].innerHTML = "";
  /* remove input fields */
  $("#inputs-fields")[0].innerHTML = "";
  // document.getElementById('inputs-fields').removeEventListener();
  document.getElementById('inputs-fields').removeEventListener('click', evList);
  document
    .getElementById("sheet-list")
    .querySelector(".menu")
    .removeEventListener("click", sheetSelect);

  $('#advanced-options').find('.numberint').off();
  $('#advanced-options').find('.number').off();
  /* clear ADVANCED OPTIONS */ 
  $('#advanced-options').find('.advanced-options__content')[0].innerHTML = "";
  $("#inputs-fields").off();
}

/* Init event listeners for input field buttons - clear, addrange, selectFromSheet  */
function evList(e) {
  var button = e.target.id;
  var icon = e.target.parentElement.id;
  var tB = button.split('-');
  var tI = icon.split('-');
  if (tI[0] === 'button') {
    tB = tI;
  }
  switch (tB[1]) {
    case "addrange":
      addrangeListener(tB[2]);
      break;
    
    case "addrangeNotMulti":
      addrangeNotMultiListener(tB[2]);
      break;
    case "clear":
      clearListener(tB[2]);
      break;

    case "selectFromSheet":
      selectRangeFromSheet(tB[2]);
      break;
  }
}

/*  Validators for advanced inputs */
function validInt(event) {
  $(this).val($(this).val().replace(/[^\d].+/, ""));
  if ((event.which < 48 || event.which > 57)) {
    event.preventDefault();
  }
}

function validDec(event) {
  //this.value = this.value.replace(/[^0-9\.]/g,'');
  $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
  if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
    event.preventDefault();
  }
}


/* 
TODO: что делает? Reset Adanced options. Значения зануляет.
*/
function resetAdvOptions(event) {
  var myArr = $('.advanced-options__content').find('.advanced-options__right');
  $.each(myArr, function (i) {
    switch (myArr[i].firstChild.type) {
      case 'number': myArr[i].firstChild.value = 0;
        break;

      case 'checkbox': myArr[i].firstChild.value = false;
        breack;

      case 'select': break;
    }

  });
}

/* 
  INIT DROPDOWNS AND CHECKS IN ANDVANCED SECTION 
*/
function initAdvDrops(dataFromJSON) {
  dataFromJSON.forEach(function (item, index) {
    //FIND ALL DROPDOWNS
    if (item.nodename === "list") {
      var id = "#option-" + index;

      $(id).dropdown();
    }

  });
}

/* 
  Инициализация checkbox'ов в Advanced options
*/
function initAdvCheckes(dataFromJSON) {
  dataFromJSON.forEach(function (item, index) {
    //FIND ALL DROPDOWNS
    if (item.nodename === "checkbox") {
      var id = "#option-" + index;

      $(id).checkbox();
      if (item.value === true) {
        $(id).checkbox(
          'set checked'
        );
      }
    }

  });
}

/* Removes object duplicates in myArr array by [prop] */
function removeDuplicates(myArr, prop) {
  return myArr.filter(function (obj, pos, arr) {
    return arr.map(function (mapObj) {
      return mapObj[prop];
    }).indexOf(obj[prop]) === pos;
  });
}