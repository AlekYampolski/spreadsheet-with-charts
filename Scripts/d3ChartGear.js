var clipPathPrefix = "clip-rect";
//TODO: localize from host
var textNaN = "#N/A";

var chartsDefaultBorderColor = "#e6e6e6";

function formatFloat(value) {
    value = value || "";
    if (isNaN(parseFloat(value))) return textNaN;
    precision = 5;
    return parseFloat(value).toFixed(precision).toLocaleString().replace(/\.?0+$/, '');
}

function D3Chart(element) {
    this.margin = 60;
    this.marginXright = this.margin;
    this.marginXleft = 60;

    this.labelFontSize = 7;
    this.maxTicksX = 20;
    this.maxTicksY = 10;
    this.legendWidth = null;
    this.minX = null;
    this.maxX = null;
    this.minY = null;
    this.maxY = null;
    this.xAxisLength = null;
    this.yAxisLength = null;
    this.xAxisScale = null;
    this.categories = null;
    this.element = element;
    this.gForAxisY = null;
    this.title = null;
    this.axisX = {
        scale: null,
        majorunit: null, 
        ticksCount : null,
        label: null,
        originline: null
    };
    this.axisY = {
        scale: null,
        majorunit: null,
        ticksCount: null,
        label: null
    }
    this.zoom = 1;

     this.options = null;
     this.flag = true;
     this.xAxisPos = null;
     this.optionsAxisX  = null;
     this.optionsAxisY  = null;     

     this.clipPathID = null;
     this.borderColor = null;
 
}

String.prototype.hashCode = function () {
    var hash = 0, i, chr, len;
    if (this.length == 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

D3Chart.prototype.setZoom = function (zoom) {
    this.zoom = zoom;
}

D3Chart.prototype.x_axis_d3 = function x_axis_d3(skipXlabels) {
    var lastItem = Math.round(this.axisX.ticksCount);
    /* if category remove last tick */
    if (this.categories && this.categories.length > this.axisX.majorunit) {
        // majorunit can be null ! var ticks = this.categories.length / this.axisX.majorunit;
        var xAxis = d3.svg
          .axis()
          .scale(this.axisX.scale)
          .orient("bottom")
          .ticks(lastItem - 1)
          .tickValues(              
            this.axisX.scale.domain().filter(function(d, i) {
            return d;
            })
          );
      } else {
        var xAxis = d3.svg
          .axis()
          .scale(this.axisX.scale)
          .orient("bottom")
          .ticks(lastItem)
          .tickFormat(function(d, i) {
              
            if (!skipXlabels) {
                return d;
            } 
            if (i % 2 == 1) {
              if (i == lastItem || i == 0) {
                return d;
              } else
              return "";
            } else {
              return d;
            }
          });
      }
    
    return xAxis

}
D3Chart.prototype.createChart = function createChart(optionsInput) {
    var options = $.extend(true, {}, optionsInput);
    this.options = options;
    this.margin *= this.zoom;
    this.labelFontSize *= this.zoom;

    var svg = this.element.append("svg")
        .attr("class", "axis")
        .attr("width", options.width)
        .attr("height", options.height)
        //.attr("viewBox", "0 0 " + options.width + " " + options.height)
        //.attr("preserveAspectRatio", "none");

    var width = options.width,
        height = options.height;
    
    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "white");

    var chartExtraType = "";
    var indexTemp = null;
    for (var i = 0; i < options.series.length; i++) {
        if (options.series[i].visible === false) {
            indexTemp = i;
            continue;
        }
        /* options.series[i].extratype is defined only for Box-Plot chart and on core v6.5+ */
        if (options.series[i].label == "Box" ||
            (typeof options.series[i].extratype == 'string' && options.series[i].extratype == 'boxplot') ) {
            chartExtraType = 'boxplot';
            var max = 1;
            for (var j = 0; j < options.series[i].y.length; j++) {
                if (options.series[i].y[j] == null) {
                    max++;
                }
            }
            options.axis.x["max"] = max;
            options.axis.x["min"] = 0;
        }
    }

    if(indexTemp != null)
        options.series.splice(indexTemp, 1);

    if (options.legend) {
        options.legend = this.createLegend(svg, options.series, width, height);
    }
    /* axis.length = svg container h/w - both margins */
     this.marginXright = (options.legend ? this.legendWidth * this.zoom : this.margin);

    this.xAxisLength =  width - this.marginXright - this.marginXleft ;
    this.yAxisLength = height - 2 * this.margin;
   
    
    this.findDataRange(options);
    this.init(options);
    var gForAxisY = svg.append("g");
    var gForAxisX = svg.append("g");

    this.gForAxisY = gForAxisY;
    this.gForAxisX = gForAxisX;
    var g = svg.append("g");
    /* title */
    var lines = options.title.split("\r\n");
    /* multi line */
    var marginTitle = lines.length == 1 ? 20 : 30;
    for (var y = this.margin - marginTitle * this.zoom, i = 0; i < lines.length; i++, y += 20 * this.zoom) {
        g.append("text")
            .attr("x", (width / 2))
            .attr("y", y)
            .attr("class", "chart-title")
            .text(lines[i]);
    }
    
    this.createAxis(svg, (this.axisX.originline || this.axisX.originline == 0) ? svg.append("g") : gForAxisX, gForAxisY);
    this.setInlineStyles();
    /* autofit axis tick labels */
    var axisYticksWidth = this.calcYAxisTicksWidth();
    var axisXticksWidthSum = this.calcXAxisTicksWidthSum();
    if (axisYticksWidth > 138) axisYticksWidth = 138;
    var moveY = axisYticksWidth > 40;
    var sparseX = axisXticksWidthSum > this.xAxisLength;
    if((moveY || sparseX) && this.flag){
        if (moveY) {
        var axisTitleYWidth = 25;
        this.marginXleft = Math.floor(axisYticksWidth + axisTitleYWidth);  
        this.xAxisLength =  width - this.marginXright - this.marginXleft ;
        this.xAxisScale = this.calcScaleX(this.optionsAxisX);
        this.axisX.scale = this.xAxisScale;
        sparseX = axisXticksWidthSum > this.xAxisLength;
        }
        this.xAxis = this.x_axis_d3( sparseX);
        if (moveY)
            svg.select('.xaxislabel').attr("dy", "-1.1em");
            
        var x = this.axisTransform(svg.select('.x-axis'), this.xAxis, this.xAxisPos);
        this.axisTransform(svg.select('.y-axis'), this.yAxis, this.margin    );    
        
        this.flag = false;  
     }    

     this.addClipPath(svg);
    

    for (var i = 0; i < options.series.length; i++) {
        this.createSeria(svg, options.series[i], height, chartExtraType);
    }
    this.setInlineStyles();

    var borderColor = chartsDefaultBorderColor;
    var borderWidth = 1;
    if(options.hasOwnProperty('border')) {
        var optBorder = options.border;
        if(optBorder.hasOwnProperty('color')) 
            borderColor = optBorder.color;
        if(optBorder.hasOwnProperty('width')) 
            borderWidth = optBorder.width;
    }
//borderColor = d3.rgb(borderColor);
//options.borderColor = borderColor;
    svg.attr('border', borderWidth);
    if (borderWidth > 0)
        var borderPath = svg.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("height", height)
                    .attr("width", width)
                    .style("stroke", borderColor)
                    .style("fill", "none")
                    .style("stroke-width", borderWidth);
}

D3Chart.prototype.addClipPath = function addClipPath(svg){
      /* define chart plot area (body) using clip path */
      var clipX = this.marginXleft;
      var clipY = this.margin;
      this.clipPathID = clipPathPrefix + this.options.row + this.options.col +  Math.floor(Math.random()*1000);

      if (this.options && this.options.title && typeof this.options.title.hashCode == "function")
        this.clipPathID += this.options.title.hashCode().toString();
      svg.append("clipPath") // define a clip path
    .attr("id", this.clipPathID) // give the clipPath an ID
    .append("rect")    
    .attr("x",  clipX) // position the x-centre
    .attr("y", clipY)
    .attr("width", this.xAxisLength)            // set the x radius
    .attr("height", this.yAxisLength);  // position the y-centre
}


D3Chart.prototype.calcYAxisTicksWidth = function calcYAxisTicksWidth(){
    var labs = this.gForAxisY.selectAll(".tick text");
    var wt = d3.max(d3.merge(labs), function(d) {
        var temp = d.getComputedTextLength();
        return temp;
      });
    if (wt < 40) wt = 40;
    return wt;
  }

D3Chart.prototype.calcXAxisTicksWidthSum = function calcXAxisTicksWidthSum(){
    var labs = this.gForAxisX.selectAll(".tick text");
    var wtSum = d3.sum(d3.merge(labs), function(d) {
        var temp = d.getComputedTextLength();
        return temp;
        });
    // TODO: вариант 2 - вернуть wt * ticksCount();
        // var wt = d3.max(d3.merge(labs), function(d) {
        //     var temp = d.getComputedTextLength();
        //     return temp;
        //   });
    return wtSum;
}
 

D3Chart.prototype.wrap = function (text, width, caller) {
    var fontSize = caller.labelFontSize,
        curFontSize = fontSize;
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em"),
            curFontSize = fontSize;
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                if (line.length == 1) {
                    var newFontSize = fontSize / (tspan.node().getComputedTextLength() / width);
                    if (newFontSize < curFontSize) {
                        curFontSize = newFontSize
                    }
                }
                else {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        }
        caller.element.selectAll("tspan").style("font-size", curFontSize + "pt")
    });
}

D3Chart.prototype.setInlineStyles = function setInlineStyles() {
    this.element.selectAll(".axis").attr("style", "width: 100%; height: 100%;background-color: white;");
    this.element.selectAll(".axis path").style("fill", "none").style("stroke", function () {
        return d3.select(this).style("stroke") !== "none" ? d3.select(this).style("stroke") : "#333"
    });
    this.element.selectAll(".axis line").style("fill", "none").style("stroke", function () {
        return d3.select(this).style("stroke") !== "none" ? d3.select(this).style("stroke") : "#333"
    });
    this.element.selectAll(".axis .grid-line").attr("style", "stroke: #e0e0e0;shape-rendering: crispedges;");
    this.setInlineStylesFont();
    this.element.selectAll(".axis .chart-title").attr("style", "font-size:" + 11 * this.zoom + "pt;font-weight:bold;font-family: Arial;text-anchor:middle;");
    this.element.selectAll(".axis .axis-label").attr("style", "font-size:" + 10 * this.zoom + "pt;font-weight:bold;font-family: Arial;text-anchor:middle;");
}

D3Chart.prototype.setInlineStylesFont = function setInlineStylesFont() {
    this.element.selectAll(".axis text").style("font-size", this.labelFontSize + "pt").style("font-family", "Verdana");
}

D3Chart.prototype.createLegend = function createLegend(svg, series, width, height) {
    var legendMarkSize = 10;
    var legendMargin = 4;
    var yPos = (height - this.margin - series.length * 15 * this.zoom) / 2
    var zoom = this.zoom;
    var legendTable = svg.append("g")
        .attr("transform", "translate(0, " + yPos + ")")
        .attr("class", "legendTable");

    var legend = legendTable.selectAll(".legend")
        .data(series)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0, " + i * 20 * zoom + ")";
        });

    /* Removed: CREATE TIPS FOR LABEL <== */
    // var tip = d3.tip()
    //     .attr('class', 'd3-tip')
    //     .html(function(d){return d.label});
    // legend.call(tip);
    /* draw series marker in legend */
    //if (d.hasOwnProperty("markers") && d.markers.visible) *********** this.createPoints(svg, options.markers, data, options.markers.hasOwnProperty("color") ? options.markers.color : options.color, "seria" + options.label.hashCode(), tip);

    legend.append("rect")
        .attr("x", (width - 20) * this.zoom)
        .attr("y", 4 * this.zoom + legendMarkSize * this.zoom / 4 /*  + height/2.0 */ )
        .attr("width", legendMarkSize * this.zoom)
        .attr("height", legendMarkSize * this.zoom / 2)
        .style("fill",  function (d) {return d.color; } );
    // .on('mouseover', tip.show).on('mouseout', tip.hide);

    var r = legend.append("text")
        .attr("x", (width - 24) * this.zoom)
        .attr("y", 9 * this.zoom)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
         .text(
             function (d) { return d.label; });
    this.setInlineStylesFont();    
    

    this.legendWidth = legendTable.node().getBBox().width + legendMarkSize + legendMargin;
    if (this.legendWidth < 1 || this.legendWidth > width / 2) {
        this.legendWidth =  legendMargin;    
        legendTable.remove();
       return 0;
    }   else {
    // move boxes to left
    legendTable.selectAll(".legend rect").attr("x", width - this.legendWidth * this.zoom + legendMargin);
    // left align legend text
    legendTable.selectAll(".legend text").attr("x", width - this.legendWidth * this.zoom + 15 * this.zoom + legendMargin).style("text-anchor", "start");
    }
     return 1;
}

D3Chart.prototype.findDataRange = function findDataRange(options) {
    var temp;
    for (var i = 0; i < options.series.length; i++) {
        if (options.series[i].x) {
            temp = d3.max(options.series[i].x);
            if (this.maxX == null || temp > this.maxX)
                this.maxX = temp;
            temp = d3.min(options.series[i].x);
            if (this.minX == null || temp < this.minX)
                this.minX = temp;
        }
        else {
            if (!this.minX || this.minX > 1)
                this.minX = 1;

            if (!this.maxX || this.maxX < options.series[i].y.lenght)
                this.maxX = options.series[i].y.length;
        }
        if (options.series[i].y) {
            temp = d3.max(options.series[i].y);
            if (this.maxY == null || temp > this.maxY)
                this.maxY = temp;
            temp = d3.min(options.series[i]);
            if (this.minY == null || temp < this.minY)
                this.minY = temp;
        }
    }
}

function seriesIsBar(options) {
    return (options.type == "bar");
}

D3Chart.prototype.createSeria = function createSeria(svg, options, height,chartExtraType) {
    if (seriesIsBar(options))
        options.x = null;
    else if (!options.x) {
        options.x = [];
        for (var i = this.minX; i <= this.maxX; i++) {
            options.x.push(i);
        }
    }

    var data = this.scaleData(options.x, options.y);
    var isDashed = options["line-style"] && options["line-style"] == "dash";
    var zeroY = this.scaleData([0], [0])[0].y;
    var categories  = this.categories;
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function (d, i) {
            var valueText = "";
            var firstLine = (options.label && options.label.length > 0) ? "<strong>\"" + options.label + "\"</strong><br>" : "";
            /* correct index "i" for null/missing values */
            var optionsX = options.x? options.x.filter(function(n){ return n != undefined;}) : null;
            var optionsY = options.y.filter(function(n){ return n != undefined;});
            /* handle special chart types */
            if (!!chartExtraType) {
                if (chartExtraType == 'boxplot' && optionsX) {
                    var ii = parseInt(optionsX[i]);
                    if (categories && !isNaN(ii) && ii < categories.length) {
                        valueText = categories[ii] + ": " + formatFloat(optionsY[i]);
                    }
                }
            } else {
                /* just regular chart types - show either Y value or both (X,Y) values */
                if (seriesIsBar(options) && optionsY[i])
                    valueText = formatFloat(optionsY[i]);
                else if (optionsX)
                    valueText = "(" + formatFloat(optionsX[i]) +", "+ formatFloat(optionsY[i])  + ")";
            }
            if (valueText != null && valueText.length > 0)
                return firstLine + "<span>" + valueText + "</span>";
            
      });
    svg.call(tip);

    var pathDrawFunc;  
    if (options.type == "line")
        pathDrawFunc = d3.svg.line()
            .defined(function (d) { return d.y != null; })
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; });
    if (options.type == "bar") {
        var intentWidth = this.xAxisScale.rangeBand() * ((100 - options.width) / 100) / 2;
        var margin = this.margin;
        var barsvg = svg.append("g")
            // .attr("transform",  /*right*/
            //      "translate(" + margin + ", 0)")
            // <== REMOVED MARGIN HERE #1
            .attr("clip-path", "url(#"+this.clipPathID+")")
            .selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            // <== REMOVED MARGIN HERE #2
           /*  .attr("x", function (d) { return d.x - margin + intentWidth; }) */
            .attr("x", function (d) { return d.x  + intentWidth; })
            .attr("width", this.xAxisScale.rangeBand() * (options.width / 100))
            .attr("y", function (d) { return Math.min(d.y, zeroY); })
            .attr("height", function (d) { return Math.abs(d.y - zeroY); })
        .attr("fill", options.color);
       barsvg.on('mouseover', tip.show);
       barsvg.on('mouseout', tip.hide);
        return;
    }
    if (options.type == "spline")
        pathDrawFunc = d3.svg.line().interpolate("cardinal")
            .defined(function (d) { return d.y != null; })
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; });
    if (options.type == "step")
        pathDrawFunc = d3.svg.line().interpolate("step-after")
            .defined(function (d) { return d.y != null; })
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; });

    if (options.type != "scatter") {
        svg.append("g").append("path")
        .attr("clip-path", "url(#"+this.clipPathID+")")
            .attr("d", pathDrawFunc(data))
            .style("stroke", options.color)
            .style((isDashed ? "stroke-dasharray" : "stroke-width"), (isDashed ? "7pt," + options.width + "pt" : options.width + "pt"));
    }

    if (options.hasOwnProperty("markers") && options.markers.visible)
        this.createPoints(svg, options.markers, data, options.markers.hasOwnProperty("color") ? options.markers.color : options.color, "seria" + options.label.hashCode(), tip);
}

D3Chart.prototype.createPoints = function createPoints(svg, options, data, color, label, tip) {
    var r = options.hasOwnProperty("r") ? options.r : 5;
    var type = options.hasOwnProperty("type") ? options.type : "circle";

    for (var i = 0; i < data.length; i++) {
        if (data[i].x == null || data[i].y == null) {
            data.splice(i, 1);
            i--;
        }
    }
    
    if (type == "circle")
        svg.selectAll(".dot " + label)
            .data(data)
            .enter().append("circle")
            .attr("clip-path", "url(#"+this.clipPathID+")")
            .style("stroke", color)
            .style("fill", color)
            .attr("class", "dot " + label)
            .attr("r", Math.ceil(r/2))
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
    if (type == "rect")
        svg.selectAll(".dot " + label)
            .data(data)
            .enter().append("rect")
            .attr("clip-path", "url(#"+this.clipPathID+")")
            .style("stroke", color)
            .style("fill", color)
            .attr("class", "dot " + label)
            .attr("width", r)
            .attr("height", r)
            .attr("x", function (d) { return d.x - r / 2; })
            .attr("y", function (d) { return d.y - r / 2; })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
    if (type == "triangle") {
        svg.selectAll(".dot " + label)
            .data(data)
            .enter().append("polygon")
            .attr("clip-path", "url(#"+this.clipPathID+")")
            .style("fill", color)
            .style("stroke", color)
            .attr("points", function (d) {
                return (d.x - r).toString() + ","
                    + (d.y - r).toString() + " "
                    + (d.x + r).toString() + ","
                    + (d.y - r).toString() + " "
                    + d.x.toString() + ","
                    + (d.y + r).toString();
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
    }
    if (type == "plus" || type == "star") {
        svg.selectAll(".dot " + label)
            .data(data)
            .enter().append("line")
            .attr("clip-path", "url(#"+this.clipPathID+")")
            .style("stroke", color)
            .attr("x1", function (d) { return d.x })
            .attr("y1", function (d) { return d.y + r })
            .attr("x2", function (d) { return d.x })
            .attr("y2", function (d) { return d.y - r })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        svg.selectAll(".dot " + label)
            .data(data)
            .enter().append("line")
            .attr("clip-path", "url(#"+this.clipPathID+")")
            .style("stroke", color)
            .attr("x1", function (d) { return d.x + r })
            .attr("y1", function (d) { return d.y })
            .attr("x2", function (d) { return d.x - r })
            .attr("y2", function (d) { return d.y })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
    }
    if (type == "star") {
        svg.selectAll(".dot " + label)
            .data(data)
            .enter().append("line")
            .attr("clip-path", "url(#"+this.clipPathID+")")
            .style("stroke", color)
            .attr("x1", function (d) { return d.x - r })
            .attr("y1", function (d) { return d.y + r })
            .attr("x2", function (d) { return d.x + r })
            .attr("y2", function (d) { return d.y - r })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        svg.selectAll(".dot " + label)
            .data(data)
            .enter().append("line")
            .attr("clip-path", "url(#"+this.clipPathID+")")
            .style("stroke", color)
            .attr("x1", function (d) { return d.x + r })
            .attr("y1", function (d) { return d.y + r })
            .attr("x2", function (d) { return d.x - r })
            .attr("y2", function (d) { return d.y - r })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
    }   
}

D3Chart.prototype.scaleData = function scaleData(rawDataX, rawDataY) {
    var scaleX, scaleY;
    if (rawDataX)
        scaleX = d3.scale.linear().domain([this.minX == null ? d3.min(rawDataX) : this.minX, this.maxX == null ? d3.max(rawDataX) : this.maxX]).range([0, this.xAxisLength]).nice();
    else {
        rawDataX = this.categories;
        scaleX = this.xAxisScale;
    }

    scaleY = d3.scale.linear().domain([this.maxY == null ? d3.max(rawDataY) : this.maxY, this.minY == null ? d3.min(rawDataY) : this.minY]).range([0, this.yAxisLength]).nice();

    var data = [];
    for (i = 0; i < rawDataX.length; i++)
        data.push({
            x: rawDataX[i] == null ? null : scaleX(rawDataX[i]) + this.marginXleft,

            y: rawDataY[i] == null ? null : scaleY(rawDataY[i]) + this.margin
        });

    return data;
}

D3Chart.prototype.createGridlines = function createGridlines(svg) {
    //create gridlines
    var showGridlinesX = this.optionsAxisX.hasOwnProperty("gridlines") && this.optionsAxisX.gridlines;    
    this.optionsAxisX.gridlines = showGridlinesX;
    if (showGridlinesX) {
        svg.selectAll("g.x-axis g.tick")
            .append("line")
            .classed("grid-line", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", -this.yAxisLength);
    }
    var showGridlinesY = true;
    if (this.optionsAxisY.hasOwnProperty("gridlines") && ! this.optionsAxisY.gridlines)
            showGridlinesY = false;
    this.optionsAxisY.gridlines = showGridlinesY;        
    if (showGridlinesY) {
    svg.selectAll("g.y-axis g.tick")
        .append("line")
        .classed("grid-line", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", this.xAxisLength)
        .attr("y2", 0);
    }
}

D3Chart.prototype.createAxis = function createAxis(svg, gForX, gForY) {
    /* X axis */
  	var lastItem = Math.floor(this.axisX.ticksCount);

    this.xAxis = this.x_axis_d3();

    var yAxis = d3.svg.axis()
                 .scale(this.axisY.scale)
                 .orient("left")
                 .ticks(this.axisY.ticksCount);

    /*draw axis*/
    var xAxisPos;

    this.yAxis = yAxis;
    if (this.axisX.originline || this.axisX.originline == 0) {
        xAxisPos = this.scaleData([0], [this.axisX.originline])[0].y;
    }else{
        xAxisPos = this.height - this.margin;
    }

    this.xAxisPos = xAxisPos;
     
    var x = this.axisTransform(gForX.attr("class", "x-axis"), this.xAxis,this.xAxisPos);
    this.axisTransform(gForY.attr("class", "y-axis"), yAxis, this.margin);    

    if (this.axisX.scale.rangeBand) {
        x.selectAll(".tick text")
            .call(this.wrap, this.axisX.scale.rangeBand(), this);
    }
    var tempBorderCheck = this.options.hasOwnProperty('gridlines');
    if(!tempBorderCheck){
        this.createGridlines(svg);
    } else if(this.options.gridlines === true){
        this.createGridlines(svg);
    }
    /* create labels */
    var g = svg.append("g");
    g.append("text")
        .attr("x", this.margin / 2)
        .attr("y", this.height / 2)
        .attr("class", "axis-label xaxislabel")
        .attr("transform", "rotate(-90, " + this.margin / 2 + ", " + this.height / 2 + ")")
        .text(this.axisY.label);
    g.append("text")
        .attr("x", (this.width / 2))
        .attr("y", this.height - this.margin / 2)
        .attr("class", "axis-label")
        .text(this.axisX.label);
}

D3Chart.prototype.scaleNumNice = function(range, toRound){
    var exponent = Math.floor(Math.log(range)/Math.LN10),
        fraction = range / Math.pow(10, exponent),
        niceFraction;

    if (toRound) {
        if (fraction < 1.5)
            niceFraction = 1;
        else if (fraction < 3)
            niceFraction = 2;
        else if (fraction < 7)
            niceFraction = 5;
        else
            niceFraction = 10;
    } else {
        if (fraction <= 1)
            niceFraction = 1;
        else if (fraction <= 2)
            niceFraction = 2;
        else if (fraction <= 5)
            niceFraction = 5;
        else
            niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent);
}

D3Chart.prototype.axisTransform = function axisTransform(selector, axis, xAxisPos){
    return selector
        .attr("transform",  /* shift down and right */
        "translate(" + this.marginXleft + "," + xAxisPos + ")")
        .call(axis);
}

D3Chart.prototype.calcScaleX = function calcScaleX(optionsAxisX) {
var scaleX;
if (optionsAxisX.hasOwnProperty("categories")) {
    scaleX = d3.scale.ordinal().rangeRoundBands([0, this.xAxisLength], 0)
        .domain(optionsAxisX.categories);
    this.categories = optionsAxisX.categories;
}
else {
    scaleX = d3.scale.linear().domain([this.minX, this.maxX]).nice().range([0, this.xAxisLength]);
}
return scaleX;
}

D3Chart.prototype.init = function init(options) {
    var width = options.width,
        height = options.height;

    this.width = width;
    this.height = height;

    var optionsAxisX = new Object();
    if (options.hasOwnProperty("axis") && options.axis.hasOwnProperty("x"))
        optionsAxisX = options.axis.x;
    var optionsAxisY = new Object();
    if (options.hasOwnProperty("axis") && options.axis.hasOwnProperty("y"))
        optionsAxisY = options.axis.y;

    var revertX = options.hasOwnProperty("revertAxisX") && options.revertAxisX;
    var revertY = options.hasOwnProperty("revertAxisY") && options.revertAxisY;

    this.minX = optionsAxisX.hasOwnProperty("min") ? optionsAxisX.min : this.minX;
    this.maxX = optionsAxisX.hasOwnProperty("max") ? optionsAxisX.max : this.maxX;
    if (optionsAxisX.hasOwnProperty("majorunit")) {
        this.axisX.ticksCount = (this.maxX - this.minX) / optionsAxisX.majorunit;
        this.axisX.majorunit = optionsAxisX.majorunit;
    } else {
        /* TODO: scale ticks by calculating ticksCount as range
        var niceRange = this.scaleNumNice(Math.abs(this.maxX - this.minX),false);
        var niceMajorUnit = this.scaleNumNice(niceRange / (this.maxTicksX - 1), true);
        this.axisX.ticksCount = ceil(niceRange/niceMajorUnit);

        See example below:
        `
        maxTicks = Y:10, X: 20 (or less)
        range = niceNum(maxPoint - minPoint, false);
        tickSpacing = niceNum(range / (maxTicks - 1), true);
        niceMin = Math.floor(minPoint / tickSpacing) * tickSpacing;
        niceMax = Math.ceil(maxPoint / tickSpacing) * tickSpacing;
        `
        */ 
        this.axisX.ticksCount = this.scaleNumNice(this.maxTicksX, true);
    }

    if (revertX) {
        var mx = this.maxX;
        this.maxX = this.minX;
        this.minX = mx;
    }

    this.optionsAxisX = optionsAxisX;
    this.optionsAxisY = optionsAxisY;

    scaleX = this.calcScaleX(optionsAxisX);

    this.xAxisScale = scaleX;

    this.axisX.scale = scaleX;
    this.axisX.label = optionsAxisX.label;

    var optionsAxisY = new Object();
    if (options.hasOwnProperty("axis") && options.axis.hasOwnProperty("y"))
        optionsAxisY = options.axis.y;
    if (optionsAxisY.hasOwnProperty("categories")) {
        scaleY = d3.scale.ordinal().range([0, this.yAxisLength])
            .domain(optionsAxisY.categories.map(function (d) { return d; }));
        this.minY = null;
        this.maxY = null;
    }
    else {
        this.maxY = optionsAxisY.hasOwnProperty("max") ? optionsAxisY.max : this.maxY;
        this.minY = optionsAxisY.hasOwnProperty("min") ? optionsAxisY.min : this.minY;

        if (revertY) {
            var my = this.maxY;
            this.maxY = this.minY;
            this.minY = my;
        }
        scaleY = d3.scale.linear().domain([this.maxY, this.minY]).nice().range([0, this.yAxisLength]);
    }
    if (optionsAxisY.hasOwnProperty("majorunit")) {    
        this.axisY.ticksCount = Math.abs(this.maxY - this.minY) / optionsAxisY.majorunit;
    } else 
        this.axisY.ticksCount = this.scaleNumNice(this.maxTicksY, true);
    this.axisY.scale = scaleY;
    this.axisY.label = optionsAxisY.label;
    this.axisX.originline = parseFloat(optionsAxisY.originline);
}

function wrappedText(text, width) {
    text.each(function() {
              var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.1,
              y = text.attr("y"),
              dy = parseFloat(text.attr("dy")),
              tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
              while (word = words.pop()) {
              line.push(word);
              tspan.text(line.join(" "));
              if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
              }
              }
              });
}