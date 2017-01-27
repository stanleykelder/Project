var drawCircles = function() {

  var svg = d3.select("#circles"),
    margin = 20,
    diameter = +svg.attr("width"),
    g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

var color = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);

  d3.json("flare.json", function(error, root) {
    if (error) throw error;

    console.log(root)

    root = d3.hierarchy(root)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });

    var focus = root,
      nodes = pack(root).descendants(),
      view;

    console.log(nodes)

    var circle = g.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
        .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
        .style("fill", function(d) { return d.children ? color(d.depth) : null; })
        .on("click", function(d) { if (focus !== d) {zoom(d), d3.event.stopPropagation();} 
                                    updateLineChart(d)})
        .on("mouseover", hovered(true))
        .on("mouseout", hovered(false));

    var text = g.selectAll("text")
      .data(nodes)
      .enter().append("text")
        .attr("class", "label")
        .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
        .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
        .text(function(d) { return d.data.name; });

    var node = g.selectAll("circle,text");

    svg
        .style("background", color(-1))
        .on("click", function() { zoom(root); });

    zoomTo([root.x, root.y, root.r * 2 + margin]);

    function zoom(d) {
      var focus0 = focus; focus = d;

      // console.log(focus, focus.parent)

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

  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }

  function hovered(hover) {
    return function(d) {
      // console.log(d)
      d3.selectAll(d.ancestors().map(function(d) { return d.node; })).classed("node--hover", hover);
    };
  };

  function updateLineChart(d) {
    if(!d.parent) {
      d3.select("#line-chart").selectAll("*").remove()
        d.children.map(function(child) {
          var ver = child.data.name;
            child.children.map(function(deepchild) {
              if(deepchild.data.name != "Overig") {
                deepchild.children.map(function(baby) {
                  var prod = baby.data.name.toLowerCase();
                  console.log("check:", ver, typeof(ver), prod, typeof(prod))
                  drawGraph(ver, prod, "green");
                })
            }
            })
        })
    } else if (!d.parent.parent) {
      d3.select("#line-chart").selectAll("*").remove()
      var ver = d.data.name;
        d.children.map(function(child) {
          if(child.data.name != "Overig") {
            child.children.map(function(deepchild) {
              prod = deepchild.data.name.toLowerCase();
              drawGraph(ver, prod, "green");
            })
          }
        })
    } else if (!d.parent.parent.parent) {
      d3.select("#line-chart").selectAll("*").remove()
      var ver = d.parent.data.name;
        d.children.map(function(child) {
          prod = child.data.name.toLowerCase();
          drawGraph(ver, prod, "green");
        })
    } else if (!d.parent.parent.parent.parent) {
      console.log("diep")
      d3.select("#line-chart").selectAll("*").remove()
      var ver = d.parent.parent.data.name;
      var prod = d.data.name.toLowerCase();
      drawGraph(ver, prod, "orangered");
    }
  }
});


};