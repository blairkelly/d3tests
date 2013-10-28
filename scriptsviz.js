var g1 = null;
var g2 = null;

//d3.select("body").style("background-color", "#444");
//d3.select("body").transition().styleTween("background-color", function() { return d3.interpolate("green", "red"); });
//d3.select("body").transition().duration(5000).style("background-color", "#444");
d3.select("body").transition().duration(500).style("background-color", "#FFF").style("color", "#345");

/*var xAxis = d3.svg.axis()
    .scale(x)
    .tickValues([1, 2, 3, 5, 8, 13, 21]);

d3.select("body").append("svg")
    .attr("class", "axis")
    .attr("width", 1440)
    .attr("height", 30)
  .append("g")
    .attr("transform", "translate(0,30)");
    //.call(axis);*/


var thedata = [[1,2,3,4,5,6,7,8,9,10],[1,3,20,4,5,16,7,8,9,40], [50,5,10,14,2,-20,9,0,15,20]];

// define dimensions of graph
var m = [40, 40, 60, 80]; // margins
var w = 1000 - m[1] - m[3]; // width
var h = 400 - m[0] - m[2]; // height

// X scale will fit all values from data[] within pixels 0-w

console.log("w: " + w)

var x = d3.scale.linear().domain([1, (thedata[0].length - 0)]).range([0, w]);

var aomm = new Array(); //array of mins and maxs
for(var n=2; n<thedata.length; n++) {
	aomm.push(d3.min(thedata[n]));
	aomm.push(d3.max(thedata[n]));
}
var minimum = d3.min(aomm);
var maximum = d3.max(aomm);
console.log(minimum + " - " + maximum);

// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
var y = d3.scale.linear().domain([minimum, maximum]).range([h, 0]);
	// automatically determining max range can work something like this
	// var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

// create a line function that can convert data[] into x and y points
var line = d3.svg.line()
	.interpolate("linear")
	// assign the X function to plot our line as we wish
	.x(function(d,i) {
		i+=1;
		// verbose logging to show what's actually being done
		//console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
		// return the X coordinate where we want to plot this datapoint
		return x(i); 
	})
	.y(function(d) { 
		// verbose logging to show what's actually being done
		//console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
		// return the Y coordinate where we want to plot this datapoint
		return y(d); 
	})

// Add an SVG element with the desired dimensions and margin.
var graph = d3.select("#graph").append("svg:svg")
      .attr("width", w + m[1] + m[3])
      .attr("height", h + m[0] + m[2])
    .append("svg:g")
      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

// create xAxis
var xAxis = d3.svg.axis().scale(x).tickPadding(8).tickSize(-h);
// Add the x-axis.
graph.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis);


// create left yAxis
var yAxisLeft = d3.svg.axis().scale(y).ticks(10).orient("left");
// Add the y-axis to the left
var callagain = graph.append("svg:g")
      			.attr("class", "y axis")
      			.attr("transform", "translate(-25,0)")
      			.call(yAxisLeft);
	

/*setTimeout(function () {
	g1.transition().duration(1000).style('stroke', '#ff7f0e');
	g2.transition().duration(1000).style('stroke', '#2ca02c');
}, 100);*/

setTimeout(function () {
	//g1 = graph.append("svg:path").style('stroke', '#ff7f0e').style('stroke-width', '1.5').attr("d", line(thedata[1]));
	g2 = graph.append("svg:path").style('stroke', '#2ca02c').style('stroke-width', '1.5').attr("d", line(thedata[2]));
}, 3);

var doflip = function (a, b) {
	setTimeout(function () {
		g1.transition().duration(3000).attr("d", line(thedata[a]));
		g2.transition().duration(3000).attr("d", line(thedata[b]));
		doflip(b,a);
	}, 5000);
}
//doflip(2,1);

function redrawWithAnimation() {
	// update with animation
	graph.selectAll("path")
		.data([data]) // set the new data
		.attr("transform", "translate(" + x(1) + ")") // set the transform to the right by x(1) pixels (6 for the scale we've set) to hide the new value
		.attr("d", line) // apply the new data values ... but the new value is hidden at this point off the right of the canvas
		.transition() // start a transition to bring the new value into view
		.ease("linear")
		.duration(transitionDelay) // for this demo we want a continual slide so set this to the same as the setInterval amount below
		.attr("transform", "translate(" + x(0) + ")"); // animate a slide to the left back to x(0) pixels to reveal the new value
		
		/* thanks to 'barrym' for examples of transform: https://gist.github.com/1137131 */
}

var testtransform1 = function () {
	setTimeout(function () {
		thedata[2].push(50);
		console.log(thedata[2]);
		//g2.transition().duration(2500).attr("d", line(thedata[2]));
		g2.data([thedata[2]])
		.attr("transform", "translate(" + x(1) + ")")
		.attr("d", line)
		.transition()
		.ease("linear")
		.duration(500)
		.attr("transform", "translate(" + x(0) + ")")
		.each("end", function() {
			thedata[2].shift();
			console.log(thedata[2])
		});
	}, 1500);
}

setInterval(function () {
		var rn = Math.floor(Math.random() * 101) - 50;
		thedata[2].shift();
		thedata[2].push(rn);
		var newmin = d3.min(thedata[2]);
	    var newmax = d3.max(thedata[2]);
	    if(newmin < minimum) {
	    	minimum = newmin;
	    	console.log(minimum + " - " + maximum);
	    }
	    if(newmax > maximum) {
	    	maximum = newmax;
	    	console.log(minimum + " - " + maximum);
	    }
	    y = d3.scale.linear().domain([minimum, maximum]).range([h, 0]);
	    yAxisLeft = d3.svg.axis().scale(y).ticks(10).orient("left");
	    callagain.call(yAxisLeft);
	    //graph.call(yAxisLeft);
		//yAxisLeft = d3.svg.axis().scale(y).ticks(8).orient("left");
		var start = thedata[2].length - 10;
		var end = thedata[2].length;
		var na = thedata[2].slice(start, end);
		g2.attr("d", line(na));
}, 30);







