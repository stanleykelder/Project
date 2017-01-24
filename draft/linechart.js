// Stanley Kelder
// 10313540

// Opmerking: ik heb voor de assen twee aparte arrays gemaakt. Dit bleek nodig, omdat de
// data die anders gepakt werd (bijvoorbeeld door d3.extent(data, function(d) { return d.date; }))
// was de complete json set ipv alleen het deel van desbetreffende stock.


// load json file
function setDataForQ(ButtonQ) {
var stockdata = [];
d3.json("payments.json", function(data) {
    
    // date formats
    var parseTime = d3.timeParse("%d/%m/%Y");
    var formatTime = d3.timeFormat("%d/%m");         

    // array to fill with data of correct form
    var dates = [];

    // filter out bad data
    var data = data.filter(function(d) {
        if (d.state.on.unix < 1477000800000 || d.state.on.unix > 1482537600000 || d.state.refunded || d.amount.positive) {
            return false
        } 
        return true
    })
    
    // map through original json, create new one in dates
    data.map(function(d){ 
        var date = parseTime(d.state.on.date).getTime();   
        var date_object = {};
        var date_exists = 0;

        // Make first date object
        if (dates.length == 0) {
            date_object["date"] = date;
            date_object["Spectrum"] = {datum: d.state.on.date, bier: 0, fris: 0, speciaalbier: 0, overig: 0, totaal: 0};
            date_object["Congo"] = {datum: d.state.on.date, bier: 0, fris: 0, speciaalbier: 0, overig: 0, totaal: 0};
            dates.push(date_object);
        }

        // Check if date is same as transaction and add products to object counts
        dates.map(function(element){
            if (element.date == date) {
                date_exists = 1;

                // Check for every product if it is one of the chosen
                d.products.map(function(product){
                    idProduct = product._id.$oid;
                    if (idProduct == "57cd872a3068d0401719d1a3") {
                        element.Spectrum.bier += 1;
                        element.Spectrum.totaal += 1;
                    } else if (idProduct == "57cd87343068d0401719d1b3") {
                        element.Spectrum.fris += 1;
                        element.Spectrum.totaal += 1;
                    } else if (idProduct == "57ed163cc17083e90b377702" || idProduct == "57ed163cc17083e90b377702") {
                        element.Spectrum.speciaalbier += 1;
                        element.Spectrum.totaal += 1;
                    } else if (idProduct == "57cd874c3068d0401719d1c3" || idProduct == "57fd049b72776cf1033b3578") {
                        element.Spectrum.overig += 1;
                        element.Spectrum.totaal += 1;
                    } else if (idProduct == "57c2b4cb7672fa9201fa0aa9") {
                        element.Congo.bier += 1;
                        element.Congo.totaal += 1;
                    } else if (idProduct == "57c2c8dc9bbbd25d75c124df") {
                        element.Congo.fris += 1;
                        element.Congo.totaal += 1;
                    } else if (idProduct == "57c2b4f67672fa9201fa0ab6") {
                        element.Congo.speciaalbier += 1;
                        element.Congo.totaal += 1;
                    } else if (idProduct == "57c2b5197672fa9201fa0ace") {
                        element.Congo.overig += 1;
                        element.Congo.totaal += 1;
                    }
                });
            }
        });
        if (date_exists == 0) {
            date_object["date"] = date;
            date_object["Spectrum"] = {datum: d.state.on.date, bier: 0, fris: 0, speciaalbier: 0, overig: 0, totaal: 0};
            date_object["Congo"] = {datum: d.state.on.date, bier: 0, fris: 0, speciaalbier: 0, overig: 0, totaal: 0};
            // Check for every product if it is one of the chosen
            d.products.map(function(product){
                idProduct = product._id.$oid;
                    if (idProduct == "57cd872a3068d0401719d1a3") {
                        date_object.Spectrum.bier += 1;
                        date_object.Spectrum.totaal += 1;
                    } else if (idProduct == "57cd87343068d0401719d1b3") {
                        date_object.Spectrum.fris += 1;
                        date_object.Spectrum.totaal += 1;
                    } else if (idProduct == "57ed163cc17083e90b377702" || idProduct == "57ed163cc17083e90b377702") {
                        date_object.Spectrum.speciaalbier += 1;
                        date_object.Spectrum.totaal += 1;
                    } else if (idProduct == "57cd874c3068d0401719d1c3" || idProduct == "57fd049b72776cf1033b3578") {
                        date_object.Spectrum.overig += 1;
                        date_object.Spectrum.totaal += 1;
                    } else if (idProduct == "57c2b4cb7672fa9201fa0aa9") {
                        date_object.Congo.bier += 1;
                        date_object.Congo.totaal += 1;
                    } else if (idProduct == "57c2c8dc9bbbd25d75c124df") {
                        date_object.Congo.fris += 1;
                        date_object.Congo.totaal += 1;
                    } else if (idProduct == "57c2b4f67672fa9201fa0ab6") {
                        date_object.Congo.speciaalbier += 1;
                        date_object.Congo.totaal += 1;
                    } else if (idProduct == "57c2b5197672fa9201fa0ace") {
                        date_object.Congo.overig += 1;
                        date_object.Congo.totaal += 1;
                    }
            });
            dates.push(date_object);
        }

    });
    function sortDate(data, prop, asc) {
        data = data.sort(function(a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        })
    }
    sortDate(dates, 'date', true)
    console.log(dates)
    
    // create area for graph
    var svg = d3.select("svg"),
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
    // var drawline = function drawLine(prod, color) {
    //     var line = d3.line()
    //     .x(function(d) { return xScale(d.date); })
    //     .y(function(d) { return yScale(d.products.prod); });

    //         g.append("path")
    //         .datum(dates)
    //         .attr("class", "line")
    //         .attr("d", line)
    //         .style("stroke", color);
    // }

    // drawline("fris", "orangered");
    // drawline("bier", "green");
    var line_Spectrumfris = d3.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.Spectrum.fris); });

    var line_Spectrumbier = d3.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.Spectrum.bier); });

    var line_Congobier = d3.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.Congo.bier); });

    var line_Congofris = d3.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.Congo.fris); });
    
    g.append("path")
        .datum(dates)
        .attr("class", "line")
        .attr("d", line_Spectrumfris)
        .style("stroke", "orangered");

    g.append("path")
        .datum(dates)
        .attr("class", "line")
        .attr("d", line_Spectrumbier)
        .style("stroke", "green");

    g.append("path")
        .datum(dates)
        .attr("class", "line")
        .attr("d", line_Congobier)
        .style("stroke", "steelblue");

    g.append("path")
        .datum(dates)
        .attr("class", "line")
        .attr("d", line_Congofris)
        .style("stroke", "yellow");

    // create crosshairs
    var focus = g.append("g")
      .attr("class", "focus")
      .style("display", "none");

    var bisectDate = d3.bisector(function(d) { return d.date; }).left;

    // horizontal crosshair 
    focus.append("line")
          .attr("id", "crosshairX");
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
    var stock1 = g.append("text")
    var stock2 = g.append("text")
    var stock3 = g.append("text")   

    stock1.attr("x", xScale(xDomain[1]) + 20)
        .attr("y", yScale(dates[dates.length - 1].Spectrum.fris) + 13)
        .style("stroke", "orangered") 
        .text("fris");    
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
        
      });  
// });
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