
function createBinarySearchTree() {
  const input = document.getElementById("array-input").value;
  // Convert "10 20 5" string into [10, 20, 5] array
  const data = input.split(" ").map(Number).filter(n => !isNaN(n));

  if (data.length === 0) {
    alert("Please enter some numbers!");
    return;
  }

  // Build the tree object
  const root = buildTree(data);

  // Draw it with D3
  drawTree(root);
}

// 2. Helper: Simple BST Builder
// (Ensures we have a valid tree structure even if nodes.js is missing)
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function buildTree(data) {
  if (data.length === 0) return null;
  const root = new Node(data[0]);
  
  for (let i = 1; i < data.length; i++) {
    insertNode(root, data[i]);
  }
  return root;
}

function insertNode(node, value) {
  if (value < node.value) {
    if (node.left === null) node.left = new Node(value);
    else insertNode(node.left, value);
  } else {
    if (node.right === null) node.right = new Node(value);
    else insertNode(node.right, value);
  }
}

// 3. The Visualization Logic (D3 v5)
// This recreates the reference animations: Elastic Pop & Delayed Paths
function drawTree(rootData) {
  // Clear previous SVG
  const container = document.getElementById("binary-tree");
  container.innerHTML = "";

  if (!rootData) return;

  // -- Configuration --
  const margin = { top: 40, right: 90, bottom: 50, left: 90 };
  const width = 1000 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // -- Setup SVG --
  const svg = d3.select("#binary-tree").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // -- Convert to D3 Hierarchy --
  const root = d3.hierarchy(rootData, d => {
    const children = [];
    if (d.left) children.push(d.left);
    if (d.right) children.push(d.right);
    return children.length ? children : null;
  });

  // -- Calculate Layout --
  const treeLayout = d3.tree().size([width, height]);
  treeLayout(root);

  // -- 1. Draw Links (Paths) --
  // D3 v5 uses d3.linkVertical()
  const linkGenerator = d3.linkVertical()
    .x(d => d.x)
    .y(d => d.y * 1.5); // *1.5 spreads the tree out vertically

  const links = svg.selectAll(".link")
    .data(root.links())
    .enter().append("path")
    .attr("class", "link")
    .attr("d", linkGenerator)
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-width", "2px")
    .attr("opacity", 0); // Start hidden

  // ANIMATION: Fade in links one by one
  links.transition()
    .delay((d, i) => i * 85) // Delay matches reference
    .duration(750)
    .attr("opacity", 1);

  // -- 2. Draw Nodes (Circles) --
  const nodes = svg.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", d => "translate(" + d.x + "," + (d.y * 1.5) + ")");

  // ANIMATION: Elastic Pop
  nodes.append("circle")
    .attr("r", 0) // Start at radius 0
    .attr("fill", d => d.children ? "lightblue" : "lightgray") // Inner vs Leaf color
    .attr("stroke", "steelblue")
    .attr("stroke-width", "3px")
    .transition()
    .delay((d, i) => i * 80) // Delay matches reference
    .duration(1000)
    .ease(d3.easeElastic) // <-- THE BOUNCE EFFECT
    .attr("r", 20);

  // -- 3. Draw Labels (Text) --
  nodes.append("text")
    .attr("dy", 5)
    .attr("text-anchor", "middle")
    .text(d => d.data.value)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("opacity", 0)
    .transition()
    .delay((d, i) => i * 90)
    .duration(1000)
    .style("opacity", 1);
}
