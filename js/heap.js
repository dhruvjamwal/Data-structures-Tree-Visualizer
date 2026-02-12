// --- js/heap.js ---

function swap(arr, a, b) {
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}

function parent(index) {
    return Math.floor((index - 1) / 2);
}

// Main function used by app.js
function makeHeap(arr) {
    let i;  // Index of next element to be added
    let k;  // Index of new element as it is being pushed

    for (i = 1; i < arr.length; ++i) {
        k = i;
        while (k > 0 && arr[k] > arr[parent(k)]) {
            swap(arr, parent(k), k);
            k = parent(k);
        }
    }
    return arr;
}
