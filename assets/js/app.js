// Define SVG area dimensions
var svgWidth = 900;
var svgHeight = 700;

// Define the chart's margins as an object
var margin = {
  top:10,
  right: 50,
  bottom:50,
  left: 80
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from csv
d3.csv("data.csv")
  .then(function(healthData) {

  // Parse Data/Cast as numbers
    healthData.forEach(function(data) {
      data.state = +data.state;
    });

  //setup X
  var xLinearScale = d3.scaleLinear()
  .domain([20, d3.max(healthData, d => d.poverty)])
  .range([0, width]);

//setup y
var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.obesity)])
      .range([height,200]);

  // Create axis functions // 
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

  // Append Axes to the chart  // 
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

//Create Circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(healthData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.obesity))

  .attr("r", "12")
  .attr("fill", "pink")
  .attr("opacity", ".75");

 //Initialize tool tip
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([20, 0])
    .html(function(data) {
        return (`${data.abbr}`);
      });

    // Create tooltip in the chart
   
   chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
     circlesGroup.on("click", function(data) {
     toolTip.show(data, this);
    })
     //mouseout event
        .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });
  

   // Create axes labels
  chartGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left + 30)
   .attr("x", 0 - (height / 1.5))
   .attr("dy", "1em")
   .attr("class", "axisText")
   .text("Poverty")
    });

   chartGroup.append("text")
      .attr("transform", `translate(${width / 1.5}, ${height + margin.bottom -5})`)
      .attr("class", "axisText")
      .text("obesity");

      
    



