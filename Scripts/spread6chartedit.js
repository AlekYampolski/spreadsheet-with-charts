/* chart object */
var chartForEdit = null;
 
function panelChartEditReset() {
    chartForEdit = null;
}
 
function panelChartEditHide() {
  panelChartEditReset();
  hidePanel(getPanelNameById(ID_PANEL_CHART));
}
 
var mustInitChartEditPanelEvents = true;
var accordionId = "#accordionChartAxis";
 
function panelChartEditPrepare(floatingObject) {
  if (!(floatingObject && typeof floatingObject.repaint == "function"))
        return false;
  chartForEdit = floatingObject;
  chartOptions = getChartOptionsObj(floatingObject);
  if (!chartOptions) {
    panelChartEditHide();
    return false;
  }
  if (mustInitChartEditPanelEvents) {
    initEventsForChartEdit();
    mustInitChartEditPanelEvents = false;
  }
 
  /* ids */
  var xIds = {
    max: "#chart__axis__x--max",
    min: "#chart__axis__x--min",
    majorunit: "#chart__axis__x--majorunit",
    title : "#chart__axis__x--title"
  };
  var yIds = {
    max: "#chart__axis__y--max",
    min: "#chart__axis__y--min",
    majorunit: "#chart__axis__y--majorunit",
    title : "#chart__axis__y--title"
  };
  var chartDOMIds = {
    title: "#chart__title",
    titleChecbox: "#chart__title--checkbox",
    legend: "#chart__legend",
    series: "chart__axis--series",
    seriesColor: "#chartSeriesColor",
    border: "#chart__border",
    gridlinesX: "#chart__axis__x--gridlines",
    gridlinesY: "#chart__axis__y--gridlines"
  };
     
  var title = $(chartDOMIds.title);
  /* in textatrea visible part == textarea.value */
  title.val("");
  title.innerHTML = "";
  title.val(chartOptions.title);
  title.text(chartOptions.title);
     
  /* X-axis (Bottom)*/
  var xOption = chartOptions.axis.x;

  var xMax = xOption.max;
  var xMin = xOption.min;
  var xMajorUnit = xOption.majorunit;
  var xLabel = xOption.label;
     
  /* Y-axis (Left)*/
  var yOption = chartOptions.axis.y;
  var yMax = yOption.max;
  var yMin = yOption.min;
  var yMajorUnit = yOption.majorunit;
  var yLabel = yOption.label;
 
 
  var xJQEl = {
    min : $(xIds.min),
    max : $(xIds.max),
    majorunit : $(xIds.majorunit)
  }
 
  /* RESET DISABLED ATTR */
 
  if(xJQEl.min.attr('disabled')){
    xJQEl.max.removeAttr('disabled');
    xJQEl.min.removeAttr('disabled');
    xJQEl.majorunit.removeAttr('disabled');
  }
 
  /* DISABLE MIN/MAX/MAJORUNIT IF THERE ARE CATEGORIES */
  if(typeof xOption.categories !== "undefined"){
    xJQEl.max.attr('disabled', 'disabled');
    xJQEl.min.attr('disabled', 'disabled');
    xJQEl.majorunit.attr('disabled', 'disabled');
  }
 
  $(chartDOMIds.border).prop("checked", false);
  $(chartDOMIds.gridlinesX).prop(
    "checked",
    typeof xOption.gridlines != "undefined" ? xOption.gridlines : false
  );
  $(chartDOMIds.gridlinesY).prop(
    "checked",
    typeof yOption.gridlines != "undefined" ? yOption.gridlines : true
  );
 
  /* X-axis (Bottom) */
  $(xIds.max).val(xMax);
  axisRangeInputError(xIds.max, true);
  $(xIds.min).val(xMin);
  axisRangeInputError(xIds.min, true);
  $(xIds.majorunit).val(xMajorUnit);
  axisRangeInputError(xIds.majorunit, true);
  $(xIds.title).val(xLabel);
  axisRangeInputError(xIds.title, true);
 
  /* Y-axis (Left) */
  $(yIds.max).val(yMax);
  axisRangeInputError(yIds.max, true);
  $(yIds.min).val(yMin);
  axisRangeInputError(yIds.min, true);
  $(yIds.majorunit).val(yMajorUnit);
  axisRangeInputError(yIds.majorunit, true);
  $(yIds.title).val(yLabel);
  axisRangeInputError(yIds.title, true);
 
  $(chartDOMIds.legend).prop(
    "checked",
    chartOptions.legend.toString() == "true"
  );
 
  /* SERIES */
  var seriesSelector = document.getElementById(chartDOMIds.series);
  seriesSelector.innerHTML = "";
  chartOptions.series.forEach(function(item, i) {
    var option = document.createElement("option");
    var optionTitle = document.createTextNode(item.label);
    option.appendChild(optionTitle);
    seriesSelector.appendChild(option);
  });
   
 
  /* SERIES */
  var colorSer = chartOptions.series[0].color;
 
  var chartColor = colorSer;
  $(chartDOMIds.chartColor).colpickSetColor(chartColor.replace("#", ""));
  var seriaName = null;
  var seriaColor = null;
 
  $("#chart__border").prop("checked", true);
 
 $("#chartBorderColor").css("visibility", "visible");
  var borderColor = chartsDefaultBorderColor;
  var borderWidth = 1;
  var defColr = chartsDefaultBorderColor;
  $(".colorHandler", "#chartBorderColor").css("background", defColr);
  if(chartOptions.hasOwnProperty('border')) {
      var optBorder = chartOptions.border;
      if(optBorder.hasOwnProperty('color')) 
          borderColor = optBorder.color;
      if(optBorder.hasOwnProperty('width')) 
          borderWidth = optBorder.width;
      $("#chartBorderColor").css("visibility", "visible");
      $("#chart__border").prop("checked", true);
      $(".colorHandler", '#chartBorderColor').css('background',borderColor)
      $("#chartBorderColor").colpickSetColor(
        borderColor.replace("#", "")
      );
  }
 
  checkColors(chartDOMIds.series, chartOptions.series, chartDOMIds.seriesColor);
 
  if ( chartForEdit.options.hasOwnProperty("border") &&  chartForEdit.options.border.hasOwnProperty("") )
      defColr = chartForEdit.options.border;
  // Safari hack
  chartPrepareImg();
  return true;
}
 
function initEventsForChartEdit() {
  var xIds = {
    max: "#chart__axis__x--max",
    min: "#chart__axis__x--min",
    majorunit: "#chart__axis__x--majorunit"
  };
  var yIds = {
    max: "#chart__axis__y--max",
    min: "#chart__axis__y--min",
    majorunit: "#chart__axis__y--majorunit"
  };
  var chartDOMIds = {
    title: "#chart__title",
    titleChecbox: "#chart__title--checkbox",
    legend: "#chart__legend",
    series: "chart__axis--series",
    seriesColor: "#chartSeriesColor",
    border: "#chart__border",
    gridlinesX: "#chart__axis__x--gridlines",
    gridlinesY: "#chart__axis__y--gridlines"
  };
  $("#" + chartDOMIds.series).off();
  $("#" + chartDOMIds.series).on("change", function() {
    var seria = this.value;
    var item = chartOptions.series.find(function(element) {
      return element.label === seria;
    });
    checkColors(
      chartDOMIds.series,
      chartForEdit.options.series,
      chartDOMIds.seriesColor
    );
  });
 
  /* IF THERE IS NO OLD{min, max} PROPERTIES 
    COPY AXIS TO chartForEdit.options.axis.old
  */
  if(typeof chartForEdit.options.axis['old'] == "undefined"){
    setOldValues();
  };
 
  $(chartDOMIds.title).off();
  $(chartDOMIds.title).on("input", function() {
    var newVal = $("#chart__title").val();
    chartForEdit.options.title = newVal
      .replace("\r\n", "\n")
      .replace("\n", "\r\n");
    repaintChartForEdit();
  });
 
  $(chartDOMIds.border).off();
  $(chartDOMIds.border).on("change", function() {
    var status = this.checked;
    if (status === false) {
      /* invoke colpick */
      $("#chartBorderColor").css("visibility", "hidden");
      chartForEdit.options.borderStatus = false;
      delete chartForEdit.options.border;
      //TODO: change color in colpicker
      $("#chartBorderColor").colpickSetColor(
        chartsDefaultBorderColor.replace("#", "")
      );
      repaintChartForEdit();
    }
    if (status === true) {
      $("#chartBorderColor").css("visibility", "visible");
 
      repaintChartForEdit();
    }
  });
  $(chartDOMIds.gridlinesX).off();
  $(chartDOMIds.gridlinesY).off();
 
  $(chartDOMIds.gridlinesY).on("change", function() {
    chartForEdit.options.axis.y.gridlines = this.checked;
    repaintChartForEdit();
  });
 
  $(chartDOMIds.gridlinesX).on("change", function() {
    //optionsAxisX
    chartForEdit.options.axis.x.gridlines = this.checked;
    repaintChartForEdit();
  });
 
  /* Event on accordion. Changed value of chart */
  $(accordionId).off();
  $(accordionId).on("input", function(e) {
    var idFull = e.target.id;
 
    var idFullSplited = idFull.split("__");
    var id = idFullSplited[2].split("--");
    var axisType = id[0];
    var axisUnit = id[1];
 
    if(axisUnit == "title"){
      var newValTitle = $("#"+idFull).val();
      chartForEdit.options.axis[axisType].label = newValTitle
        .replace("\r\n", "")
        .replace("\n", "");
        repaintChartForEdit();
       return;
    }
    var newVal = $("#" + idFull).val();
    newVal = +newVal;
     
 
    if (newVal !== "NaN" && typeof newVal === "number") {
      switch (axisType) {
        case "x":
          var changeOk = switchCheck(axisUnit, newVal, chartForEdit, chartOptions, axisType);
          axisRangeInputError("#" + idFull,changeOk);
          break;
        case "y":
        var changeOk = switchCheck(axisUnit, newVal, chartForEdit, chartOptions, axisType);
        axisRangeInputError("#" + idFull,changeOk);
          break;
      }
    }
  });
  /* CHANGE COLOR AFTER 'AUTO' */
  $('.colpick_submit').on('click', function(){
    $(".colorHandler", "#chartBorderColor").css("background", chartsDefaultBorderColor);
  });
}
 
function axisRangeInputError(idFull,changeOk) {
  var inputColor = changeOk ? "black" : "red";
  $(idFull).css("color",inputColor);
}
 
function updateChartEditLegend(e) {
  if (chartForEdit && isDefinedFunction(chartForEdit.repaint)) {
    var chartOptions = chartForEdit["options"];
    // Legend
    var value = $("#chart__legend").prop("checked");
    chartOptions.legend = value;
    repaintChartForEdit();
  }
}
 
function axisChange(axisName, action) {
  var axis = document.getElementsByClassName(axisName);
  var i = 0;
  for (i = 0; i < axis.length; i++) {
    axis[i].style.display = action;
  }
}
 
function setColorForChartSeriesSelection(color, seria) {
  if (chartForEdit && isDefinedFunction(chartForEdit.repaint)) {
    var chartOptions = chartForEdit["options"];
    var el = chartOptions.series.find(function(item) {
      return item.label === seria;
    });
    el.color = color;
    repaintChartForEdit();
  }
}
 
function setColorForChartBorder(color) {
  if (chartForEdit && isDefinedFunction(chartForEdit.repaint)) {
    var chartOptions = chartForEdit["options"];
    chartOptions.border = {};
    chartOptions["border"].color = color;
    chartOptions["border"].width = 1;
    repaintChartForEdit();
  }
}
 
function checkColors(seria, options, bg) {
  var seriaLab = $("#" + seria).val();
  var item = options.find(function(element) {
    return element.label === seriaLab;
  });
  if (typeof item !== "undefined") {
    var chartColorDef = item.color;
    $(bg).colpickSetColor(chartColorDef.replace("#", ""));
  }
}
 
function switchCheck(axisUnit, newVal, chartForEdit, chartOptions, axisType) {
  //chart__axis__y--min
  setOldValues();
  switch (axisUnit) {
    case "max":
      if (newVal > chartOptions.axis[axisType]["min"]) {
        chartForEdit.options.axis[axisType][axisUnit] = newVal;
        repaintChartForEdit();
        return true;
      } else {
       // setDefaultInputValue(axisType, axisUnit, chartForEdit.options.axis.old );
      }
      break;
    case "min":
      if (newVal < chartOptions.axis[axisType]["max"]) {
        chartForEdit.options.axis[axisType][axisUnit] = newVal;
        repaintChartForEdit();
        return true;        
      } else {
      //  setDefaultInputValue(axisType, axisUnit, chartForEdit.options.axis.old );
      }
      break;
    case "majorunit":
      var temp =
        chartOptions.axis[axisType]["max"] - chartOptions.axis[axisType]["min"];
      if (newVal > 0 && newVal < temp) {
        chartForEdit.options.axis[axisType][axisUnit] = newVal;
        repaintChartForEdit();
        return true;        
      } else {
      //  setDefaultInputValue(axisType, axisUnit, chartForEdit.options.axis.old );
      }
      break;
  }
  return false;
}
 
function repaintChartForEdit() {
chartForEdit.repaint();
chartPrepareImg();
}
 
 
function chartPrepareImg() {
    if (document.getElementById('copyChartToClipboard')) {
      var options = chartForEdit["options"];
      var base64 = convertToPng(getFloatingObjectContentsObj(chartForEdit), options.width, options.height);
      var img = document.getElementById('imgtocopy');
      img.querySelector('img').setAttribute('src', base64 );                
      $('#imgtocopy').show();
    }
}
 
function setOldValues(){
    var valuesForOldX ={}, valuesForOldY = {};
    Object.assign(valuesForOldX, chartForEdit.options.axis.x)  ; 
    Object.assign(valuesForOldY, chartForEdit.options.axis.y)  ; 
    valuesForOld = {x : valuesForOldX, y : valuesForOldY};
    chartForEdit.options.axis.old = valuesForOld;
}
 
function setDefaultInputValue(axisType, axisUnit, old ){
  $('#' + "chart__axis__" + axisType + "--" + axisUnit ).val(old[axisType][axisUnit]);
}
 
$(document).ready(function () {
    var icons = {header: "fa fa-caret-right", activeHeader: "fa fa-caret-down" };
    $(accordionId).accordion({heightStyle: "content",icons: icons});
});