var drawBarchart = function(ver, prod, type) {

var weekday = d3.timeFormat("%A");

var svg = d3.select("#barchart"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong><span>" + d.value.max + "</span> </strong> ";
  });
svg.call(tip);

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var nestdata = dates.map(function(d) {
  return {day: weekday(d.date), amount: eval("d." + ver + "." + prod)};
});

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

  x.domain(nest.map(function(d) { return d.key; }));
  y.domain([0, d3.max(nest, function(d) { return eval("d.value." + type); })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("gooone");

  g.selectAll(".bar")
    .data(nest)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.key); })
      .attr("y", function(d) { return y(d.value.max); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value.max); })
      .sort()
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  d3.select('#dropdown')
    .on("change", function(){
      g.selectAll("*").remove();
      var newData = d3.select(this).property('value');
      newAxes(newData);
      newBars(newData);
    });

  var newBars = function(type) {
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
  
  var newAxes = function(type) {
    x.domain(nest.map(function(d) { return d.key; }));
    y.domain([0, d3.max(nest, function(d) { return eval("d.value." + type); })]);

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  
    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("gooone");
  }
};


