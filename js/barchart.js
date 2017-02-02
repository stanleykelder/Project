var drawBarchart = function(ver, prod, type) {

  // format unix time to day of week
  var weekday = d3.timeFormat("%A");

  var svg = d3.select("#barchart"),
      margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

  // create tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong><span>" + eval("d.value." + type) + "</span> </strong> ";
    });
  svg.call(tip);

  // scale axes
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

  // create dataset for barhart
  var nestdata = dates.map(function(d) {
    return {day: weekday(d.date), amount: eval("d." + ver + "." + prod)};
  });

  // use nest to get max, total and average value per product
  var nest = d3.nest()
    .key(function(d){ return d.day; })
    .rollup(function(v) { return {
      max: d3.max(v, function(d) { return d.amount; }),
      total: d3.sum(v, function(d) { return d.amount; }),
      avg: d3.mean(v, function(d) { return d.amount; })
    }; })
    .entries(nestdata)

  var g = svg.append("g")
   // format unix time to day of week
  var weekday = d3.timeFormat("%A");

  var svg = d3.select("#barchart"),
      margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

  // create tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong><span>" + eval("d.value." + type) + "</span> </strong> ";
    });
  svg.call(tip);

  // scale axes
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

  // create dataset for barhart
  var nestdata = dates.map(function(d) {
    return {day: weekday(d.date), amount: eval("d." + ver + "." + prod)};
  });

  // use nest to get max, total and average value per product
  var nest = d3.nest()
    .key(function(d){ return d.day; })
    .rollup(function(v) { return {
      max: d3.max(v, function(d) { return d.amount; }),
      total: d3.sum(v, function(d) { return d.amount; }),
      avg: d3.mean(v, function(d) { return d.amount; })
    }; })
    .entries(nestdata)

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // draw the axes
  var drawAxes = function(type) {
      x.domain(nest.map(function(d) { return d.key; }));
      y.domain([0, d3.max(nest, function(d) { return eval("d.value." + type); })]);

      g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    
      g.append("g")
          .attr("class", "y axis")
          .call(d3.axisLeft(y))
        .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .style("text-anchor", "end")
          .text("Aantal producten");
    }

  drawAxes(type);

  // draw the bars
  var drawBars = function(type) {
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong><span>" + eval("d.value." + type) + "</span> </strong> ";
      });
    svg.call(tip);

    g.selectAll(".bar")
    .data(nest)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.key); })
      .attr("y", function(d) { return y(eval("d.value." + type)); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(eval("d.value." + type)); })
      .sort()
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
  }   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // draw the axes
  var drawAxes = function(type) {
      x.domain(nest.map(function(d) { return d.key; }));
      y.domain([0, d3.max(nest, function(d) { return eval("d.value." + type); })]);

      g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    
      g.append("g")
          .attr("class", "y axis")
          .call(d3.axisLeft(y))
        .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .style("text-anchor", "end")
          .text("Aantal producten");
    }

  drawAxes(type);

  // draw the bars
  var drawBars = function(type) {
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong><span>" + eval("d.value." + type) + "</span> </strong> ";
      });
    svg.call(tip);

    g.selectAll(".bar")
    .data(nest)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.key); })
      .attr("y", function(d) { return y(eval("d.value." + type)); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(eval("d.value." + type)); })
      .sort()
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
  }

  drawBars(type);

  // change graph when dropdown changes
  d3.select('#dropdown')
    .on("change", function(){
      g.selectAll("*").remove();
      var newData = d3.select(this).property('value');
      drawAxes(newData);
      drawBars(newData);
    });
};


