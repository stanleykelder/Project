// Stanley Kelder
// 10313540

// Opmerking: ik heb voor de assen twee aparte arrays gemaakt. Dit bleek nodig, omdat de
// data die anders gepakt werd (bijvoorbeeld door d3.extent(data, function(d) { return d.date; }))
// was de complete json set ipv alleen het deel van desbetreffende stock.

var drawGraph = function(yDom, prod) {
    console.log(yDom, prod)

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
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("Aantal producten");

    // title for graph
    g.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "35px") 
      .style("text-decoration", "")  
      .text(prod);


    // create crosshairs
    var focus = g.append("g")
      .attr("class", "focus")
      .style("display", "none");

    var bisectDate = d3.bisector(function(d) { return d.date; }).left;

    // vertical crosshair 
    focus.append("line")
          .attr("id", "crosshairX");

    // pop-up text of exact values
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
      .on("mousemove", function() { 
        var mouse = d3.mouse(this);
        var mouseDate = xScale.invert(mouse[0]);
        var i = bisectDate(dates, mouseDate);
        var d = dates[i].date;
        
        var x = xScale(d);
        var y = yScale(eval("dates[i]." + yDom));
        
        // since data on x are the same only 1 vertical crosshair is needed
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
     })   

};

// drawing of lines
var drawLine = function (ver, prod, yDom) {

    console.log(prod)

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

    // domains for axes, with use of datecut and opencut arrays
    xScale.domain(d3.extent(dates, function(d) {
        return d.date;
    }));
    yScale.domain(d3.extent(dates, function(d) {
        return eval("d." + yDom);
    }));

    var line = d3.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(eval("d." + ver + "." + prod)); });

    g.append("path")
    .datum(dates)
    .attr("class", "line")
    .attr("d", line)
    .style("stroke", eval("colors." + ver + "." + prod))
};

// color per product
var colors = {Congo: {bier: "#00441b", fris: "#238b45", speciaalbier: "#74c476", overig: "#d9f0a3"},
              Spectrum: {bier: "#023858", fris: "#045a8d", speciaalbier: "#4292c6", overig: "#9ecae1"}};
