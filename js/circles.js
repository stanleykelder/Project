// Stanley Kelder
// 10313540

var drawCircles = function() {

  var svg = d3.select("#circles"),
    margin = 20,
    diameter = +svg.attr("width"),
    g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

  // set colors for circles
  var color = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

  // create tooltip
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong><span>" + d.data.name + "</span> </strong> ";
    });
  svg.call(tip);

  // variable to organize data
  var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);

  // load data
  d3.json("data/circle.json", function(error, root) {
    if (error) throw error;

    // nest data in correct form with values for cirle radius
    root = d3.hierarchy(root)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });

    // variable for check level of nesting
    var focus = root,
      nodes = pack(root).descendants(),
      view;

    // create and draw circles
    var circle = g.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
        .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
        .style("fill", function(d) { return d.children ? color(d.depth) : null; })
        // on click zoom to clicked circle and update line chart
        .on("click", function(d) { if (focus !== d) {zoom(d), d3.event.stopPropagation();} 
                                    updateLineChart(d)})
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    // Label the circles in next layer in view
    var text = g.selectAll("text")
      .data(nodes)
      .enter().append("text")
        .attr("class", "label")
        .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
        .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
        .text(function(d) { return d.data.name; });

    // variable node to know where to zoom to
    var node = g.selectAll("circle,text");

    // zoom on click
    svg
        .on("click", function() { zoom(root); });

    zoomTo([root.x, root.y, root.r * 2 + margin]);

    function zoom(d) {
      var focus0 = focus; focus = d;
      var transition = d3.transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .tween("zoom", function(d) {
            var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
            return function(t) { zoomTo(i(t)); };
          });
      transition.selectAll("text")
        .filter(function(d) { if(d){ return d.parent === focus || this.style.display === "inline"; }})
          .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
          .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  // determine where to zoom to
  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }

  // Change line chart
  function updateLineChart(d) {
    //  Variables to make the axes dynamic
    var checkmax = 0;
    var yDom;

    // check layer of circle clicked. Remove existing line chart and bar chart and make new ones.
    // always draw corresponding lines to layer of circle clicked 
    if (!d.parent) {
      // remove existing graphs to draw new ones
      d3.select("#line-chart").selectAll("*").remove();
      d3.select("#barchart").selectAll("*").remove();
      // go one layer deeper
      d.children.map(function(child) {
        // get name of Congo or Spectrum to now what data to use
        var ver = child.data.name;
          child.children.map(function(deepchild) {
            // another layer deeper and check if not Overig (the only one whithout another layer)
            if (deepchild.data.name != "Overig") {
              // deepest layer
              deepchild.children.map(function(baby) {
                // check for size of circle to know scale for y-axes line chart
                if (baby.data.size > checkmax) {
                  checkmax = baby.data.size;
                  yDom = ver + "." + baby.data.name.toLowerCase();
                }
                // get name of product to know what data to use
                var prod = baby.data.name.toLowerCase();
                // draw all lines in linechart
                drawLine(ver, prod, yDom);
              })
          }
          })
      })
      // draw axes for linechart with appropiate scale
      drawGraph(yDom);
    } else if (!d.parent.parent) {
      d3.select("#line-chart").selectAll("*").remove();
      d3.select("#barchart").selectAll("*").remove();
      var ver = d.data.name;
        d.children.map(function(child) {
          if(child.data.name != "Overig") {
            child.children.map(function(deepchild) {
              if (deepchild.data.size > checkmax) {
                    checkmax = deepchild.data.size;
                    yDom = ver + "." + deepchild.data.name.toLowerCase();
                  };
              var prod = deepchild.data.name.toLowerCase();
              drawLine(ver, prod, yDom);
            }) 
          } else {
              var prod = child.data.name.toLowerCase();
              drawLine(ver, prod, yDom);
            }
        })
      drawGraph(yDom);
    } else if (!d.parent.parent.parent) {
      d3.select("#line-chart").selectAll("*").remove();
      d3.select("#barchart").selectAll("*").remove();
      var ver = d.parent.data.name;
        if (d.data.name == "Overig") {
          prod = d.data.name.toLowerCase();
          yDom = ver + "." + prod;
          drawLine(ver, prod, yDom);
          drawGraph(yDom, prod);
          drawBarchart(ver, prod, d3.select('#dropdown').property('value'));
        };
        d.children.map(function(child) {
          if (child.data.size > checkmax) {
                    checkmax = child.data.size;
                    yDom = ver + "." + child.data.name.toLowerCase();
                  }
          prod = child.data.name.toLowerCase();
          drawLine(ver, prod, yDom);
        }); 
      drawGraph(yDom);
    } else if (!d.parent.parent.parent.parent) {
      d3.select("#line-chart").selectAll("*").remove();
      d3.select("#barchart").selectAll("*").remove();
      var ver = d.parent.parent.data.name;
      var prod = d.data.name.toLowerCase();
      yDom = ver + "." + prod;
      drawLine(ver, prod, yDom);
      drawGraph(yDom, prod);
      drawBarchart(ver, prod, d3.select('#dropdown').property('value'));
    }
  }
});

};