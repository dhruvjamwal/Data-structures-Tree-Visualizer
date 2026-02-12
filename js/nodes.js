var regFill = "white";
var highlightFill = "lightblue";
var regFillText = "black";
var highlightFillText = "white";
let arrayContainer;

function createContainer(id, arr, width, height) {
    let div = d3.select(`div#${id}`);
    div.html("");
    
    arrayContainer = div.append('svg')
        .attr('width', width || 800)
        .attr('height', height || 150);
    
    return arrayContainer;
}

function createArray(arr, x, y, width, height, container) {
    if(!container) container = arrayContainer;

    var arrayData = arr.map((value, i) => {
        return {
            x: x + (i * 55), 
            y: y,
            width: width,
            height: height,
            color: regFill,
            value: value
        }
    });

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
