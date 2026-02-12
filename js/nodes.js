// --- js/node.js ---

// Colors
var regFill = "white";
var highlightFill = "lightblue";
var regFillText = "black";
var highlightFillText = "white";
let arrayContainer;

// 1. Create the SVG Container
function createContainer(id, arr, width, height) {
    let div = d3.select(`div#${id}`);
    div.html(""); // Clear existing
    
    arrayContainer = div.append('svg')
        .attr('width', width || 800)
        .attr('height', height || 150);
    
    return arrayContainer;
}

// 2. Draw the Array Rectangles
function createArray(arr, x, y, width, height, container) {
    if(!container) container = arrayContainer;

    var arrayData = arr.map((value, i) => {
        return {
            x: x + (i * 55), // Spacing
            y: y,
            width: width,
            height: height,
            color: regFill,
            value: value
        }
    });

    // Rectangles
    var elementsArr = container.selectAll("rect")
        .data(arrayData)
        .enter()
        .append("rect")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("width", d => d.width)
        .attr("height", d => d.height)
        .attr("fill", d => d.color)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    // Text Values
    container.selectAll("text.rect")
        .data(arrayData)
        .enter()
        .append("text")
        .attr("class", "rect")
        .attr("x", d => d.x + (d.width / 2))
        .attr("y", d => d.y + 30)
        .attr("text-anchor", "middle")
        .text(d => d.value)
        .attr("fill", regFillText)
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold");

    // Index Labels
    container.selectAll("text.index")
        .data(arrayData)
        .enter()
        .append("text")
        .attr("class", "index")
        .text((d, i) => `[${i}]`)
        .attr("x", d => d.x + (d.width / 2))
        .attr("y", d => d.y - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#555");
}
