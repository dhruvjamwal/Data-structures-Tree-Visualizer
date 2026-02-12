function drawBinaryTree(root) {
    // 1. SELECT & CLEAR
    const container = d3.select("#binary-tree");
    container.html(""); // Clear previous tree

    if (!root) return;

    // 2. SETUP DIMENSIONS
    const margin = { top: 40, right: 90, bottom: 50, left: 90 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const hierarchyData = d3.hierarchy(root, d => {
        let children = [];
        if (d.left) children.push(d.left);
        if (d.right) children.push(d.right);
        return children.length ? children : null;
    });

    // 4. CALCULATE LAYOUT
    const treeLayout = d3.tree().size([width, height]);
    const rootNode = treeLayout(hierarchyData);

    // FIX DEPTH (matches the 'd.depth * 70' from your example)
    rootNode.descendants().forEach(d => { d.y = d.depth * 70; });
    const linkGenerator = d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y);

    const links = svg.selectAll(".link")
        .data(rootNode.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", linkGenerator)
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .attr("opacity", 0); // Start hidden

    links.transition()
        .delay((d, i) => i * 85)
        .duration(750)
        .attr("opacity", 1);

    const nodes = svg.selectAll(".node")
        .data(rootNode.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    nodes.append("circle")
        .attr("r", 0) // Start invisible
        .attr("fill", d => (d.children || d._children) ? "lightblue" : "lightgray") // Inner nodes blue, leaves gray
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .transition()
        .delay((d, i) => i * 80)
        .duration(1000)
        .ease(d3.easeElastic) // The specific 'bounce' effect you wanted
        .attr("r", 20);

    // ANIMATION: Text Fade In
    nodes.append("text")
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .text(d => d.data.value)
        .style("opacity", 0)
        .transition()
        .delay((d, i) => i * 90)
        .duration(1000)
        .style("opacity", 1);
}
