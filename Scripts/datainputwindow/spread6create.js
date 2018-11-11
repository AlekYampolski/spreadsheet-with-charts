/* UI code for modal data input window */

/* [Create] Input Field BUTTONS - add column(s), add range, clear */
function createButton(buttonClasses,iconClasses,buttonTooltip,inputID,  buttonType) {
  var button = document.createElement("button");
  /* Set button class, stringForClass(buttonClasses, button); */
  button.setAttribute('class',buttonClasses )
  var icon = createIcon(iconClasses);
  button.appendChild(icon);
  button.setAttribute("data-tooltip", buttonTooltip);
  button.setAttribute("id", "button-" + buttonType + "-" + inputID);
  return button;
}

/* [Create] Clear button - clears input from #drop-{id} */
function createClearButton(id) {
  var buttonClasses = "ui basic grey right icon button";
  var iconClasses = "delete icon";
  var btnTooltip = "Clear";
  var buttonType = "clear";
  //createButtonEventListener(id, buttonType, clearListener);
  return createButton(buttonClasses, iconClasses, btnTooltip, id, buttonType);
}

/* [Create] AddRange - add range from the vars/columns list when VarRange.Multi == true */
function createAddrangeButton(id) {
  var buttonClasses = "ui basic grey left icon button";
  var iconClasses = "share green icon";
  var btnTooltip = "Use selection from the variables/columns list";
  var buttonType = "addrange";
  //createButtonEventListener(id, buttonType, addrangeListener);
  return createButton(buttonClasses, iconClasses, btnTooltip, id, buttonType);
}

/* [Create] AddRange - add range from the vars/columns list when VarRange.Multi == false */
function createAddrangeNotMultiButton(id) {
  var buttonClasses = "ui basic grey left icon button";
  var iconClasses = "share green icon";
  var btnTooltip = "Use selection from the variables/columns list";
  var buttonType = "addrangeNotMulti";
  //createButtonEventListener(id, buttonType, addrangeListener);
  return createButton(buttonClasses, iconClasses, btnTooltip, id, buttonType);
}

/* [Create] selectRangeFromSheet - add range from a sheet */
function createSelectFromSheetButton(id) {
  var buttonClasses = "ui basic green left icon button";
  var iconClasses = "table icon";
  var dataAttrs = "Select a range of cells from the spreadsheet";
  var buttonType = "selectFromSheet";
  //createButtonEventListener(id, buttonType, selectRangeFromSheet);
  return createButton(buttonClasses, iconClasses, dataAttrs, id, buttonType);
}

/* [Create] add icon */
function createIcon(iconClasses) {
  var icon = document.createElement("i");
  // stringForClass(iconClasses, icon);
  icon.setAttribute('class', iconClasses)
  return icon;
}

/* [event] Clear #drop-{id} */
function clearListener(id) {
  var dropId = "#drop-" + id;
  $(dropId).dropdown("clear");
}

/* [event] Addrange-{id} Multi */
function  addrangeListener(id) {
  var itemList = $("#columns-place").find(".checked");
  var selectedData = [];
  var selectedDataOld = checkSavedVal()[id];
  for (var i = 0; i < itemList.length; i++) {
    // var ref = itemList[i].children[0].attributes.getNamedItem("data-ref").value;
    // var value = itemList[i].children[0].attributes.getNamedItem("data-name").value;
    var ref = itemList[i].children[0].attributes.getNamedItem("data-ref").value;
    var value = itemList[i].children[0].attributes.getNamedItem("data-name").value;
    selectedData.push({
      name: value,
      value: ref
    });
  }
  var sheetName = $('#sheet-list').find('.text')[0].textContent;
  selectedDataOld = selectedDataOld.concat(selectedData);
  selectedDataOld = removeDuplicates(selectedDataOld, 'value');
  var dataForDrops =[] ; /*  find to prevent redraw */
  $('#drop-' + id).find('.item').each(function(i,item){
    dataForDrops.push({
      value : item.getAttribute('data-value'),
       name :item.textContent
     });
 });
  /* re-init drop */
  initVarRangeDropdownOptions(id, dataForDrops, selectedDataOld );
}

/* [event] Addrange-{id} Multi == false */
function addrangeNotMultiListener(id){
  var item = $("#columns-place").find(".checked")[0];
  var selectedData = [];
  var ref = item.children[0].attributes.getNamedItem("data-ref").value;
  var value = item.children[0].attributes.getNamedItem("data-name").value;
  selectedData.push({
    name: value,
    value: ref
  });
  var selectedDataOld = checkSavedVal()[id]; 
  var dataForDrops  =[];
  $('#drop-' + id).find('.item').each(function(i,item){
     dataForDrops.push({
       value : item.getAttribute('data-value'),
        name :item.textContent
      });
  });
  dataForDrops = dataForDrops.concat(selectedDataOld);
  dataForDrops = removeDuplicates(dataForDrops, 'value');
  /* re-init drop */
  initVarRangeDropdownOptions(id, dataForDrops, selectedData );
}

/*  [event] Close modal and activate selection mode. When ready - add selection to dropdown  */
function selectRangeFromSheet(idClicked) {
  selectedInputId = idClicked;
  selectModeInputSelected = $("#data-input-field-" + idClicked);
  selectModeInputFieldType = selectModeInputSelected.attr("data-type");
  selectModeInputFieldIsMulti = selectModeInputSelected.attr("data-multi") == "true";
  selectMode = true;
  inputFieldSelectionChanged(selectModeInputFieldType, selectModeInputFieldIsMulti);
  $("#data-input-window").modal("hide");
  togglePanel(2);  
};

/*  [Create] dropdown for single variables. Creates #data-input-field-{id}, dropdown #drop-{id} and buttons */
function createVarRangeField(inputNode,id, arr ) {
  var inputType = inputNode.nodename;
  var isRequired = inputNode.required;
  var isMulti = inputNode.multi;
  var minRows = inputNode.minrows;
  var minCols = inputNode.mincols;
  var label, actionInput, parent, wrapType = 'drop';
  /* TODO: do we need "input" class here? */
  var ddClasses = "ui selection fluid dropdown";
  if(isMulti){
   ddClasses += " multiple";
  }
  var wrapper =  createWrapperRightFields(id, wrapType, ddClasses, inputNode);
  label = wrapper[0];
  parent = wrapper[1];
  actionInput = wrapper[2];
  /*input*/
  var input = document.createElement("input");
  input.setAttribute("value", "default");
  input.setAttribute("type", "hidden");  
  var icon = createIcon("dropdown icon");
  var defaultText = document.createElement("div");
  // stringForClass("default text", defaultText);
  defaultText.setAttribute('class', "default text");   
  var menu = document.createElement("div");
  menu.classList.add("menu");  
  var item = document.createElement("div");
  item.classList.add("item");
  /* add html */
  parent.appendChild(input);
  parent.appendChild(icon);
  parent.appendChild(defaultText);
  parent.appendChild(menu).appendChild(item);   
  /* set data attr for type: VarRange or VarRangeText */
  if (inputType === "VarRangeText") {
    actionInput.setAttribute("data-text", true);
  }
  if (inputType === "VarRange") {
    actionInput.setAttribute("data-text", false);
  }
  /* set data attr for validators */
  if (minRows)
    actionInput.setAttribute("data-minrows", minRows);
    if (minCols)
    actionInput.setAttribute("data-mincols", minCols);
  /* add buttons near dropdown */
  actionInput.appendChild(createSelectFromSheetButton(id));
  actionInput.appendChild(createClearButton(id));  
  return [label, actionInput]  
}

function createRightMainFields(inputNode,id, arr){
  var inputType = inputNode.nodename;
  var label;
  var actionInput;
  var fields;
  if((inputType === "VarRange") || (inputType === "VarRangeText") ){
    fields = createVarRangeField(inputNode,id, arr);
    label = fields[0];
    actionInput = fields[1];
  } else if (inputType === 'Cell'){
    fields = createCellField(inputNode,id, arr);
    label = fields[0];
    actionInput = fields[1];
  }
  var superParentClass = "search-item";
  var superParent = document.createElement("div");
  // stringForClass(superParentClass, superParent);
  superParent.setAttribute('class', superParentClass)
  if(arr.length <= 4){
    superParent.classList.add('padding-bottom-06');
  } 
  /* if (inputNode.) */
  superParent.appendChild(label);
  superParent.appendChild(actionInput);
  return superParent;
}

function createCellField(inputNode,id, arr){

  // var div  = document.createElement('div');
  // var divClasses = 'ui input';
  var input = document.createElement('input');
  var inputType;
  
  /* Проверка для numeric */
  var cellType = inputNode.numeric;
  if(cellType === true) {
    inputType = 'number';
  } else {
    inputType = 'text';
  }


  
  var placeholder = 'Search...';
  var parent, label, actionInput;
  var wrapType = 'input';
  var wrapClass = 'ui input';

  var wrapper = createWrapperRightFields(id, wrapType, wrapClass, inputNode);
  label = wrapper[0];
  parent = wrapper[1];
  actionInput = wrapper[2];

  // div.appendChild(input);
  parent.appendChild(input);

  // div.setAttribute('class', divClasses);
  input.setAttribute('type', inputType);
  input.setAttribute('placeholder', placeholder);
  

  actionInput.appendChild(createClearButton(id));
  
  return [label, actionInput]
  
}

/* Создает label & wrapper для поле ввода справа. Для Cell & VarRange||VarRangeText */
function createWrapperRightFields(id, wrapType, wrapClass, inputNode){
  var inputType = inputNode.nodename;
  var isRequired = inputNode.required;
  var isMulti = inputNode.multi;
  var itemId = wrapType + '-' + id;
  var label = document.createElement("label");
  label.setAttribute("for", itemId);
  label.textContent = inputNode.label;

  var parent = document.createElement("div");
  parent.setAttribute('class',wrapClass );
  parent.setAttribute("id", itemId);
  
  if(inputNode.description){
    label.setAttribute("data-tooltip", inputNode.description);
    parent.setAttribute("data-tooltip", inputNode.description);
  }

  var actionInput = document.createElement("div");
  var actionClasses = "ui fluid action input";
  actionInput.setAttribute('class', actionClasses)
  
  // actionInput.appendChild(createAddrangeButton(id));
  if(isMulti === true){
    actionInput.appendChild(createAddrangeButton(id));
  }
  if(isMulti === false){
    actionInput.appendChild(createAddrangeNotMultiButton(id));
  }
  actionInput.appendChild(parent);
  actionInput.setAttribute("id", "data-input-field-" + id);
  actionInput.setAttribute("data-multi" , isMulti);
  actionInput.setAttribute("data-type", inputType);
  actionInput.setAttribute("required", isRequired);

  return [label, parent, actionInput]
}
// Left list with columns/variables
/* 
  Создает список checkbpx'ов со значениями rowHeader для списка колонок слева для worksheet в (#columns-place)
  Инициализирует checkbox'ы
  Возвращает значения rowHeader
*/
function createColumnsLeftList(sheet) {
  var fragment = document.createDocumentFragment();
  document.getElementById("columns-place").innerHTML = "";
  var inputData = [];
  var items = getFirstRow(sheet);
  items.forEach(function (item, index) {
    if (item !== null) {
      var createdItem = createLeftListItem(item, index, sheet);
      var el = createdItem[0];
      // shorter value
      var mainData = createdItem[1];
      if (mainData.name.length > 12){
        mainData.name = mainData.name.slice(0,10)+'...';
      } 
      var shorterData = {
        name : mainData.name,
        value : mainData.value
      }
      inputData.push(shorterData);

      fragment.appendChild(el);
    }
  });
  document.getElementById("columns-place").appendChild(fragment);
  
  isChecked();
  return inputData;
}

/* 
  Создает checkbox для в списка checkbox'ов для списка колонок слева для worksheet в (#columns-place)
*/
function createLeftListItem(val, id, selSheet) {
  var activeSheet = selSheet;
  var parent = document.createElement("div");
  var checkboxClasses = "ui checkbox item";
  // stringForClass(checkboxClasses, parent);
  parent.setAttribute('class',checkboxClasses );
  var input = document.createElement("input");
  var name = "col-" + id;
  // xla first column = 1
  var colXLA1 = GetColumnName(id + 1);
  var ref = activeSheet + "!" + colXLA1 + ":" + colXLA1;
  // if not empty - add column name
  val = val + " "+colXLA1;
  // TODO: else use "Column A"
  // var checkID = name;
  input.setAttribute("type", "checkbox");
  input.setAttribute("name", name);
  input.setAttribute("id", name);
  input.setAttribute("data-col", id);
  input.setAttribute("data-name", val);
  input.setAttribute("data-ref", ref);

  var label = document.createElement("label");
  // innerHTML?
  var content = val;
  if (content.length > 15){
    content = val.slice(0,13)+'...';
  } 
  content = document.createTextNode(content);
  label.appendChild(content);
  label.setAttribute("for", name);

  parent.appendChild(input);
  parent.appendChild(label);

  return [
    parent,
    {
      name: val,
      value: ref
    }
  ];
}
/* ================= */
/* ==== ./MAIN SECTION ==== */

/* ================== */
/* ==== ADVANCED SECTION ==== */

/* INPUTS */
/* 
Создает input для advanced секции
  "advancedwindow": {
            "nodename": "advancedwindow",
            "label": "Descriptive Statistics",
            "items":
                  [{"nodename": "numberint"} || {"nodename": "number"}]  
*/
function createAdvInput(id, item, typeAttr){
  var el = document.createElement('div');
  el.setAttribute('class', 'ui input fluid');
  el.setAttribute('id', id);
  el.setAttribute('data-type', typeAttr);

  var input = document.createElement('input');
  input.setAttribute('type', 'number');
  input.setAttribute('value', item.value);
  
  
  el.appendChild(input);
  
  return el;
}

// CHECKBOX
/* 
Создает checkbox для advanced секции
  "advancedwindow": {
            "nodename": "advancedwindow",
            "label": "Descriptive Statistics",
            "items":
                  [{"nodename": "checkbox"}]
*/
function createAdvInputCheck(id, item) {
  var el = document.createElement('div');
  el.setAttribute('class', 'ui toggle checkbox');
  el.setAttribute('id', id);
  el.setAttribute('data-type', 'checkbox');


  var input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  //input.setAttribute('data-type', 'checkbox');

  var label = document.createElement('label');
 
  
  el.appendChild(input);
  el.appendChild(label);
  return el;
}

// DROPDOWN
{/* <div class="ui selection dropdown">
  <input name="gender" type="hidden" value="default">
  <i class="dropdown icon"></i>
  <div class="text">Default Value</div>
  <div class="menu">
      <div class="item" data-value="0">Value</div>
      <div class="item" data-value="1">Another Value</div>
      <div class="item" data-value="default">Default Value</div>
  </div>
 </div> 

<div class="ui fluid selection dropdown" id="sheet-list">
                            <input type="hidden" name="sheet-list">
                            <i class="dropdown icon"></i>
                            <div class="default text"></div>
                            <div class="menu">
                                <div class="item"></div>
                            </div>
                        </div>

*/}
/* 
  Создает dropdown для advanced секции
  "advancedwindow": {
            "nodename": "advancedwindow",
            "label": "Descriptive Statistics",
            "items":
                  ["nodename": "list"]
*/
function createAdvDropDown(val, valex, id) {
  var items = val.split("\n");
  var el = document.createElement('div');
  el.setAttribute('class', 'ui fluid selection dropdown');
  el.setAttribute('id', id);
  el.setAttribute('data-type', 'list');
  
  var input = document.createElement('input');
  input.setAttribute('type', 'hidden');
  input.setAttribute('name', id);

  var icon = document.createElement('i');
  icon.setAttribute('class', 'dropdown icon');

  var divText = document.createElement('div');
  divText.setAttribute('class', 'text');

  var menu = document.createElement('div');
  menu.setAttribute('class', 'menu');

  items.forEach(function (item, i){
    // TODO: inner text of div = "1. Inverse of EDF (SAS-3)" or "Inverse of EDF (SAS-3)"
    var divItem = document.createElement('div');
    divItem.setAttribute('class', 'item');
    /* OLD ==> var numOrder = item.split('.');
    divItem.setAttribute('data-value', numOrder[0]);
    divItem.innerHTML = numOrder[1]; */

    divItem.setAttribute('data-value', i);
    divItem.innerHTML = items[i];

    if(i === valex){
      divItem.classList.add('active');
      divItem.classList.add('selected');
      divText.innerHTML = items[i];
    }

    menu.appendChild(divItem);
  });
  el.appendChild(input);
  el.appendChild(icon);
  el.appendChild(divText);
  el.appendChild(menu);

  return el;

 /*  var items = val.split("\n");
  var el = document.createElement("select");
  items.forEach(function (item, i) {
    var option = document.createElement("option");
    var text = document.createTextNode(item);
    option.appendChild(text);
    if (valex === i) {
      option.setAttribute("selected", true);
    }
    el.appendChild(option);
  });
  el.setAttribute("id", id);
  //TODO: AS: check if it's ok to use such styling
  el.setAttribute("class", "ui selection dropdown");
  return el; */
}

/* SHEET SELECT 
  Заполняет #columns-place.
*/
function sheetSelect(event) {
  var sheetName;
  if (event.target) {
    sheetName = event.target.textContent;
  } else {
    sheetName = event;
  }
  // Save selected columns in data- attr for each drop
  var savedVal = [];

  // for each dropdown
  var itemsForSearch = dataInputWindow.window.items;

  
  //WAS:     var test = $(dropId).find('.ui.label.transition.visible');
  
  //WAS :  var test = $(dropId).find('.ui.label');
  savedVal = checkSavedVal();

  var dataForDrops = createColumnsLeftList(sheetName);

  itemsForSearch.forEach(function (item, i) {
    // Check if array item has exist already

    initVarRangeDropdownOptions(i, dataForDrops, savedVal[i]);
  });

  // ! comment me
  //
}

/* HEADER */
function renderHeader(methodId) {
  var header = document
    .getElementById("data-input-window")
    .getElementsByClassName("header")[0];
  
  var headerText = document.createTextNode(dataInputWindow.label);
  header.appendChild(headerText);
  header.classList.add('padding-small');
  header.classList.add('padding-top-04');
  header.setAttribute('id', methodId);
  return header;
}

/* ADVANCED SECTION */
function renderAdvancedlist(advancedwindow) {
  var fragment = document.createDocumentFragment();
  advancedwindow.forEach(function(item, index) {
    var row = document.createElement("div");

    var leftPart = document.createElement("label");
    var leftItem = document.createTextNode(item.name);
  
    var rightPart = document.createElement("div");
    var rightItem;

    /* id for input */
    var id = "option-" + index;

    var typeAttr;
    var inputMode;

    /* Convert advancedwindow.items.nodename to input type attribute */
    switch (item.nodename) {
      case "checkbox":
        rightPart.appendChild(createAdvInputCheck(id, item));
        break;

      case "numberint":
      case "number":
        rightPart.appendChild(createAdvInput(id, item, item.nodename));
        break;

      case "list":
        rightPart.appendChild(createAdvDropDown(item.value, item.valueex, id));
        break;

      /* Default? */
    }

    //Left side
    leftPart.classList.add("eight", "wide", "column", "advanced-options__left");
     //intent Label *
     if(item.indent === 1) {
      var intentLabel = document.createElement('i');
      // intentLabel.setAttribute('class', 'asterisk small icon');
      intentLabel.setAttribute('class', 'right triangle icon');
      leftPart.appendChild(intentLabel);
    }

    leftPart.appendChild(leftItem);
    leftPart.setAttribute("for", id);

    // Right side
    rightPart.classList.add(
      "eight",
      "wide",
      "column",
      "advanced-options__right"
    );

    //row
    // row.classList.add("row");
    // row.classList.add("padding-small");
    row.setAttribute('class', 'middle aligned row padding-small');
    row.appendChild(leftPart);
    row.appendChild(rightPart);

    //All
    fragment.appendChild(row);
  });



  //Add fragment to DOM
  document
    .getElementById("advanced-options") // or is it optional?
    .getElementsByClassName("advanced-options__content")[0] //or change it to querySelector('.advanced-options__grid changed to advanced-options')
    .appendChild(fragment);
}


function createSimpleCheckbox(labelText){
  var el = document.createElement('div');
  el.setAttribute('class','ui toggle checkbox');
  var input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  var label = document.createElement('label');
  label.innerHTML =  labelText;
  el.appendChild(input);
  el.appendChild(label);
  return el;
}



