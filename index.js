// const os = require('os')   
const fs = require('fs')

// const fileManagerBtn = document.getElementById('open-file-manager')

// fileManagerBtn.addEventListener('click', function (event) {
//   shell.showItemInFolder(os.homedir())
// })
const {dialog} = require('electron').remote;

const d3 = require("d3")
// const d4 = require("d4")
   
const fileManagerBtn = document.getElementById('open-file-manager')

fileManagerBtn.addEventListener('click', () => {
    dialog.showOpenDialog({properties: ['openFile']}, (filename) => {
        if (filename === undefined) return;
        fs.readFile(filename[0], 'utf-8', function (err, raw) {
            // let data = d3.csvParse(raw);
            
            var svg = d3.select("svg"),
                margin = {top: 20, right: 20, bottom: 30, left: 50},
                width = +svg.attr("width") - margin.left - margin.right,
                height = +svg.attr("height") - margin.top - margin.bottom,
                g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var parseTime = d3.timeParse("%d-%b-%y");

            var x = d3.scaleTime()
                .rangeRound([0, width]);

            var y = d3.scaleLinear()
                .rangeRound([height, 0]);

            var line = d3.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.close); });

            let data = d3.csvParse(raw, function(d) {
              d.date = parseTime(d.date);
              d.close = +d.close;
              return d;
            });
            
            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain(d3.extent(data, function(d) { return d.close; }));

            g.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x))
            .select(".domain")
              .remove();

            g.append("g")
              .call(d3.axisLeft(y))
            .append("text")
              .attr("fill", "#000")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "0.71em")
              .attr("text-anchor", "end")
              .text("Price ($)");

            g.append("path")
              .datum(data)
              .attr("fill", "none")
              .attr("stroke", "steelblue")
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
              .attr("stroke-width", 1.5)
              .attr("d", line);
        });
    })
})