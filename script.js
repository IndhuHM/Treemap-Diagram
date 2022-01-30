 d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json', function(el){
  var dataset= el;
  Drawmap(dataset);
})


function Drawmap(dataset){
const w= 960;
  const h=600;
 

  const colorScale = d3.scaleOrdinal(["lightgreen","pink","skyblue","grey"]);
  
 const svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);
  
   var tooltip = d3.select("body")
                  .append("div")
                  .attr("class", "tooltip")
                  .attr("id", "tooltip")
                  .style("opacity", 100)

 const treemap=d3.treemap()
                 .size([w,h])
                 .padding(1)

 const root=d3.hierarchy(dataset)
              .sum(d=> d.value);
 
 treemap(root);
  
  
  const cell=svg.selectAll("rect")
     .data(root.leaves())
     .enter().append("g")
   .attr('transform', d => `translate(${d.x0}, ${d.y0})`);
  
  
  
     const tile =cell.append("rect")
       .attr("width", d => d.x1 - d.x0)
       .attr("height", d => d.y1 - d.y0)
  .attr("fill", (d) => {
        return colorScale(d.data.category);
      })
  .attr("data-name",(d)=>d.data.name)
  .attr("data-category",(d)=>d.data.category)
  .attr("data-value",(d)=>d.data.value)
  .attr("class","tile")
    .on("mouseover",function(d){
    tooltip.transition()
           .duration(200)
           .style("opacity", 0.9);
     tooltip.html("Name: "+ d.data.name+ "Category: " + d.data.category + "," + " Value: "+ d.data.value)
   tooltip.attr("data-value", d.data.value)
  })
   .on("mouseout", function(d){
        tooltip.transition()
               .duration(50)
               .style("opacity", 0);
      });
 
  cell.append('text')
   .selectAll('tspan')
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter().append('tspan')
    .attr('x', 4)
    .attr('y', (d, i) => 15 + i * 15)
    .text(d => d)
   
    const categories = root.leaves().map(n => n.data.category).filter((item, idx, arr) => arr.indexOf(item) === idx);

 
  
  const legend = d3.select('body')
    .append('svg')
    .attr('id', 'legend')
    .attr('width', 200)
    .attr('height', (20 + 2) * categories.length)
   
  legend.selectAll('rect')
    .data(categories)
    .enter()
    .append('rect')
    .attr('class', 'legend-item')
    .attr('fill', d => colorScale(d))
    .attr('x', 20 / 2)
    .attr('y', (_,i) => i * (20 + 1) + 10)
    .attr('width', 20)
    .attr('height', 20)
   
   legend.append('g')
      .selectAll('text')
      .data(categories)
      .enter()
      .append('text')
      .attr('fill', 'black')
      .attr('x', 20 * 2)
      .attr('y', (_,i) => i * (20 + 1) + 25)
      .text(d => d)

 }