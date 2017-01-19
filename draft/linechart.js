// Stanley Kelder
// 10313540

// Opmerking: ik heb voor de assen twee aparte arrays gemaakt. Dit bleek nodig, omdat de
// data die anders gepakt werd (bijvoorbeeld door d3.extent(data, function(d) { return d.date; }))
// was de complete json set ipv alleen het deel van desbetreffende stock.


// load json file
function setDataForQ(ButtonQ) {
var stockdata = [];
d3.json("spectrumhok.json", function(data) {
    console.log(data)
    // date formats
    var parseTime = d3.timeParse("%d/%m/%Y");
    var formatTime = d3.timeFormat("%d/%m");         

    // adjust data per stock
    // arrays datecut and opencut are used for the axes
    var datecut = [];
    var opencut = [];
    var stockdata = [];
    var stockdata2 = [];
    var stockdata3 = [];
    var stockdatatotal= [];

    // select data per stock and quarter
    data.map(function(d){ 
        console.log(d.state.on, parseTime(d.state.on.date))
        datecut.append(parseTime(d.state.on.date));
    });
    console.log(datecut)
    // create area for graph
    var svg = d3.select("svg"),
    margin = {top: 50, right: 150, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // function to scale values for x and y axes
    var xScale = d3.scaleTime()
        .rangeRound([0, width]);
    var yScale = d3.scaleLinear()
        .rangeRound([height, 0]);

    // domains for axes, with use of datecut and opencut arrays
    xScale.domain(d3.extent(datecut));
    yScale.domain(d3.extent(opencut));

    // min and max of domains
    var xDomain = d3.extent(stockdatatotal, function(d) {
        return d.date;
    });
    var yDomain = d3.extent(stockdatatotal, function(d) {
        return d.open;
    });

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
        .text("Opening value ($)");

    // title for graph
    g.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "35px") 
      .style("text-decoration", "")  
      .text("Weekly stock opening values 2011");

    // drawing of lines
    var line = d3.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.open); });

    g.append("path")
        .datum(stockdata)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "orangered");

    g.append("path")
        .datum(stockdata2)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "green");

    g.append("path")
        .datum(stockdata3)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "steelblue");

    // create crosshairs
    var focus = g.append("g")
      .attr("class", "focus")
      .style("display", "none");

    var bisectDate = d3.bisector(function(d) { return d.date; }).left;

    // horizontal crosshair 
    focus.append("line")
          .attr("id", "crosshairX");
    // vertical crosshairs    
    focus.append("line")
          .attr("id", "crosshairY1");
    focus.append("line")
          .attr("id", "crosshairY2");
    focus.append("line")
          .attr("id", "crosshairY3");

    // pop-up text of exact values
    var text1 = g.append("text")
    var text2 = g.append("text")
    var text3 = g.append("text")
 
    // stocknames next to corresponding lines
    var stock1 = g.append("text")
    var stock2 = g.append("text")
    var stock3 = g.append("text")   

    stock1.attr("x", xScale(xDomain[1]) + 20)
        .attr("y", yScale(stockdata[stockdata.length - 1].open) + 13)
        .style("stroke", "orangered") 
        .text( stockdata[stockdata.length - 1].stock);    
    stock2.attr("x", xScale(xDomain[1]) + 20)
        .attr("y", yScale(stockdata2[stockdata2.length - 1].open) + 13)
        .style("stroke", "green") 
        .text( stockdata2[stockdata2.length - 1].stock);    
    stock3.attr("x", xScale(xDomain[1]) + 20)
        .attr("y", yScale(stockdata3[stockdata3.length - 1].open) + 13)
        .style("stroke", "steelblue") 
        .text( stockdata3[stockdata3.length - 1].stock);    
          
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
        var i = bisectDate(stockdata, mouseDate);
        var d = stockdata[i].date;
        
        var x = xScale(d);
        var y1 = yScale(stockdata[i].open);
        var y2 = yScale(stockdata2[i].open);
        var y3 = yScale(stockdata3[i].open);
        
        // since data on x are the same only 1 vertical crosshair is needed
        focus.select("#crosshairX")
            .attr("x1", x)
            .attr("y1", yScale(yDomain[1]))
            .attr("x2", x)
            .attr("y2", yScale(yDomain[0]));
        // for each line there is a seperate horizontal crosshair
        focus.select("#crosshairY1")
            .attr("x1", xScale(xDomain[1]))
            .attr("y1", y1)
            .attr("x2", xScale(xDomain[0]))
            .attr("y2", y1);
        focus.select("#crosshairY2")
            .attr("x1", xScale(xDomain[1]))
            .attr("y1", y2)
            .attr("x2", xScale(xDomain[0]))
            .attr("y2", y2);
        focus.select("#crosshairY3")
            .attr("x1", xScale(xDomain[1]))
            .attr("y1", y3)
            .attr("x2", xScale(xDomain[0]))
            .attr("y2", y3);
        // pop-up text for each horizontal crosshair (each data-line)
        text1.attr("x", x)
            .attr("y", y1 - 5)
            .style("stroke", "orangered") 
            .text( formatTime(stockdata[i].date)+ "\n$" + stockdata[i].open);
        text2.attr("x", x)
            .attr("y", y2 - 5)
            .style("stroke", "green") 
            .text( formatTime(stockdata[i].date)+ "\n$" + stockdata2[i].open);
        text3.attr("x", x)
            .attr("y", y3 - 5)
            .style("stroke", "steelblue") 
            .text( formatTime(stockdata[i].date)+ "\n$" + stockdata3[i].open);
        
      });  
});
};

// change quarter when button clicked
function updateToQ1() {
    d3.select("svg").selectAll("*").remove();
    setDataForQ(1);
};
function updateToQ2() {
    d3.select("svg").selectAll("*").remove();
    setDataForQ(2);
};

// initiate site with graph of first quarter
setDataForQ(1);