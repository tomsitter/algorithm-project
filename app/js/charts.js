// Reusable d3 charts

const d3 = require('d3')

function barChart() {
    let margin = {top: 20, right: 20, bottom: 70, left: 70},
        barPadding = 1,
        fillColor = 'steelblue';

    let width = 360 - margin.left - margin.right,
        height = 360 - margin.top - margin.bottom;
        
    function my(selection) {
        selection.each(function(data) {
            var barSpacing = width / data.length,
                barWidth = barSpacing - barPadding,
                maxValue = 100,
                widthScale = width / maxValue;
            
            var svg = d3.select(this).append('svg')
                        .attr('height', height + margin.top + margin.bottom)
                        .attr('width', width + margin.left + margin.right)
                        .append("g")
                            .attr("transform",
                                  `translate(${margin.left}, ${margin.top})`);

            let yScale = d3.scaleLinear()
                                 .range([height, 0])
                                 .domain([0, 100])
            let xScale = d3.scaleBand()
                                .rangeRound([0, width])
                                .domain(results.map((d) => { return d.desc }))

            svg.selectAll('rect')
                .data(data)
                    .enter()
                .append('rect')
                .attr('y', function(d) { return yScale(d.results.passed / (d.results.passed + d.results.failed) * 100) })
                .attr('width', barWidth)
                .attr('x', function(d, i) { return i * barSpacing})
                .attr('height', function(d) { return height - yScale(d.results.passed / (d.results.passed + d.results.failed) * 100) })
                .style('fill', fillColor)

            // X Axis
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(xScale))
                .selectAll(".tick text")
                .call(wrap, margin.left)
            
            svg.append("text")
                .attr("transform", `translate(${width/2}, ${height + margin.bottom})`)
                .style("text-anchor", "middle")
                .text("Indicator")

            // Y Axis
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", 0 - (height / 2))
                .attr("y", 0 - margin.left)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Percent")

            svg.append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(yScale))
        });
    }
    
    my.width = function(value) {
        if (!arguments.length) return width;
        width = value
        return my
    };
    
    my.height = function(value) {
        if (!arguments.length) return height;
        height = value
        return my
    }
    
    my.barPadding = function(value) {
        if (!arguments.length) return barPadding;
        barPadding = value
        return my
    };
 
    my.fillColor = function(value) {
        if (!arguments.length) return fillColor;
        fillColor = value
        return my
    };
    
    return my
}

module.exports = {
    'barChart': barChart
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
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