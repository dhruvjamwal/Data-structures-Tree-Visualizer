// Global Input Variable
let input;

// --- 1. CORE FUNCTIONS (Called by HTML Buttons) ---

function treeAndArray() {
    reset();
    let inputText = document.getElementById("array-input");
    document.querySelector('#visual-title').innerHTML = "Binary Tree Representation";
    document.querySelector('#instructions').innerHTML = "The input array arranged as a complete binary tree (Level Order).";
    
    if (inputText.value !== '') {
        input = parseInput(inputText.value);
        // 1. Build Standard Level-Order Tree
        let root = buildLevelOrderTree(input, 0);
        // 2. Draw
        drawBinaryTree(root);
        drawArray(input);
    }
}

function heapify() {
    reset();
    let inputText = document.getElementById("array-input");
    
    if (inputText.value !== '') {
        input = parseInput(inputText.value);
        // 1. Convert Array to Max Heap
        buildMaxHeap(input);
        // 2. Build Tree from Heapified Array
        let root = buildLevelOrderTree(input, 0);
        
        document.querySelector('#visual-title').innerHTML = "Max-Heap Visualization";
        document.querySelector('#instructions').innerHTML = "Parent nodes are always greater than or equal to their children.";
        
        // 3. Draw
        drawBinaryTree(root);
        drawArray(input);
    }
}

function createBinarySearchTree() {
    reset();
    let inputText = document.getElementById("array-input");
    
    if (inputText.value !== '') {
        input = parseInput(inputText.value);
        
        document.querySelector('#visual-title').innerHTML = "Binary Search Tree";
        document.querySelector('#instructions').innerHTML = "The input data sorted and arranged into a Binary Search Tree.";

        // 1. Build BST
        let root = buildBST(input);
        // 2. Draw
        drawBinaryTree(root);
        // (Optional) Draw sorted array
        input.sort((a,b) => a - b);
        drawArray(input);
    }
}

// --- 2. HELPER FUNCTIONS ---

function reset() {
    // Clear both visualization containers
    d3.select("#binary-tree").html("");
    d3.select("#array-visual").html("");
}

function parseInput(value) {
    // Splits by space or comma and removes non-numbers
    return value.trim().split(/\s+|\,+/g)
        .map((num) => parseFloat(num))
        .filter((num) => !isNaN(num));
}

// Node Class
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// A. Build BST (Standard insertion)
function buildBST(data) {
    if (!data || data.length === 0) return null;
    const root = new Node(data[0]);
    for(let i = 1; i < data.length; i++) {
        insertBST(root, data[i]);
    }
    return root;
}

function insertBST(node, value) {
    if (value < node.value) {
        if (node.left === null) node.left = new Node(value);
        else insertBST(node.left, value);
    } else {
        if (node.right === null) node.right = new Node(value);
        else insertBST(node.right, value);
    }
}

// B. Build Level Order Tree (For Heap and Standard Binary Tree)
function buildLevelOrderTree(arr, i) {
    if (i >= arr.length) return null;
    let root = new Node(arr[i]);
    root.left = buildLevelOrderTree(arr, 2 * i + 1);
    root.right = buildLevelOrderTree(arr, 2 * i + 2);
    return root;
}

// C. Max Heap Logic (Rearranges array in place)
function buildMaxHeap(arr) {
    // Start from last non-leaf node and heapify down
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
        heapifyDown(arr, arr.length, i);
    }
}

function heapifyDown(arr, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]]; // Swap
        heapifyDown(arr, n, largest);
    }
}

// --- 3. D3 DRAWING FUNCTIONS (The Animation Magic) ---

function drawBinaryTree(root) {
    if (!root) return;

    const container = d3.select("#binary-tree");
    const margin = { top: 40, right: 90, bottom: 50, left: 90 };
    const width = 1000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // D3 Hierarchy
    const hierarchyData = d3.hierarchy(root, d => {
        let children = [];
        if (d.left) children.push(d.left);
        if (d.right) children.push(d.right);
        return children.length ? children : null;
    });

    const treeLayout = d3.tree().size([width, height]);
    const rootNode = treeLayout(hierarchyData);
    
    // Spread vertically
    rootNode.descendants().forEach(d => { d.y = d.depth * 70; });

    // 1. Draw Links
    const linkGenerator = d3.linkVertical().x(d => d.x).y(d => d.y);

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
        .delay((d, i) => i * 85)
        .duration(750)
        .attr("opacity", 1);

    // 2. Draw Nodes
    const nodes = svg.selectAll(".node")
        .data(rootNode.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    // Circle Pop Animation
    nodes.append("circle")
        .attr("r", 0)
        .attr("fill", d => (d.children || d._children) ? "lightblue" : "#f0f0f0")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .transition()
        .delay((d, i) => i * 80)
        .duration(1000)
        .ease(d3.easeElastic)
        .attr("r", 20);

    // Text Fade In
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

// Simple Array Visualizer (to replace the old one)
function drawArray(arr) {
    const container = d3.select("#array-visual");
    const width = 800;
    const height = 100;
    const rectWidth = 50;
    
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);
        
    const g = svg.append("g")
        .attr("transform", "translate(20, 20)");
        
    // Bind Data
    const groups = g.selectAll("g")
        .data(arr)
        .enter().append("g")
        .attr("transform", (d, i) => `translate(${i * rectWidth}, 0)`);
        
    // Draw Rects
    groups.append("rect")
        .attr("width", rectWidth - 5)
        .attr("height", rectWidth - 5)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .style("opacity", 0)
        .transition()
        .delay((d, i) => i * 100)
        .duration(500)
        .style("opacity", 1);
        
    // Draw Text
    groups.append("text")
        .attr("x", (rectWidth - 5) / 2)
        .attr("y", (rectWidth - 5) / 2)
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .text(d => d)
        .style("opacity", 0)
        .transition()
        .delay((d, i) => i * 100)
        .duration(500)
        .style("opacity", 1);
        
    // Draw Index
    groups.append("text")
        .attr("x", (rectWidth - 5) / 2)
        .attr("y", rectWidth + 15)
        .attr("text-anchor", "middle")
        .text((d, i) => i)
        .style("font-size", "10px")
        .style("fill", "red");
}

// Default run
window.onload = function() {
    // Pre-fill input for convenience
    let defaultInput = [10, 20, 60, 30, 70, 40, 50];
    let inputTest = document.getElementById("array-input");
    if(inputTest) inputTest.value = defaultInput.join(", ");
}
