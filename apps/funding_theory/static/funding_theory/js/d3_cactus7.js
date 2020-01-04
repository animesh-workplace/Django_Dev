var cactus_data = [
  {
    "pat": "RADS13",
    "gene": "CASP8",
    "ExonicFunc": "frameshift_deletion",
    "VAF": 0.179245283,
    "type": "tumor",
    "level": "common",
    "distance": 11
  },
  {
    "pat": "RADS13",
    "gene": "CASP8",
    "ExonicFunc": "frameshift_deletion",
    "VAF": 0.3655913978,
    "type": "LK",
    "level": "common",
    "distance": 11
  },
  {
    "pat": "RADS13",
    "gene": "FAT1",
    "ExonicFunc": "stopgain",
    "VAF": 0.2153846154,
    "type": "tumor",
    "level": "uniq",
    "distance": 11
  },
  {
    "pat": "RADS13",
    "gene": "FBXW7",
    "ExonicFunc": "nonsynonymous_SNV",
    "VAF": 0.2637362637,
    "type": "tumor",
    "level": "uniq",
    "distance": 11
  },
  {
    "pat": "RADS13",
    "gene": "NOTCH1",
    "ExonicFunc": "nonsynonymous_SNV",
    "VAF": 0.1818181818,
    "type": "LK",
    "level": "uniq",
    "distance": 11
  }
];

var cactus_meta = {
    "pat": "RADS13",
    "common": 33,
    "T_only": 9,
    "LK_only": 8,
    "Angular Distance": 11
  };

var color_set = [ '#CD212A', '#FFA500', '#0F4C81', '#55C6A9', '#4A5335', '#798EA4', '#FA7A35', '#00758F', '#EDD59E', '#E8A798', '#9B4722', '#6B5876', '#B89B72', '#282D3C', '#EDF1FE', '#A09998'];
var common_data = cactus_data.filter(d=>d.level==='common');
var uniq_tumor_data = cactus_data.filter(d=>d.level=='uniq' && d.type=='tumor');
var uniq_lk_data = cactus_data.filter(d=>d.level=='uniq' && d.type=='LK');
// This data for funding_theory has to be globally declared
var all_genes = ['ARID2','CASP8','CDKN2A','EPHA2','FAT1','FBXW7','HLA-B','HRAS','KMT2B','NOTCH1','PIK3CA','TGFBR2','TP53'];
var max = _.sum(_.map(cactus_data,d=>d.VAF));

var uniq_key = _.sortBy(_.uniq(_.map(cactus_data,d=>d.type)));
var common_data_stack = new Array();
var uniq_tumor_stack = new Array();
var uniq_lk_stack = new Array();

for(i=0;i<uniq_key.length;i++){
  common_data_stack[i] = _.map(common_data,d=>d.type===uniq_key[i]?({[d.gene]:d.VAF}):'').filter(String);
  common_data_stack[i] = _.assign(...common_data_stack[i]);

for(var j=0;j<all_genes.length;j++){
  if(typeof common_data_stack[i][all_genes[j]] === 'undefined'){
    common_data_stack[i][all_genes[j]]=0;
  }
}

}

  uniq_tumor_stack = _.assign(..._.map(uniq_tumor_data,d=>({[d.gene]:d.VAF})));
  uniq_lk_stack = _.assign(..._.map(uniq_lk_data,d=>({[d.gene]:d.VAF})));

  for(var j=0;j<all_genes.length;j++){
  if(typeof uniq_tumor_stack[all_genes[j]] === 'undefined'){
    uniq_tumor_stack[all_genes[j]]=0;
  }

  if(typeof uniq_lk_stack[all_genes[j]] === 'undefined'){
    uniq_lk_stack[all_genes[j]]=0;
  }
}



var Margin = {top: 40, right: 20, bottom: 40, left: 60};
var InnerWidth = 432 - Margin.left - Margin.right;
var InnerHeight = 432 - Margin.top - Margin.bottom;
var stack = d3.stack().keys(all_genes);

var common_d3_stack = stack(common_data_stack);
var uniq_tumor_d3_stack = stack([uniq_tumor_stack]);
var uniq_lk_d3_stack = stack([uniq_lk_stack]);
var common_plot_length_lk = new Array();
var common_plot_length_tumor = new Array();

var x_uniq = d3.scaleBand()
               .domain(_.concat(['hello','helloy'],uniq_key,['yello','hellou']))
               .rangeRound([0,InnerHeight]);

var y_uniq = d3.scaleLinear()
               .domain([0, max])
               .range([InnerWidth,0]);

var y_axis_uniq = d3.scaleLinear()
                    .domain([0, 6])
                    .rangeRound([0,InnerHeight]);

var svg = d3.select(`#graph_2`).append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `0 0 ${InnerWidth + Margin.left + Margin.right} ${InnerHeight + Margin.top + Margin.bottom}`)
            .style("background","lightblue")
            .append("g")
            .attr("transform", "translate(" + Margin.left + "," + Margin.top + ")");

var group1 = svg.append("g");

var common_plot = group1.selectAll("g").data(common_d3_stack)
                        .enter().append("g")
                        // .attr('transform-origin','center center')
                        // .attr('class',(d,i)=>`patient_name_common`)
                        .style("fill", (d,i)=>color_set[i]);

         common_plot.selectAll("rect").data(function(d){return d;})
                    .enter().append("rect")
                    .attr("height",function(d){return y_uniq(d[0]) - y_uniq(d[1]);})
                    .attr("x", function(d,i){return x_uniq(uniq_key[i]);})
                    .attr("y", function(d){return y_uniq(d[1]);})
                    .attr("width", y_axis_uniq(1))
                    // Replace the patient name with actual patient name
                    .attr("class", function(d,i,p) {return `patient_${all_genes[_.intersection(_.map(_.map(common_d3_stack,a=>a[i][1]),(a,b)=>a===d[1]?b:''),_.map(_.map(common_d3_stack,a=>a[i][0]),(a,b)=>a===d[0]?b:'')).filter(String)]}_${i}`});

for(i=0;i<all_genes.length;i++){
  common_plot_length_lk[i] = $(`.patient_${all_genes[i]}_0`).height();
  common_plot_length_tumor[i] = $(`.patient_${all_genes[i]}_1`).height();
}

var common_plot_height = _.ceil(_.max([_.sum(common_plot_length_lk),_.sum(common_plot_length_tumor)]));

// $('.patient_name_common').css('transform', `scaleX(-1) rotate(90deg) translate(${InnerWidth-common_plot_height}px, 0px)`);

var line1 = svg.append('line')
               .attr('x1',x_uniq(uniq_key[1]))
               .attr('y1',InnerHeight-common_plot_height)
               .attr('x2',x_uniq(uniq_key[1]))
               .attr('y2',200)
               .attr('stroke','green')
               .attr('stroke-width',2);

var line2 = svg.append('line')
               .attr('x1',x_uniq(uniq_key[1]))
               .attr('y1',200)
               .attr('x2',x_uniq(uniq_key[1]))
               .attr('y2',150)
               .attr('stroke','red')
               .attr('stroke-width',2)
// Replace the patient name with actual patient name
               .attr('id','patient_lk');

var group2 = svg.append("g");

var uniq_lk_plot = group2.selectAll("g").data(uniq_lk_d3_stack)
                         .enter().append("g")
                         .attr('class',(d,i)=>`patient_name_uniq_lk`)
                         .style("fill", (d,i)=>color_set[i]);

             uniq_lk_plot.selectAll("rect").data(function(d){return d;})
                         .enter().append("rect")
                         .attr("height",function(d){return y_uniq(d[0]) - y_uniq(d[1]);})
                         .attr("x", function(d,i){return x_uniq(uniq_key[0]);})
                         .attr("y", function(d){return y_uniq(d[1])-common_plot_height-45-50;})
                         .attr("width", y_axis_uniq(1))
                         // .attr('transform-origin','bottom center')
                         // .attr("transform-box", "fill-box")
                         // Replace the patient name with actual patient name
                         .attr("id", function(d,i) {return `patient_${all_genes[_.intersection(_.map(_.map(uniq_lk_d3_stack,a=>a[i][1]),(a,b)=>a===d[1]?b:''),_.map(_.map(uniq_lk_d3_stack,a=>a[i][0]),(a,b)=>a===d[0]?b:'')).filter(String)]}_${i}`});

// $('.patient_name_uniq_lk').css({
//   'transform-origin':'bottom center',
//   'transform-box':'fill-box',
//   'transform':'rotate(20deg)'
//   // 'transform':'translate(0px, -150px)',
//   // 'animation':'rotateBox 3s linear infinite',
// });

// $('.patient_name_uniq_lk').css({
//   'transform-box': 'fill-box',
//   'transform' : 'rotate(-30deg) translate(-88px,-150px)',  
// });

var line3 = svg.append('line')
               .attr('x1',x_uniq(uniq_key[1]))
               .attr('y1',200)
               .attr('x2',x_uniq(uniq_key[1]))
               .attr('y2',120)
               .attr('stroke','yellow')
               .attr('stroke-width',2)
// Replace the patient name with actual patient name
               .attr('id','patient_tumor');

var group3 = svg.append("g")
                .attr("id",'random_name')
                .style('transform-origin','bottom center')
                .style('transform-box','fill-box');
                // .style('transform','rotate(10deg)');

var uniq_tumor_plot = group3.selectAll("g").data(uniq_tumor_d3_stack)
                            .enter().append("g")
                            .attr('class',(d,i)=>`patient_name_uniq_tumor`)
                            .style("fill", (d,i)=>color_set[i]);

             uniq_tumor_plot.selectAll("rect").data(function(d){return d;})
                            .enter().append("rect")
                            .attr("height",function(d){return y_uniq(d[0]) - y_uniq(d[1]);})
                            .attr("x", function(d,i){return x_uniq(uniq_key[1])+24;})
                            .attr("y", function(d){return y_uniq(d[1])-common_plot_height-45-80;})
                            .attr("width", y_axis_uniq(1))
                         // .attr('transform-origin','bottom center')
                         // .attr("transform-box", "fill-box")
                         // Replace the patient name with actual patient name
                            .attr("id", function(d,i) {return `patient_${all_genes[_.intersection(_.map(_.map(uniq_tumor_d3_stack,a=>a[i][1]),(a,b)=>a===d[1]?b:''),_.map(_.map(uniq_tumor_d3_stack,a=>a[i][0]),(a,b)=>a===d[0]?b:'')).filter(String)]}_${i}`});

// $('.patient_name_uniq_tumor').css({
//   'transform-box': 'fill-box',
//   'transform' : 'rotate(30deg) translate(44px,-320px)',  
//   // 'transform' : 'rotate(30deg) translate(80px,-120px)',  
// });

// $('#random_name').css({
//   'transform-origin':'bottom center',
//   'transform-box':'fill-box',
//   // 'transform':'rotate(30deg)'
//   // 'transform':'translate(0px, -150px)',
//   // 'animation':'rotateBox 2s linear infinite',
// });

svg.append("g").attr('transform', `translate(0, ${InnerHeight})`)
                .style("font", "15px sans").call(d3.axisBottom(x_uniq)
                                                   .tickFormat(function(d,i){if(i==2||i==3){ return _.toUpper(d); }})
                                                );
svg.selectAll(".tick  line").attr("stroke", "rgba(0,0,0,0)");
// svg.selectAll(".tick:last-of-type line").attr("stroke", "rgba(0,0,0,0)");

// tilt(_.toLower(uniq_key[0]),cactus_meta['Angular Distance']/2);
// tilt(_.toLower(uniq_key[1]),-cactus_meta['Angular Distance']/2);

tilt(_.toLower(uniq_key[0]),30);
tilt(_.toLower(uniq_key[1]),-30);
function tilt(type, degree){
  $(`#patient_${type}`).css({
    'transform-origin':`${x_uniq(uniq_key[1])}px 200px`,
    'transform': `skewX(${degree}deg)`
  });
};