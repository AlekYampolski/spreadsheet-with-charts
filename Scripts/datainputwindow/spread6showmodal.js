var activeMode = false;

/* Show JS modal data input window. spread6adds.js and spread6create.js must be loaded. */
function showModalWindow() {
  if (activeMode && selectMode) {    
      $("#data-input-window").modal("show");
      console.log('Input window activated');
      return;
    }
    if (activeMode) return;
    deleteElements();
    dataInputWindow = getDataInputWindow(methodId);
    selectMode = false;
    var isItcalled = true;
    var savedValue = [];
    var sheetsList = getSpreadsheets()[0];
    var sheetsListDropdownVals = [];
    /* INIT SHEET LIST, INDEXINS STARTS FROM 1 */
    sheetsListDropdownVals = sheetsList.map(function (sheet, i) {
      var active = getSpreadJS().getActiveSheet()._name;
      if (sheet[0] == active) {
        return {
          name: sheet[0],
          value: i + 1,
          selected: true
        };
      } else
        return {
          name: sheet[0],
          value: i + 1
        };
    });
    $("#sheet-list").dropdown({
      allowTab: false,
      values: sheetsListDropdownVals,
      placeholder: "Select sheet"
    });
    $('#datalabelsfirstrow-list').dropdown({ allowTab: false })
    /* Event listener for sheets list */
    document
      .getElementById("sheet-list")
      .querySelector(".menu")
      .addEventListener("click", sheetSelect);
    /* Advanced options */
      var advancedwindow = null;
      if (dataInputWindow.advancedwindow && dataInputWindow.advancedwindow.items) {
        advancedwindow = dataInputWindow.advancedwindow.items;        
        renderAdvancedlist(advancedwindow);
        /* init lists and checkboxes **/
        initAdvCheckes(advancedwindow);
        initAdvDrops(advancedwindow);
        /* add number validators */
        $('#advanced-options').find('.numberint').on('keypress keyup blur', validInt);
        $('#advanced-options').find('.number').on('keypress keyup blur', validDec);
        $('#resetOptions').on('click'.resetAdvOptions);
        $('#advanced-options').show();
      } else {
        $('#advanced-options').hide();
      }
     
      $('#data-input-window').attr('data-id',methodId);
      $('#data-input-window').attr('cmd-version',dataInputWindow.version);      
      renderHeader(methodId);
    /* TODO: move to renderInputFields()? */
    var activeSheet = getSpreadJS().getActiveSheet()._name;
    createColumnsLeftList(activeSheet);
    var dataInputFields = dataInputWindow.window.items;
    var fragment = document.createDocumentFragment();
    dataInputFields.forEach(function (item, i, arr) {
      fragment.appendChild(
        createRightMainFields(item, i, arr)
      );
    });

    document.getElementById("inputs-fields").appendChild(fragment);
    sheetSelect(activeSheet);
    /* ADD BUTTONS EVENT LISTENERS */
    document.getElementById('inputs-fields').addEventListener('click', evList);
    activeMode = true;
    selectModeLabels = true;
    /* If static modal window: */
    $("#data-input-window")
      .modal({
        onHide: function () {
           if (!selectMode) {            
             activeMode = false;
           }
        },
        onShow: function () {
          // selectMode = true;
          togglePanel(ID_HIDE_ALL);
          cmds.sidebarIfVisibleHide();
        },
        onDeny    : function(){
          window.alert('Wait not yet!');
        },        
        onApprove: function () {
          selectMode = false;
          activeMode = false;
          var windowJSON = JSON.parse(dataInput_getDataJson());
          var cmdId = parseInt(methodId);
          var ver = typeof dataInputWindow.version !=='undefined'? dataInputWindow.version : 1;      
          var cmdGroupid = typeof selectedCmdGroupid !=='undefined'? selectedCmdGroupid : 0;      
          var data = {id: cmdId, version: ver, groupid : cmdGroupid, window: windowJSON};
          dataForCmdJSON = data;
          eventDataInputWindowDataReady(cmdId);
          }
      })
      .modal("show");   
}

/* Helper for old browsers */
if (!String.prototype.quote)
    String.prototype.quote = function(){
        return JSON.stringify( this ); // since IE8
    }