// Stanley Kelder
// 10313540

// draw graph without lines
var drawGraph = function(yDom, prod) {

    var svg = d3.select("#line-chart"),
    margin = {top: 50, right: 150, bottom: 30, left: 30},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // format unix time to nice readable format for cross-hair
    var datum = d3.timeFormat("%a %e %B");

    // function to scale values for x and y axes
    var xScale = d3.scaleTime()
        .rangeRound([0, width]);
    var yScale = d3.scaleLinear()
        .rangeRound([height, 0]);

    // Domains of axes
    var xDomain = d3.extent(dates, function(d) {
        return d.date;
    });
    var yDomain = d3.extent(dates, function(d) {
        return eval("d." + yDom);
    });

    xScale.domain(xDomain);
    yScale.domain(yDomain);

    // create x axis
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    // create y axis
    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.41em")
        .style("text-anchor", "end")
        .text("Aantal producten");

    // title for graph if single product 
    g.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "35px") 
      .style("text-decoration", "")  
      .text(prod);


    // create crosshair
    var focus = g.append("g")
      .attr("class", "focus")
      .style("display", "none");

    var bisectDate = d3.bisector(function(d) { return d.date; }).left;

    focus.append("line")
          .attr("id", "crosshairX");

    // text attribute for date on crosshair
    var text = g.append("text")

    // drawing of crosshairs and pop-up texts
    g.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() {
        focus.style("display", null);
      })
      .on("mouseout", function() {
        focus.style("display", "none");
      })
      // move crosshair with mousemove
      .on("mousemove", function() { 
        var mouse = d3.mouse(this);
        var mouseDate = xScale.invert(mouse[0]);
        var i = bisectDate(dates, mouseDate);
        var d = dates[i].date;
        
        var x = xScale(d);
        var y = yScale(eval("dates[i]." + yDom));
        
        focus.select("#crosshairX")
            .attr("x1", x)
            .attr("y1", yScale(yDomain[1]))
            .attr("x2", x)
            .attr("y2", yScale(yDomain[0]));

        // pop-up text for each horizontal crosshair (each data-line)
        text.attr("x", x)
            .attr("y", -5)
            .style("stroke", "grey") 
            .text(datum(d));
     });

    // Add names of Congo and Spectrum to legend
    g.append("text")
      .attr("x", width + 10)             
      .attr("y", 20)
      .attr("text-anchor", "left")  
      .style("font-size", "30px") 
      .style("fill", "grey")  
      .text("Congo");   

    g.append("text")
      .attr("x", width + 10)             
      .attr("y", 180)
      .attr("text-anchor", "left")  
      .style("font-size", "30px") 
      .style("fill", "grey")  
      .text("Spectrum"); 

};

// draw lines in graph
var drawLine = function (ver, prod, yDom) {

    // create area for graph
    var svg = d3.select("#line-chart"),
    margin = {top: 50, right: 150, bottom: 30, left: 30},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // function to scale values for x and y axes
    var xScale = d3.scaleTime()
        .rangeRound([0, width]);
    var yScale = d3.scaleLinear()
        .rangeRound([height, 0]);

    xScale.domain(d3.extent(dates, function(d) {
        return d.date;
    }));
    yScale.domain(d3.extent(dates, function(d) {
        return eval("d." + yDom);
    }));

    // create function to draw line
    var line = d3.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(eval("d." + ver + "." + prod)); });

    // draw line
    g.append("path")
    .datum(dates)
    .attr("class", "line")
    .attr("id", (ver + prod))
    .attr("d", line)
    .style("stroke", eval("colors." + ver + "." + prod))

    // create interactive legend
    g.append("text")
      .attr("x", width + 30)             
      .attr("y", eval("legendY." + ver + "." + prod))
      .attr("text-anchor", "left")  
      .attr("class", "legend")
      .attr("id", ("text" + ver + prod))
      .style("font-size", "20px") 
      .style("fill", eval("colors." + ver + "." + prod))  
      .on("click", function(){
        var active   = this.active ? false : true,
        newOpacity = active ? 0 : 1; 
        textOpacity = active ? 0.2 : 1;
        // Hide or show the elements based on the ID
        d3.select("#"+ ver + prod)
            .style("opacity", newOpacity); 
        this.active = active;
        // change opacity of word in legend to see if line is active or not
        d3.select("#text"+ ver + prod)
            .style("opacity", textOpacity)
        })
      .text(prod);

};

// color per product
var colors = {Congo: {bier: "#00441b", fris: "#238b45", speciaalbier: "#74c476", overig: "#a1d99b"},
              Spectrum: {bier: "#023858", fris: "#4292c6", speciaalbier: "#9ecae1"}};

// Yvalues of words in legend
var legendY = {Congo: {bier: "50", fris: "80", speciaalbier: "110", overig: "140"},
              Spectrum: {bier: "210", fris: "240", speciaalbier: "270", overig: "300"}};
