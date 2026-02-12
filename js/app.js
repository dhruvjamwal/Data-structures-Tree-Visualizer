let input = [];

function drawBinaryTree(root) {
    const container = d3.select("#binary-tree");
    container.html(""); // Clear previous tree

    if (!root) return;

    const margin = { top: 40, right: 90, bottom: 50, left: 90 };
    const width = 1000 - margin.left - margin.right;
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

    const treeLayout = d3.tree().size([width, height]);
    const rootNode = treeLayout(hierarchyData);

    rootNode.descendants().forEach(d => { d.y = d.depth * 70; });

    const linkGenerator = d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y);

    svg.selectAll(".link")
        .data(rootNode.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", linkGenerator)
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .transition()
        .delay((d, i) => i * 50)
        .duration(750)
        .attr("opacity", 1);

    const nodes = svg.selectAll(".node")
        .data(rootNode.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    nodes.append("circle")
        .attr("r", 0)
        .attr("fill", d => (d.children || d._children) ? "lightblue" : "#fff") 
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .transition()
        .delay((d, i) => i * 50)
        .duration(1000)
        .ease(d3.easeElastic) 
        .attr("r", 20);

    nodes.append("text")
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .text(d => (isNaN(d.data.value) || d.data.value === undefined) ? "?" : d.data.value)
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("opacity", 0)
        .transition()
        .delay((d, i) => i * 50)
        .duration(1000)
        .style("opacity", 1);
}


function treeAndArray() {
    setupVisualization("Binary Tree", "Level-order insertion: Index 0 is Root, 1 is Left, 2 is Right.");
    if (input.length > 0) {
        createArrayContainer(input);
        let root = buildLevelOrderTree(input);
        drawBinaryTree(root);
    }
}

function heapify() {
    setupVisualization("Max-Heap", "Parent is always greater than or equal to children.");
    if (input.length > 0) {
        makeHeap(input); 
        // 2. Draw Array
        createArrayContainer(input);
        // 3. Draw Tree
        let root = buildLevelOrderTree(input);
        drawBinaryTree(root);
    }
}

function createBinarySearchTree() {
    setupVisualization("Binary Search Tree", "Sorted arrangement: Left < Parent < Right.");
    if (input.length > 0) {
        let root = buildBST(input);
        // 2. Draw Tree
        drawBinaryTree(root);
        d3.select("#array-visual").html("");
    }
}


function parseInput() {
    let raw = document.getElementById("array-input").value;
    if (!raw) return [];
    return raw.trim().split(/[\s,]+/).filter(x => x !== "").map(Number).filter(n => !isNaN(n));
}

function setupVisualization(title, instructions) {
    let rawInput = parseInput();
    if (rawInput.length === 0) {
        alert("Please enter some numbers first!");
        return;
    }
    input = rawInput; 
    
    document.querySelector('#visual-title').innerHTML = title;
    document.querySelector('#instructions').innerHTML = instructions;
    
    d3.select("#binary-tree").html("");
    d3.select("#array-visual").html("");
}

function createArrayContainer(arr) {
    let container = createContainer("array-visual", arr, arr.length * 60, 100);
    createArray(arr, 2, 30, 50, 50, container);
}

class SimpleNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

function buildLevelOrderTree(arr) {
    if (!arr || arr.length === 0) return null;
    let nodes = arr.map(v => new SimpleNode(v));
    for (let i = 0; i < nodes.length; i++) {
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        if (left < nodes.length) nodes[i].left = nodes[left];
        if (right < nodes.length) nodes[i].right = nodes[right];
    }
    return nodes[0];
}

function buildBST(arr) {
    if (!arr || arr.length === 0) return null;
    let root = new SimpleNode(arr[0]);
    for (let i = 1; i < arr.length; i++) {
        insertBST(root, arr[i]);
    }
    return root;
}

function insertBST(node, val) {
    if (val < node.value) {
        if (!node.left) node.left = new SimpleNode(val);
        else insertBST(node.left, val);
    } else {
        if (!node.right) node.right = new SimpleNode(val);
        else insertBST(node.right, val);
    }
}

window.onload = function() {
    document.getElementById("array-input").value = "10, 20, 60, 30, 70, 40, 50";
}
