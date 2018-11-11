/* Show analysis menu based on JSON, cmdsmenucreate.js must be loaded before */
var menuJSON;

$(".ui.accordion").accordion();

$(".ui.menu").on("click", ".menuitem", function () {
  if ($(this).hasClass("item")) {
    cmds.hideSidebar();
    methodId = $(this).attr('id');
    console.log(methodId);
    showDataInputWindowForId(methodId);
  }
});

function initCmdsMenu(jsonData) {
  menuJSON = jsonData;
  return renderCmdsMenu();
}

function renderCmdsMenu() {  
  // document.getElementById('menuCmdsPanel').querySelector('.ui.header').innerHTML = "";
  $(sideBarId).html("");
  $(sideBarId).append(cmds.createSidebarHeader());
  // document.getElementById("menuCmds").innerHTML = "";  
  menuJSON.items.forEach(function (item) {
    $(sideBarId).append(cmds.createMenuItem(item));
  });  
  return 1;
}

function showCmdsMenu() {
  cmds.showSidebar();
}




