// Reusable d3 charts

const d3 = require('d3')

function barChart() {
    let width = 360,
        height = 360,
        barPadding = 1,
        fillColor = 'steelblue';
        
    function my(selection) {
        selection.each(function(data) {
            var barSpacing = height / data.length,
                barHeight = barSpacing - barPadding,
                maxValue = 100,
                widthScale = width / maxValue;
            
            d3.select(this).append('svg')
                .attr('height', height)
                .attr('width', width)
                .selectAll('rect')
                .data(data)
                    .enter()
                .append('rect')
                .attr('y', function(d, i) { return i * barSpacing})
                .attr('height', barHeight)
                .attr('x', 0)
                .attr('width', function(d) { return d.results.passed / (d.results.passed + d.results.failed) * 100 * widthScale })
                .style('fill', fillColor);
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