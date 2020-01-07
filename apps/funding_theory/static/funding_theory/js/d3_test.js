var Margin = {top: 40, right: 20, bottom: 40, left: 150};
var InnerWidth = 432 - Margin.left - Margin.right;
var InnerHeight = 432 - Margin.top - Margin.bottom;

var svg = d3.select("#graph2").append("svg")
             .attr("preserveAspectRatio", "xMinYMin meet")
             .attr("viewBox", `0 0 ${InnerWidth + Margin.left + Margin.right} ${InnerHeight + Margin.top + Margin.bottom}`)
             .style("background","lightblue")
             .append("g");
             // .attr("transform", "translate(" + Margin.left + "," + Margin.top + ")");

svg.append('circle')
   .attr('cx',432/2)
   .attr('cy',432/2)
   .attr('r',10)
   .style('fill','red');

svg.append('rect')
   .attr('x',150)
   .attr('y',50)
   .attr('height',100)
   .attr('width',100)
   .style('clip-path', 'polygon(100% 0%, 100% 100%, 100% 100%, 25% 100%, 5% 70%,1% 60%, 0% 50%, 25% 0%)')
   // .attr('class','clipped')
   .style('stroke','black')
   .style('fill','none');

svg.append('circle')
   .attr('cx',200)
   .attr('cy',100)
   .attr('r',5)
   .style('fill','blue');
   
$('#rectangle').css({
	'transform-origin':'50% 50%',
	'transform-box':'border-box',
	'animation':'rotateBox 3s linear infinite',
});