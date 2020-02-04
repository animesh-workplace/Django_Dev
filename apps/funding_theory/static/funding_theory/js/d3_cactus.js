function cactus_plot(cactus_data, cactus_meta, all_genes, max_angle, min_angle, max_line, min_line, max_height, color_set)
	{// Function arguments will include the following:
		// cactus_data, cactus_meta, all_genes, max(angle, height(for  lines), min(height(for  lines))), 
	
	
		// All Function Definition
		function rotate_line(type, degree){
		  $(`#${patient_name}_${type}`).css({
		    'transform-origin':`${x_uniq(uniq_key[1])}px ${InnerHeight - common_plot_height - line_height_scale(cactus_meta.common)}px`,
		    'transform': `rotate(${degree}deg)`
		  });
		};
	
		function rotate_lk(degree){
		  $(`.${patient_name}_lk_plot`).css({
		    'transform-origin':`${x_uniq(uniq_key[1])}px ${InnerHeight - common_plot_height - line_height_scale(cactus_meta.common)}px`,
		    'transform': `rotate(${degree}deg)`
		  });
		};
	
		function rotate_tumor(degree){
		  $(`.${patient_name}_tumor_plot`).css({
		    'transform-origin':`${x_uniq(uniq_key[1])}px ${InnerHeight - common_plot_height - line_height_scale(cactus_meta.common)}px`,
		    'transform': `rotate(${degree}deg)`
		  });
		};

		function rotate_circle_lk(degree){
		  $(`#circle_lk_${patient_name}`).css({
		    'transform-origin':`${x_uniq(uniq_key[1])}px ${InnerHeight - common_plot_height - line_height_scale(cactus_meta.common)}px`,
		    'transform': `rotate(${degree}deg)`
		  });
		};

		function rotate_circle_tumor(degree){
		  $(`#circle_tumor_${patient_name}`).css({
		    'transform-origin':`${x_uniq(uniq_key[1])}px ${InnerHeight - common_plot_height - line_height_scale(cactus_meta.common)}px`,
		    'transform': `rotate(${degree}deg)`
		  });
		};

		function translate_circle_common(){
		  $(`#circle_common_${patient_name}`).css({
		    'transform-origin':`${x_uniq(uniq_key[1])}px ${InnerHeight - common_plot_height - line_height_scale(cactus_meta.common)}px`,
		    'transform': `translate(${x_uniq(uniq_key[1])}px, ${InnerHeight - common_plot_height}px)`
		  });
		};		
	
		// All Calculations ------------------------------------------=>
		var gene_name = _.uniq(_.map(cactus_data , d=>d.gene));
		// var new_gene_name = _.concat(gene_name, _.difference(all_genes, gene_name));
		var patient_name = cactus_meta.pat;
		var uniq_key = _.sortBy(_.uniq(_.map(cactus_data,d=>d.type)));
		if(uniq_key.length<2){
			uniq_key=='tumor'?uniq_key.push('LK'):uniq_key.push('tumor');
			uniq_key=='tumor'?uniq_key.push('LK'):uniq_key.push('tumor');
			uniq_key = _.sortBy(_.uniq(uniq_key));
		}
			// Separating the data based on the level
		var common_data = cactus_data.filter(d=>d.level==='common');
		var uniq_tumor_data = cactus_data.filter(d=>d.level=='uniq' && d.type=='tumor');
		var uniq_lk_data = cactus_data.filter(d=>d.level=='uniq' && d.type=='LK');

			// Collecting gene names for each section and arranging based on graph rules:
				// Common gene section are ordered descending VAF value
				// Tumor gene section are ordered ascending VAF values
				// LK genes section are ordered ascending VAF values
		var common_gene_name = _.uniq(_.map(_.orderBy(common_data,'VAF','desc'), d=>d.gene));
		var tumor_gene_name = _.uniq(_.map(_.orderBy(uniq_tumor_data,'VAF','asc'), d=>d.gene));
		var lk_gene_name = _.uniq(_.map(_.orderBy(uniq_lk_data,'VAF','asc'), d=>d.gene));
			// Making Gene List for stacking
		common_gene_name = _.concat(common_gene_name, _.difference(all_genes, common_gene_name));
		tumor_gene_name = _.concat(tumor_gene_name, _.difference(all_genes, tumor_gene_name));
		lk_gene_name = _.concat(lk_gene_name, _.difference(all_genes, lk_gene_name));
	
		var common_data_stack = new Array();
		var uniq_tumor_stack = new Array();
		var uniq_lk_stack = new Array();
		var common_plot_length_lk = new Array();
		var common_plot_length_tumor = new Array();
		var common_plot_breadth_lk = new Array();
		var common_plot_breadth_tumor = new Array();		
			// This section is to conform the data so that it can be stacked
			// There is stacking done for common, tumor, lk plots that are going to be formed
		for(i=0;i<uniq_key.length;i++){
		  common_data_stack[i] = _.map(common_data,d=>d.type===uniq_key[i]?({[d.gene]:d.VAF}):'').filter(String);
		  common_data_stack[i] = _.assign(...common_data_stack[i]);
	
		for(var j=0;j<common_gene_name.length;j++){
		  if(typeof common_data_stack[i][common_gene_name[j]] === 'undefined'){
		    common_data_stack[i][common_gene_name[j]]=0;
		  }
		}
	
		}
	
		uniq_tumor_stack = _.assign(..._.map(uniq_tumor_data,d=>({[d.gene]:d.VAF})));
		uniq_lk_stack = _.assign(..._.map(uniq_lk_data,d=>({[d.gene]:d.VAF})));
	
		for(var j=0;j<tumor_gene_name.length;j++){
		  if(typeof uniq_tumor_stack[tumor_gene_name[j]] === 'undefined'){
		    uniq_tumor_stack[tumor_gene_name[j]]=0;
		  }
	
		  if(typeof uniq_lk_stack[lk_gene_name[j]] === 'undefined'){
		    uniq_lk_stack[lk_gene_name[j]]=0;
		  }
		}
	
		// Main graph making section
		var Margin = {top: 40, right: 20, bottom: 40, left: 60};
		var InnerWidth = 432 - Margin.left - Margin.right;
		var InnerHeight = 432 - Margin.top - Margin.bottom;
		var stack_common = d3.stack().keys(common_gene_name);
		var stack_tumor = d3.stack().keys(tumor_gene_name);
		var stack_lk = d3.stack().keys(lk_gene_name);
			// All Stacking here
		var common_d3_stack = stack_common(common_data_stack);
		var uniq_tumor_d3_stack = stack_tumor([uniq_tumor_stack]);
		var uniq_lk_d3_stack = stack_lk([uniq_lk_stack]);
		// console.log(common_d3_stack, uniq_tumor_d3_stack, uniq_lk_d3_stack);
	
		var x_uniq = d3.scaleBand()
		               .domain(_.concat(['random_1','random_2'],uniq_key,['random_3','random_4']))
		               .rangeRound([0,InnerWidth]);
	
		var y_uniq = d3.scaleLinear()
		               .domain([0, max_height])
		               .range([InnerHeight,0]);
	
		var y_axis_uniq = d3.scaleLinear()
		                    .domain([0, 6 + 0.3])
		                    .rangeRound([0,InnerHeight]);
	
		var angle_scale = d3.scaleLinear()
		               		.domain([min_angle, max_angle])
		               		.range([40, 180]);
	
		var line_height_scale = d3.scaleLinear()
								  .domain([min_line, max_line])
								  .range([30,150]);
	
	
		var svg = d3.select(`#patient_${patient_name}`).append("svg")
		            .attr("preserveAspectRatio", "xMinYMin meet")
		            .attr("viewBox", `0 0 ${InnerWidth + Margin.left + Margin.right} ${InnerHeight + Margin.top + Margin.bottom}`)
		            .attr('id',`svg_download_${patient_name}`)
		            .append("g")
		            .attr("transform", "translate(" + Margin.left + "," + Margin.top + ")");

		var group1 = svg.append("g")
						.attr("class", "common_plot");
			
		var common_plot = group1.selectAll("g").data(common_d3_stack)
		                        .enter().append("g")
		                        .style("fill", (d,i)=>color_set[`${common_gene_name[i]}`]);
	
			         common_plot.selectAll("rect").data(function(d){return d;})
			                    .enter().append("rect")
			                    .attr("height",function(d){return y_uniq(d[0]) - y_uniq(d[1]);})
			                    .attr("x", function(d,i){return x_uniq(uniq_key[i]);})
			                    .attr("y", function(d){return y_uniq(d[1]);})
			                    .attr("width", y_axis_uniq(1))			                    
			                    .attr("class", function(d,i) {return `${patient_name}_${all_genes[_.intersection(_.map(_.map(common_d3_stack,a=>a[i][1]),(a,b)=>a===d[1]?b:''),_.map(_.map(common_d3_stack,a=>a[i][0]),(a,b)=>a===d[0]?b:'')).filter(String)]}_${i}`});
	
		for(i=0;i<all_genes.length;i++){
		  common_plot_length_lk[i] = $(`.${patient_name}_${all_genes[i]}_0`).height();
		  common_plot_length_tumor[i] = $(`.${patient_name}_${all_genes[i]}_1`).height();
		  common_plot_length_lk[i] = common_plot_length_lk[i]===undefined?0:common_plot_length_lk[i];
		  common_plot_length_tumor[i] = common_plot_length_tumor[i]===undefined?0:common_plot_length_tumor[i];		  
		}

		var common_plot_height = _.ceil(_.max([_.sum(common_plot_length_lk),_.sum(common_plot_length_tumor)]));
		var common_plot_width = _.sum([y_axis_uniq(1), y_axis_uniq(1)]);

		if(common_plot_height>0){
			var outer_rectangle = svg.append('rect')
									 .attr('x', x_uniq(uniq_key[0]))
									 .attr('y', y_uniq(0) - common_plot_height)
									 .attr('height', common_plot_height)
									 .attr('width', common_plot_width + 2)
									 .attr('stroke', 'black')
									 .attr('fill', 'none')
									 .attr('stroke-width', 1.3);		
		}
	
		var line_common = svg.append('line')
		               		 .attr('x1',x_uniq(uniq_key[1]))
		               		 .attr('y1',InnerHeight - common_plot_height)
		               		 .attr('x2',x_uniq(uniq_key[1]))
		               		 .attr('y2',InnerHeight - common_plot_height - line_height_scale(cactus_meta.common))
		               		 .attr('stroke','#FFea00')
		               		 .attr('stroke-width',4);

		var arc = d3.arc();
		var circle_common = svg.append('path')
						       .attr('d', arc({
						      		 innerRadius: 0,
						      		 outerRadius: 2.5,
						      		 startAngle: -Math.PI*0.5,
						      		 endAngle: Math.PI*0.5
						    	 }))
						       .attr('id',`circle_common_${patient_name}`)               		   
		               		   .attr('fill','black');

		var line_lk = svg.append('line')
		               	 .attr('x1',x_uniq(uniq_key[1]))
		               	 .attr('y1',InnerHeight - common_plot_height - line_height_scale(cactus_meta.common))
		               	 .attr('x2',x_uniq(uniq_key[1]))
		               	 .attr('y2',InnerHeight - common_plot_height - line_height_scale(cactus_meta.common) - line_height_scale(cactus_meta.only_lk))
		               	 .attr('stroke','#A4E804')
		               	 .attr('stroke-width',4)
		               	 .attr('id',`${patient_name}_lk`);

		var circle_lk = svg.append('circle')
		               	   .attr('cx',x_uniq(uniq_key[1]))
		               	   .attr('cy',InnerHeight - common_plot_height - line_height_scale(cactus_meta.common) - line_height_scale(cactus_meta.only_lk))
		               	   .attr('r',2.5)
		               	   .attr('id',`circle_lk_${patient_name}`)
		               	   .attr('fill','black');	               	 
	
		var line_tumor = svg.append('line')
		               	 	.attr('x1',x_uniq(uniq_key[1]))
		               	 	.attr('y1',InnerHeight - common_plot_height - line_height_scale(cactus_meta.common))
		               	 	.attr('x2',x_uniq(uniq_key[1]))
		               	 	.attr('y2',InnerHeight - common_plot_height - line_height_scale(cactus_meta.common) - line_height_scale(cactus_meta.only_tumor))
		               	 	.attr('stroke','#F277C6')
		               	 	.attr('stroke-width',4)
		               	 	.attr('id',`${patient_name}_tumor`);

		var circle_common_center = svg.append('circle')
		               		    	  .attr('cx',x_uniq(uniq_key[1]))
		               		    	  .attr('cy',InnerHeight - common_plot_height - line_height_scale(cactus_meta.common))
		               		    	  .attr('r',1.2)
		               		    	  .attr('stroke','black')
		               		    	  .attr('stroke-width',4);		               	 	

		var circle_tumor = svg.append('circle')
		               		  .attr('cx',x_uniq(uniq_key[1]))
		               		  .attr('cy',InnerHeight - common_plot_height - line_height_scale(cactus_meta.common) - line_height_scale(cactus_meta.only_tumor))
		               		  .attr('r',2.5)
		               		  .attr('id',`circle_tumor_${patient_name}`)
		               		  .attr('fill','black');

	
		var group2 = svg.append("g")
		                .attr("class",`${patient_name}_lk_plot`);
	
		var uniq_lk_plot = group2.selectAll("g").data(uniq_lk_d3_stack)
		                         .enter().append("g")
		                         .style("fill", (d,i)=>color_set[`${lk_gene_name[i]}`]);
	
		             uniq_lk_plot.selectAll("rect").data(function(d){return d;})
		                         .enter().append("rect")
		                         .attr("height",function(d){return y_uniq(d[0]) - y_uniq(d[1]);})
		                         .attr("x", function(d,i){return x_uniq(uniq_key[0]) + (y_axis_uniq(1)/2);})
		                         .attr("y", function(d){return y_uniq(d[1]) - common_plot_height - line_height_scale(cactus_meta.common) - line_height_scale(cactus_meta.only_lk);})
		                         .attr("width", y_axis_uniq(1));
	
		var group3 = svg.append("g")
		                .attr("class",`${patient_name}_tumor_plot`);
	
		var uniq_tumor_plot = group3.selectAll("g").data(uniq_tumor_d3_stack)
		                            .enter().append("g")
		                            .style("fill", (d,i)=>color_set[`${tumor_gene_name[i]}`]);
	
		             uniq_tumor_plot.selectAll("rect").data(function(d){return d;})
		                            .enter().append("rect")
		                            .attr("height",function(d){return y_uniq(d[0]) - y_uniq(d[1]);})
		                            .attr("x", function(d,i){return x_uniq(uniq_key[1]) - (y_axis_uniq(1)/2);})
		                            .attr("y", function(d){return y_uniq(d[1]) - common_plot_height - line_height_scale(cactus_meta.common) - line_height_scale(cactus_meta.only_tumor);})	                            
		                            .attr("width", y_axis_uniq(1));
	
		svg.append("g").attr('transform', `translate(0, ${InnerHeight})`)
		                .style("font", "15px sans").call(d3.axisBottom(x_uniq)
		                                                   .tickFormat(function(d,i){if(i==2||i==3){ return _.toUpper(d); }}));

		svg.selectAll(`#patient_${patient_name} .tick  line`).attr("stroke", (d,i)=>(i==2||i==3)?"rgba(0,0,0,1)":"rgba(0,0,0,0)");      
	
		var rotation_angle = angle_scale(cactus_meta.angle)/2;
			rotate_line(_.toLower(uniq_key[0]),-rotation_angle);
			rotate_line(_.toLower(uniq_key[1]),rotation_angle);
			rotate_lk(-rotation_angle);
			rotate_tumor(rotation_angle);
			rotate_circle_lk(-rotation_angle);
			rotate_circle_tumor(rotation_angle);
			translate_circle_common();
}

