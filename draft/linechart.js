// Stanley Kelder
// 10313540

// Opmerking: ik heb voor de assen twee aparte arrays gemaakt. Dit bleek nodig, omdat de
// data die anders gepakt werd (bijvoorbeeld door d3.extent(data, function(d) { return d.date; }))
// was de complete json set ipv alleen het deel van desbetreffende stock.

var drawGraph = function(ver, prod, color) {


    if(svg){svg.selectAll("*").remove();}

    // create area for graph
    var svg = d3.select("#line-chart"),
    margin = {top: 50, right: 50, bottom: 30, left: 50},
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
        return d.Congo.bier;
    }));

    // min and max of domains
    var xDomain = d3.extent(dates, function(d) {
        return d.date;
    });
    var yDomain = d3.extent(dates, function(d) {
        return d.Congo.bier;
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
        .text("Aantal producten");

    // title for graph
    g.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "35px") 
      .style("text-decoration", "")  
      .text("Drankconsumptie");

    // drawing of lines
    var drawline = function () {
        var line = d3.line()
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(eval("d." + ver + "." + prod)); });

        g.append("path")
        .datum(dates)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", color);
    }


    drawline();
    
    // create crosshairs
    var focus = g.append("g")
      .attr("class", "focus")
      .style("display", "none");

    // var bisectDate = d3.bisector(function(d) { return d.date; }).left;

    // // horizontal crosshair 
    // focus.append("line")
    //       .attr("id", "crosshairX");
    // vertical crosshairs    
    // focus.append("line")
    //       .attr("id", "crosshairY1");
    // focus.append("line")
    //       .attr("id", "crosshairY2");
    // focus.append("line")
    //       .attr("id", "crosshairY3");

    // // pop-up text of exact values
    // var text1 = g.append("text")
    // var text2 = g.append("text")
    // var text3 = g.append("text")
 
    // stocknames next to corresponding lines
    // var stock1 = g.append("text")
    // var stock2 = g.append("text")
    // var stock3 = g.append("text")   

    // stock1.attr("x", xScale(xDomain[1]) + 20)
    //     .attr("y", yScale(dates[dates.length - 1].Spectrum.fris) + 13)
    //     .style("stroke", "orangered") 
    //     .text("fris");    
    // stock2.attr("x", xScale(xDomain[1]) + 20)
    //     .attr("y", yScale(stockdata2[stockdata2.length - 1].open) + 13)
    //     .style("stroke", "green") 
    //     .text( stockdata2[stockdata2.length - 1].stock);    
    // stock3.attr("x", xScale(xDomain[1]) + 20)
    //     .attr("y", yScale(stockdata3[stockdata3.length - 1].open) + 13)
    //     .style("stroke", "steelblue") 
    //     .text( stockdata3[stockdata3.length - 1].stock);    
          
    // drawing of crosshairs and pop-up texts
    // g.append("rect")
    //   .attr("class", "overlay")
    //   .attr("width", width)
    //   .attr("height", height)
    //   .on("mouseover", function() {
    //     focus.style("display", null);
    //   })
    //   .on("mouseout", function() {
    //     focus.style("display", "none");
    //   })
    //   .on("mousemove", function() { 
    //     var mouse = d3.mouse(this);
    //     var mouseDate = xScale.invert(mouse[0]);
    //     var i = bisectDate(datatotal, mouseDate);
    //     var d = datatotal[i].date;
        
    //     var x = xScale(d);
    //     var y1 = yScale(datatotal[i].productsCount);
        // var y2 = yScale(stockdata2[i].open);
        // var y3 = yScale(stockdata3[i].open);
        
        // since data on x are the same only 1 vertical crosshair is needed
        // focus.select("#crosshairX")
        //     .attr("x1", x)
        //     .attr("y1", yScale(yDomain[1]))
        //     .attr("x2", x)
        //     .attr("y2", yScale(yDomain[0]));
        // // for each line there is a seperate horizontal crosshair
        // focus.select("#crosshairY1")
        //     .attr("x1", xScale(xDomain[1]))
        //     .attr("y1", y1)
        //     .attr("x2", xScale(xDomain[0]))
        //     .attr("y2", y1);
        // focus.select("#crosshairY2")
        //     .attr("x1", xScale(xDomain[1]))
        //     .attr("y1", y2)
        //     .attr("x2", xScale(xDomain[0]))
        //     .attr("y2", y2);
        // focus.select("#crosshairY3")
        //     .attr("x1", xScale(xDomain[1]))
        //     .attr("y1", y3)
        //     .attr("x2", xScale(xDomain[0]))
        //     .attr("y2", y3);
        // // pop-up text for each horizontal crosshair (each data-line)
        // text1.attr("x", x)
        //     .attr("y", y1 - 5)
        //     .style("stroke", "orangered") 
        //     .text( formatTime(stockdata[i].date)+ "\n$" + stockdata[i].open);
        // text2.attr("x", x)
        //     .attr("y", y2 - 5)
        //     .style("stroke", "green") 
        //     .text( formatTime(stockdata[i].date)+ "\n$" + stockdata2[i].open);
        // text3.attr("x", x)
        //     .attr("y", y3 - 5)
        //     .style("stroke", "steelblue") 
        //     .text( formatTime(stockdata[i].date)+ "\n$" + stockdata3[i].open);
 
};

var idToName = function(id) {
    if (id == "57cd872a3068d0401719d1a3") {
        var name = "Spectrum_bier";
        return name;
    } else if (id == "57cd87343068d0401719d1b3") {
        var name = "Spectrum_fris";
        return name;
    } else if (id == "57ed163cc17083e90b377702" || id == "57cd8db13068d0401719df2f" ) {
        var name = "Spectrum_speciaalbier";
        return name;
    } else if (id == "57cd874c3068d0401719d1c3" || id == "57fd049b72776cf1033b3578") {
        var name = "Spectrum_overig";
        return name;
    } else if (id == "57c2b4cb7672fa9201fa0aa9") {
        var name = "Congo_bier";
        return name;
    } else if (id == "57c2c8dc9bbbd25d75c124df") {
        var name = "Congo_fris";
        return name;
    } else if (id == "57c2b4f67672fa9201fa0ab6") {
        var name = "Congo_speciaalbier";
        return name;
    } else if (id == "57c2b5197672fa9201fa0ace") {
        var name = "Congo_overig";
        return name;
    };

    return id;
};

// // change quarter when button clicked
// function updateToQ1() {
//     d3.select("svg").selectAll("*").remove();
//     setDataForQ(1);
// };
// function updateToQ2() {
//     d3.select("svg").selectAll("*").remove();
//     setDataForQ(2);
// };

// // initiate site with graph of first quarter
// setDataForQ(1); 