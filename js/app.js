// Global Input Variable
let input;

// 1. Restore the Reset Function
function reset() {
  d3.selectAll('svg').remove();
  // Clear any array visuals if they exist
  const arrayContainer = document.getElementById("array-visual");
  if (arrayContainer) arrayContainer.innerHTML = ""; 
}

// 2. Restore Tree and Array Visualization (Uses your original Logic)
function treeAndArray() {
  reset();
  let inputText = document.getElementById("array-input");
  document.querySelector('#visual-title').innerHTML = "Binary Tree And Array";
  document.querySelector('#instructions').innerHTML = "Click a value in the binary tree or array to highlight its corresponding location in the data structure.";
  
  if (inputText.value !== '') {
      input = inputText.value.trim().split(/\s+|\,+/g).map((num) => parseInt(num));
      createBinaryTreeAndArr(input);
  }
}

// 3. Restore Heapify (Uses your original Logic)
function heapify() {
  reset();
  let inputText = document.getElementById("array-input");
  
  if (inputText.value !== '') {
    input = inputText.value.trim().split(/\s+|\,+/g).map((num) => parseInt(num));
    // Assuming makeHeap is in heap.js
    makeHeap(input, input.length);
    createBinaryTreeAndArr(input);
    document.getElementById('instructions').innerHTML = "<p> Parent's value is always greater than or equal to the values of its children.</p>";
    document.getElementById('visual-title').innerHTML = "Max-Heap Binary Tree And Array";
  }
}

// 4. Restore Helper for Tree/Array (Uses your original Logic)
function createBinaryTreeAndArr(arr) {
  // Assuming createContainer and createArray are in nodes.js
  if (typeof createContainer === "function") {
      createContainer("array-visual", arr, arr.length * 60, 100);
  }
  
  // Try to use your original Tree class if it exists for the basic view
  if (typeof Tree === "function") {
      let tree = new Tree();
      tree.createBinaryTree(input);
  }
  
  if (typeof createArray === "function") {
      createArray(arr, 2, 30, 50, 50);
  }
}

// 5. UPDATE: Binary Search Tree Visualization
// This now uses the NEW animation logic
function createBinarySearchTree() {
  let inputText = document.getElementById("array-input");
  
  if (inputText.value !== '') {
    reset();
    input = inputText.value.trim().split(/\s+|\,+/g).map((num) => parseInt(num));
    
    document.querySelector('#visual-title').innerHTML = "Binary Search Tree";
    document.querySelector('#instructions').innerHTML = "The input data sorted and arranged into a Binary Search Tree with Elastic Animations.";

    // 1. Build the tree structure locally
    let root = simpleBuildBST(input);

    // 2. Draw it with the new D3 v5 animation
    drawBinaryTree(root);
  }
}

// --- NEW ANIMATION CODE BELOW ---

// Helper: Build a simple object structure for D3
function simpleBuildBST(data) {
    if (!data || data.length === 0) return null;
    
    class Node {
        constructor(value) {
            this.value = value;
            this.left = null;
            this.right = null;
        }
    }
    
    const root = new Node(data[0]);
    
    for(let i = 1; i < data.length; i++) {
        let current = root;
        while(true) {
            if(data[i] < current.value) {
                if(!current.left) { current.left = new Node(data[i]); break; }
                current = current.left;
            } else {
                if(!current.right) { current.right = new Node(data[i]); break; }
                current = current.right;
            }
        }
    }
    return root;
}

// The D3 v5 Drawing Function with Transitions
function drawBinaryTree(root) {
    if (!root) return;

    // 1. Setup
    const container = d3.select("#binary-tree");
    // Dimensions
    const margin = { top: 40, right: 90, bottom: 50, left: 90 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 2. Data Hierarchy
    const hierarchyData = d3.hierarchy(root, d => {
        let children = [];
        if (d.left) children.push(d.left);
        if (d.right) children.push(d.right);
        return children.length ? children : null;
    });

    // 3. Layout
    const treeLayout = d3.tree().size([width, height]);
    const rootNode = treeLayout(hierarchyData);
    
    // Adjust depth (vertical spacing)
    rootNode.descendants().forEach(d => { d.y = d.depth * 70; });

    // 4. Draw Links (Paths)
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

    // Transition: Fade in links
    links.transition()
        .delay((d, i) => i * 85)
        .duration(750)
        .attr("opacity", 1);

    // 5. Draw Nodes (Circles)
    const nodes = svg.selectAll(".node")
        .data(rootNode.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    // Transition: Elastic Pop
    nodes.append("circle")
        .attr("r", 0) // Start invisible
        .attr("fill", d => (d.children || d._children) ? "lightblue" : "lightgray")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .transition()
        .delay((d, i) => i * 80)
        .duration(1000)
        .ease(d3.easeElastic) // The bounce effect
        .attr("r", 20);

    // Transition: Text Fade
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

// Initial default run
window.onload = function() {
    input = [10, 20, 60, 30, 70, 40, 50];
    let inputTest = document.getElementById("array-input");
    if(inputTest) inputTest.value = input.join(", ");
}
