cactus_data = [
  {
    "pat": "p1",
    "type": "tumor",
    "level": "common",
    "gene": "CASP8",
    "VAF": 0.3
  },
  {
    "pat": "p1",
    "type": "LK",
    "level": "common",
    "gene": "CASP8",
    "VAF": 0.1
  },
  {
    "pat": "p1",
    "type": "tumor",
    "level": "uniq",
    "gene": "TP53",
    "VAF": 0.2
  },
  {
    "pat": "p1",
    "type": "LK",
    "level": "uniq",
    "gene": "NOTCH1",
    "VAF": 0.4
  },
  {
    "pat": "p1",
    "type": "tumor",
    "level": "uniq",
    "gene": "KMT2B",
    "VAF": 0.25
  },
  {
    "pat": "p1",
    "type": "LK",
    "level": "uniq",
    "gene": "KMT1B",
    "VAF": 0.32
  },
  {
    "pat": "p1",
    "type": "LK",
    "level": "uniq",
    "gene": "TP53BP1",
    "VAF": 0.2
  },
  {
    "pat": "p1",
    "type": "tumor",
    "level": "common",
    "gene": "HRAS",
    "VAF": 0.25
  },
  {
    "pat": "p1",
    "type": "LK",
    "level": "common",
    "gene": "HRAS",
    "VAF": 0.16
  }
]

// console.log(cactus_data);
var symbol = ['▲','■'];
var uniq_key = _.uniq(_.map(cactus_data,d=>d.type));
// var common = _.map(_.map(cactus_data,(d,i)=>d.level==='common'?i:'').filter(String),d=>cactus_data[d]);
var unique = _.map(_.map(cactus_data,(d,i)=>d.level==='uniq'?i:'').filter(String),d=>cactus_data[d]);
var uniq_gene = _.map(unique,d=>d.gene);
// var common_genes = _.uniq(_.map(common,d=>d.gene));
var all_genes = _.uniq(_.map(_.orderBy(cactus_data,'level','asc'),d=>d.gene));
var values = new Array();

for(i=0;i<uniq_key.length;i++){
	values[i] = _.map(cactus_data,d=>d.type===uniq_key[i]?({[d.gene]:d.VAF}):'').filter(String);
	values[i] = _.assign(...values[i]);

for(var j=0;j<all_genes.length;j++){
  if(typeof values[i][all_genes[j]] === 'undefined'){
    values[i][all_genes[j]]=0;
  }
}

}

var Margin = {top: 40, right: 20, bottom: 40, left: 60};
var InnerWidth = 432 - Margin.left - Margin.right;
var InnerHeight = 432 - Margin.top - Margin.bottom;
var stack = d3.stack().keys(all_genes);

var x = d3.scaleLinear()
          .domain([0, 1])
          .range([0,InnerWidth-70]);
var scale = d3.scaleLinear()
              .domain([0, 1])
              .range([0,5]);

var x_axis = d3.scaleLinear()
               .domain([0, d3.max(_.map(cactus_data,d=>d.VAF))])
               .range([0,InnerWidth]);

var y = d3.scaleLinear()
               .domain([0, 4.3])
               .rangeRound([0,InnerHeight]);

var y_axis = d3.scaleBand()
          	   .domain(_.concat(['hello'],uniq_key,['yello']))
          	   .rangeRound([0,InnerHeight]);
          	   // .padding(0.1);


var svg9 = d3.select("#tester100").append("svg")
             .attr("preserveAspectRatio", "xMinYMin meet")
             .attr("viewBox", `0 0 ${InnerWidth + Margin.left + Margin.right} ${InnerHeight + Margin.top + Margin.bottom}`)
             .style("background","lightblue")
             .append("g")
             .attr("transform", "translate(" + Margin.left + "," + Margin.top + ")");

var zz1 = stack(values);

var series = svg9.selectAll("g").data(stack(values))
                        .enter().append("g")
                        .attr('transform',`translate(0, ${InnerWidth}) rotate(-90)`)
                        .style("fill", (d,i)=>d3.schemeSet3[i]);

        series.selectAll("rect").data(function(d){return d;})
                .enter().append("rect")
                .attr("height",y(1))
                .attr("x", function(d,i,p){console.log(d,i,p); return x(d[0]);})
                .attr("y", function(d,i){return y_axis(uniq_key[i]);})
                .attr("width", 0)
                // .attr('rx',5)
                // .attr('ry',5)
                // .style('stroke', 'black')
                // .style('stroke-width',d=>`${scale(d[1])}px`)
                .transition().delay(100)
                .duration(1000)
                .ease(d3.easeCubic)
                .attr("transform", function(d,i){return i==0?(_.isEmpty(_.map(uniq_gene,dz=>dz===(all_genes[_.intersection(_.map(_.map(zz1,a=>a[i][1]),(a,b)=>a===d[1]?b:''),_.map(_.map(zz1,a=>a[i][0]),(a,b)=>a===d[0]?b:'')).filter(String)])?'xx':'').filter(String))?'skewX(0)':' translate(0 38) skewY(-17) scale(1,1)'):(_.isEmpty(_.map(uniq_gene,dz=>dz===(all_genes[_.intersection(_.map(_.map(zz1,a=>a[i][1]),(a,b)=>a===d[1]?b:''),_.map(_.map(zz1,a=>a[i][0]),(a,b)=>a===d[0]?b:'')).filter(String)])?'xx':'').filter(String))?'skewY(0)':'skewY(14) translate(0 -38) scale(1,1)');})
                //.attr("transform-box", "border-box")
                // .attr("transform-origin","bottom center")
                .attr("transform-origin",function(d,i){return i==0?"30px 100px":"-80px 250px"})
                // .attr("transform","skewX(17)")
                .attr("width", function(d){return x(d[1]) - x(d[0]);});
                
                series.selectAll("text").data(function(d){return d;})
                      .enter()
                      .append('text')
                      .style('fill','black')
                      .style('font-size','25')
                      .attr('x',function(d){return (x(d[0])+x(d[1]))/2;})
                      .attr('y',function(d,i){return y_axis(uniq_key[i])+y(1)/2;})
                      .transition().delay(100)
                      .duration(1000)
                      .ease(d3.easeCubic)                      
                      .attr("transform", function(d,i){return i==0?(_.isEmpty(_.map(uniq_gene,dz=>dz===(all_genes[_.intersection(_.map(_.map(zz1,a=>a[i][1]),(a,b)=>a===d[1]?b:''),_.map(_.map(zz1,a=>a[i][0]),(a,b)=>a===d[0]?b:'')).filter(String)])?'xx':'').filter(String))?'skewX(0)':' translate(0 38) skewY(-17) scale(1,1)'):(_.isEmpty(_.map(uniq_gene,dz=>dz===(all_genes[_.intersection(_.map(_.map(zz1,a=>a[i][1]),(a,b)=>a===d[1]?b:''),_.map(_.map(zz1,a=>a[i][0]),(a,b)=>a===d[0]?b:'')).filter(String)])?'xx':'').filter(String))?'skewY(0)':'skewY(14) translate(0 -38) scale(1,1)');})
                      .attr("transform-origin",function(d,i){return i==0?"30px 100px":"-80px 250px"})
                      .text(function(d,i){return (x(d[1]) - x(d[0]))==0?'':symbol[i];});
