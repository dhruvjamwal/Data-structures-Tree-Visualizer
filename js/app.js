// --- js/app.js ---

// Global Input Variable
let input = [];

// 1. Common Drawing Function (The one with Elastic Animation)
function drawBinaryTree(root) {
    const container = d3.select("#binary-tree");
    container.html(""); // Clear previous visualization

    if (!root) return;

    // Dimensions and Setup
    const margin = { top: 40, right: 90, bottom: 50, left: 90 };
    const width = 1000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Convert to D3 Hierarchy
    const hierarchyData = d3.hierarchy(root, d => {
        let children = [];
        if (d.left) children.push(d.left);
        if (d.right) children.push(d.right);
        return children.length ? children : null;
    });

    // Layout Calculation
    const treeLayout = d3.tree().size([width, height]);
    const rootNode = treeLayout(hierarchyData);

    // Adjust vertical spacing (depth)
    rootNode.descendants().forEach(d => { d.y = d.depth * 70; });

    // --- DRAW LINKS (with Delayed Fade-In) ---
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

    // --- DRAW NODES (with Elastic Pop) ---
    const nodes = svg.selectAll(".node")
        .data(rootNode.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    // Circle Animation
    nodes.append("circle")
        .attr("r", 0)
        .attr("fill", d => (d.children || d._children) ? "lightblue" : "#fff")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .transition()
        .delay((d, i) => i * 50)
        .duration(1000)
        .ease(d3.easeElastic) // <--- The Elastic Effect
        .attr("r", 20);

    // Text Animation
    nodes.append("text")
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .text(d => d.data.value)
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("opacity", 0)
        .transition()
        .delay((d, i) => i * 50)
        .duration(1000)
        .style("opacity", 1);
}

// 2. Button 1: Binary Tree Visualization (Level Order)
function treeAndArray() {
    let inputText = document.getElementById("array-input").value;
    updateInfo("Binary Tree", "Standard level-order insertion (Index 0 is root, 1 is left, 2 is right, etc).");
    
    if (inputText !== '') {
        input = parseInput(inputText);
        let root = buildLevelOrderTree(input);
        drawBinaryTree(root);
    }
}

// 3. Button 2: Max-Heap Visualization
function heapify() {
    let inputText = document.getElementById("array-input").value;
    updateInfo("Max-Heap", "Parent's value is always greater than or equal to its children.");

    if (inputText !== '') {
        input = parseInput(inputText);
        // Transform input array into a Max Heap array
        buildMaxHeapArray(input);
        // Visualize that heap array as a tree
        let root = buildLevelOrderTree(input);
        drawBinaryTree(root);
    }
}

// 4. Button 3: Binary Search Tree Visualization
function createBinarySearchTree() {
    let inputText = document.getElementById("array-input").value;
    updateInfo("Binary Search Tree", "Input sorted and arranged: Left child < Parent < Right child.");

    if (inputText !== '') {
        input = parseInput(inputText);
        let root = buildBST(input);
        drawBinaryTree(root);
    }
}

// --- HELPER FUNCTIONS & CLASSES ---

// Simple Node Class
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// Helper: Parse comma or space separated string to number array
function parseInput(text) {
    return text.trim().split(/[\s,]+/).map(num => parseInt(num)).filter(n => !isNaN(n));
}

// Helper: Update Title and Instructions
function updateInfo(title, instructions) {
    document.querySelector('#visual-title').innerHTML = title;
    document.querySelector('#instructions').innerHTML = instructions;
    d3.selectAll('svg').remove(); // Clear previous
}

// Algorithm: Build Level Order Tree (Used for Binary Tree & Heap)
function buildLevelOrderTree(arr) {
    if (arr.length === 0) return null;
    let nodes = arr.map(val => new Node(val));
    
    for (let i = 0; i < nodes.length; i++) {
        let leftIdx = 2 * i + 1;
        let rightIdx = 2 * i + 2;
        if (leftIdx < nodes.length) nodes[i].left = nodes[leftIdx];
        if (rightIdx < nodes.length) nodes[i].right = nodes[rightIdx];
    }
    return nodes[0];
}

// Algorithm: Build Binary Search Tree
function buildBST(arr) {
    if (arr.length === 0) return null;
    let root = new Node(arr[0]);
    for (let i = 1; i < arr.length; i++) {
        insertBST(root, arr[i]);
    }
    return root;
}

function insertBST(node, value) {
    if (value < node.value) {
        if (!node.left) node.left = new Node(value);
        else insertBST(node.left, value);
    } else {
        if (!node.right) node.right = new Node(value);
        else insertBST(node.right, value);
    }
}

// Algorithm: Convert Array to Max Heap (In-place)
function buildMaxHeapArray(arr) {
    // Start from the last non-leaf node and heapify down
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
        maxHeapify(arr, arr.length, i);
    }
    return arr;
}

function maxHeapify(arr, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]]; // Swap
        maxHeapify(arr, n, largest);
    }
}

// Initialize with default values on load
window.onload = function() {
    let defaultInput = "10, 20, 60, 30, 70, 40, 50";
    document.getElementById("array-input").value = defaultInput;
};
