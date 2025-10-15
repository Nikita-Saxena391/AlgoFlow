import { ChevronLeft, ChevronRight, Code, Download, HelpCircle, Lightbulb, Menu, Moon, Pause, Play, Plus, RotateCcw, Share2, Sun, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// ==================== UTILITY FUNCTIONS ====================
const generateRandomArray = (size) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 5);
};

const generateWeightedGraph = () => {
  return {
    nodes: [0, 1, 2, 3, 4, 5, 6],
    edges: [
      { from: 0, to: 1, weight: 4 },
      { from: 0, to: 3, weight: 2 },
      { from: 1, to: 2, weight: 3 },
      { from: 1, to: 4, weight: 5 },
      { from: 2, to: 5, weight: 6 },
      { from: 3, to: 4, weight: 1 },
      { from: 4, to: 6, weight: 3 },
    ]
  };
};

// ==================== SORTING ALGORITHMS ====================
const bubbleSort = (arr) => {
  const steps = [];
  const array = [...arr];

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      steps.push({ 
        type: 'compare', 
        indices: [j, j + 1],
        description: `Comparing ${array[j]} and ${array[j + 1]}`
      });

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        steps.push({ 
          type: 'swap', 
          indices: [j, j + 1],
          description: `Swapping ${array[j + 1]} and ${array[j]}`
        });
      }
    }
    steps.push({ 
      type: 'sorted', 
      index: array.length - i - 1,
      description: `Element at position ${array.length - i - 1} is now sorted`
    });
  }

  return steps;
};

const selectionSort = (arr) => {
  const steps = [];
  const array = [...arr];

  for (let i = 0; i < array.length - 1; i++) {
    let minIdx = i;
    steps.push({ 
      type: 'current', 
      index: i,
      description: `Looking for minimum from position ${i}`
    });

    for (let j = i + 1; j < array.length; j++) {
      steps.push({ 
        type: 'compare', 
        indices: [minIdx, j],
        description: `Comparing ${array[minIdx]} with ${array[j]}`
      });

      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      steps.push({ 
        type: 'swap', 
        indices: [i, minIdx],
        description: `Swapping minimum element to position ${i}`
      });
    }
    steps.push({ 
      type: 'sorted', 
      index: i,
      description: `Position ${i} is now sorted`
    });
  }
  steps.push({ type: 'sorted', index: array.length - 1 });

  return steps;
};

const insertionSort = (arr) => {
  const steps = [];
  const array = [...arr];

  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    steps.push({ 
      type: 'current', 
      index: i,
      description: `Inserting element ${key} into sorted portion`
    });

    while (j >= 0 && array[j] > key) {
      steps.push({ 
        type: 'compare', 
        indices: [j, j + 1],
        description: `${array[j]} > ${key}, shifting right`
      });
      array[j + 1] = array[j];
      steps.push({ type: 'shift', indices: [j, j + 1] });
      j--;
    }
    array[j + 1] = key;
  }

  for (let i = 0; i < array.length; i++) {
    steps.push({ type: 'sorted', index: i });
  }

  return steps;
};

const mergeSort = (arr) => {
  const steps = [];
  const array = [...arr];

  const merge = (left, mid, right) => {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({ 
        type: 'compare', 
        indices: [left + i, mid + 1 + j],
        description: `Merging: comparing ${leftArr[i]} and ${rightArr[j]}`
      });

      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        steps.push({ type: 'overwrite', index: k, value: leftArr[i] });
        i++;
      } else {
        array[k] = rightArr[j];
        steps.push({ type: 'overwrite', index: k, value: rightArr[j] });
        j++;
      }
      k++;
    }

    while (i < leftArr.length) {
      array[k] = leftArr[i];
      steps.push({ type: 'overwrite', index: k, value: leftArr[i] });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      array[k] = rightArr[j];
      steps.push({ type: 'overwrite', index: k, value: rightArr[j] });
      j++;
      k++;
    }
  };

  const mergeSortHelper = (left, right) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      mergeSortHelper(left, mid);
      mergeSortHelper(mid + 1, right);
      merge(left, mid, right);
    }
  };

  mergeSortHelper(0, array.length - 1);

  for (let i = 0; i < array.length; i++) {
    steps.push({ type: 'sorted', index: i });
  }

  return steps;
};

const quickSort = (arr) => {
  const steps = [];
  const array = [...arr];

  const partition = (low, high) => {
    const pivot = array[high];
    steps.push({ 
      type: 'pivot', 
      index: high,
      description: `Choosing pivot: ${pivot}`
    });
    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({ 
        type: 'compare', 
        indices: [j, high],
        description: `Comparing ${array[j]} with pivot ${pivot}`
      });

      if (array[j] < pivot) {
        i++;
        if (i !== j) {
          [array[i], array[j]] = [array[j], array[i]];
          steps.push({ type: 'swap', indices: [i, j] });
        }
      }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    steps.push({ type: 'swap', indices: [i + 1, high] });
    return i + 1;
  };

  const quickSortHelper = (low, high) => {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    }
  };

  quickSortHelper(0, array.length - 1);

  for (let i = 0; i < array.length; i++) {
    steps.push({ type: 'sorted', index: i });
  }

  return steps;
};

const heapSort = (arr) => {
  const steps = [];
  const array = [...arr];

  const heapify = (n, i) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      steps.push({ 
        type: 'compare', 
        indices: [largest, left],
        description: `Comparing parent with left child`
      });
      if (array[left] > array[largest]) {
        largest = left;
      }
    }

    if (right < n) {
      steps.push({ 
        type: 'compare', 
        indices: [largest, right],
        description: `Comparing with right child`
      });
      if (array[right] > array[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      [array[i], array[largest]] = [array[largest], array[i]];
      steps.push({ 
        type: 'swap', 
        indices: [i, largest],
        description: `Swapping to maintain heap property`
      });
      heapify(n, largest);
    }
  };

  for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
    heapify(array.length, i);
  }

  for (let i = array.length - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    steps.push({ 
      type: 'swap', 
      indices: [0, i],
      description: `Moving max element to end`
    });
    steps.push({ type: 'sorted', index: i });
    heapify(i, 0);
  }
  steps.push({ type: 'sorted', index: 0 });

  return steps;
};

// ==================== SEARCHING ALGORITHMS ====================
const linearSearch = (arr, target) => {
  const steps = [];

  for (let i = 0; i < arr.length; i++) {
    steps.push({ 
      type: 'compare', 
      index: i,
      description: `Checking if ${arr[i]} equals target ${target}`
    });

    if (arr[i] === target) {
      steps.push({ 
        type: 'found', 
        index: i,
        description: `Found target ${target} at index ${i}!`
      });
      return steps;
    }
  }

  steps.push({ 
    type: 'notfound',
    description: `Target ${target} not found in array`
  });
  return steps;
};

const binarySearch = (arr, target) => {
  const steps = [];
  const indexedArr = arr.map((value, index) => ({ value, originalIndex: index }));
  indexedArr.sort((a, b) => a.value - b.value);

  let left = 0;
  let right = indexedArr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const originalMidIndex = indexedArr[mid].originalIndex;
    steps.push({ 
      type: 'compare', 
      index: originalMidIndex,
      description: `Checking middle element: ${indexedArr[mid].value}`
    });

    if (indexedArr[mid].value === target) {
      steps.push({ 
        type: 'found', 
        index: originalMidIndex,
        description: `Found target ${target}!`
      });
      return steps;
    } else if (indexedArr[mid].value < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  steps.push({ type: 'notfound' });
  return steps;
};

// ==================== TREE TRAVERSAL ====================
const createSampleTree = () => {
  return {
    value: 1,
    left: {
      value: 2,
      left: { value: 4, left: null, right: null },
      right: { value: 5, left: null, right: null }
    },
    right: {
      value: 3,
      left: { value: 6, left: null, right: null },
      right: { value: 7, left: null, right: null }
    }
  };
};

const preorderTraversal = (root) => {
  const steps = [];
  
  const traverse = (node) => {
    if (!node) return;
    steps.push({ 
      type: 'visit', 
      node: node.value,
      description: `Visiting node ${node.value} (Root → Left → Right)`
    });
    traverse(node.left);
    traverse(node.right);
  };
  
  traverse(root);
  return steps;
};

const inorderTraversal = (root) => {
  const steps = [];
  
  const traverse = (node) => {
    if (!node) return;
    traverse(node.left);
    steps.push({ 
      type: 'visit', 
      node: node.value,
      description: `Visiting node ${node.value} (Left → Root → Right)`
    });
    traverse(node.right);
  };
  
  traverse(root);
  return steps;
};

const postorderTraversal = (root) => {
  const steps = [];
  
  const traverse = (node) => {
    if (!node) return;
    traverse(node.left);
    traverse(node.right);
    steps.push({ 
      type: 'visit', 
      node: node.value,
      description: `Visiting node ${node.value} (Left → Right → Root)`
    });
  };
  
  traverse(root);
  return steps;
};

const levelOrderTraversal = (root) => {
  const steps = [];
  if (!root) return steps;
  
  const queue = [root];
  
  while (queue.length > 0) {
    const node = queue.shift();
    steps.push({ 
      type: 'visit', 
      node: node.value,
      description: `Visiting node ${node.value} at current level`
    });
    
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  
  return steps;
};

// ==================== GRAPH TRAVERSAL ====================
const createSampleGraph = () => {
  return {
    0: [1, 3],
    1: [0, 2, 4],
    2: [1, 5],
    3: [0, 4],
    4: [1, 3, 6],
    5: [2],
    6: [4]
  };
};

const bfsTraversal = (graph, startNode = 0) => {
  const steps = [];
  const visited = new Set();
  const queue = [startNode];
  
  visited.add(startNode);
  
  while (queue.length > 0) {
    const node = queue.shift();
    steps.push({ 
      type: 'visit', 
      node,
      description: `Visiting node ${node} (BFS level-by-level)`
    });
    
    const neighbors = graph[node] || [];
    
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        steps.push({ type: 'discover', node: neighbor, from: node });
      }
    }
  }
  
  return steps;
};

const dfsTraversal = (graph, startNode = 0) => {
  const steps = [];
  const visited = new Set();
  
  const traverse = (node) => {
    visited.add(node);
    steps.push({ 
      type: 'visit', 
      node,
      description: `Visiting node ${node} (DFS depth-first)`
    });
    
    const neighbors = graph[node] || [];
    
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        steps.push({ type: 'discover', node: neighbor, from: node });
        traverse(neighbor);
      }
    }
    
    steps.push({ type: 'backtrack', node });
  };
  
  traverse(startNode);
  return steps;
};

const dijkstra = (graphData, startNode = 0) => {
  const steps = [];
  const distances = {};
  const visited = new Set();
  const nodes = graphData.nodes;
  
  nodes.forEach(node => {
    distances[node] = Infinity;
  });
  distances[startNode] = 0;
  
  steps.push({
    type: 'init',
    description: `Starting Dijkstra from node ${startNode}`
  });
  
  while (visited.size < nodes.length) {
    let minNode = null;
    let minDist = Infinity;
    
    for (const node of nodes) {
      if (!visited.has(node) && distances[node] < minDist) {
        minDist = distances[node];
        minNode = node;
      }
    }
    
    if (minNode === null) break;
    
    visited.add(minNode);
    steps.push({
      type: 'visit',
      node: minNode,
      distance: distances[minNode],
      description: `Visiting node ${minNode} with distance ${distances[minNode]}`
    });
    
    const edges = graphData.edges.filter(e => e.from === minNode || e.to === minNode);
    
    for (const edge of edges) {
      const neighbor = edge.from === minNode ? edge.to : edge.from;
      if (!visited.has(neighbor)) {
        const newDist = distances[minNode] + edge.weight;
        
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          steps.push({
            type: 'update',
            node: neighbor,
            distance: newDist,
            description: `Updated distance to ${neighbor}: ${newDist}`
          });
        }
      }
    }
  }
  
  return steps;
};

// ==================== COMPONENTS ====================
const TreeNode = ({ node, visitedNodes, darkMode, level = 0, x = 300, y = 50 }) => {
  if (!node) return null;

  const isVisited = visitedNodes.includes(node.value);
  const isCurrent = visitedNodes.length > 0 && visitedNodes[visitedNodes.length - 1] === node.value;
  
  let nodeColor;
  if (isCurrent) {
    nodeColor = '#f59e0b';
  } else if (isVisited) {
    nodeColor = '#10b981';
  } else {
    nodeColor = darkMode ? '#6366f1' : '#8b5cf6';
  }

  const horizontalSpacing = 120 / (level + 1);
  const verticalSpacing = 100;

  const leftX = x - horizontalSpacing;
  const leftY = y + verticalSpacing;
  const rightX = x + horizontalSpacing;
  const rightY = y + verticalSpacing;

  return (
    <g>
      {node.left && (
        <>
          <line
            x1={x}
            y1={y}
            x2={leftX}
            y2={leftY}
            stroke={darkMode ? '#475569' : '#94a3b8'}
            strokeWidth="2"
          />
          <TreeNode 
            node={node.left} 
            visitedNodes={visitedNodes} 
            darkMode={darkMode} 
            level={level + 1}
            x={leftX}
            y={leftY}
          />
        </>
      )}
      {node.right && (
        <>
          <line
            x1={x}
            y1={y}
            x2={rightX}
            y2={rightY}
            stroke={darkMode ? '#475569' : '#94a3b8'}
            strokeWidth="2"
          />
          <TreeNode 
            node={node.right} 
            visitedNodes={visitedNodes} 
            darkMode={darkMode} 
            level={level + 1}
            x={rightX}
            y={rightY}
          />
        </>
      )}
      <circle
        cx={x}
        cy={y}
        r="25"
        fill={nodeColor}
        stroke="white"
        strokeWidth="2"
        style={{ 
          transition: 'all 0.5s ease',
          cursor: 'pointer'
        }}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dy="0.3em"
        fill="white"
        fontSize="18"
        fontWeight="600"
        style={{ pointerEvents: 'none' }}
      >
        {node.value}
      </text>
    </g>
  );
};

const GraphView = ({ graph, visitedNodes, darkMode, isWeighted = false, graphData = null }) => {
  const positions = {
    0: { x: 150, y: 50 },
    1: { x: 300, y: 50 },
    2: { x: 450, y: 50 },
    3: { x: 150, y: 200 },
    4: { x: 300, y: 200 },
    5: { x: 450, y: 200 },
    6: { x: 300, y: 350 }
  };

  const renderEdges = () => {
    if (isWeighted && graphData) {
      return graphData.edges.map((edge, idx) => {
        const fromPos = positions[edge.from];
        const toPos = positions[edge.to];
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        
        return (
          <g key={idx}>
            <line
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke={darkMode ? '#475569' : '#94a3b8'}
              strokeWidth="2"
            />
            <circle
              cx={midX}
              cy={midY}
              r="15"
              fill={darkMode ? '#1e293b' : '#f1f5f9'}
              stroke={darkMode ? '#475569' : '#94a3b8'}
              strokeWidth="1"
            />
            <text
              x={midX}
              y={midY}
              textAnchor="middle"
              dy="0.3em"
              fill={darkMode ? '#e2e8f0' : '#1e293b'}
              fontSize="12"
              fontWeight="600"
            >
              {edge.weight}
            </text>
          </g>
        );
      });
    } else {
      return Object.keys(graph).map(node => {
        const nodeNum = parseInt(node);
        return graph[node].map(neighbor => {
          if (nodeNum < neighbor) {
            return (
              <line
                key={`${nodeNum}-${neighbor}`}
                x1={positions[nodeNum].x}
                y1={positions[nodeNum].y}
                x2={positions[neighbor].x}
                y2={positions[neighbor].y}
                stroke={darkMode ? '#475569' : '#94a3b8'}
                strokeWidth="2"
              />
            );
          }
          return null;
        });
      });
    }
  };

  return (
    <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
      {renderEdges()}
      {Object.keys(positions).map(node => {
        const nodeNum = parseInt(node);
        const isVisited = visitedNodes.includes(nodeNum);
        const nodeColor = isVisited ? '#10b981' : (darkMode ? '#6366f1' : '#8b5cf6');

        return (
          <g key={nodeNum}>
            <circle
              cx={positions[nodeNum].x}
              cy={positions[nodeNum].y}
              r="25"
              fill={nodeColor}
              stroke="white"
              strokeWidth="2"
              style={{ cursor: 'pointer' }}
            />
            <text
              x={positions[nodeNum].x}
              y={positions[nodeNum].y}
              textAnchor="middle"
              dy="0.3em"
              fill="white"
              fontSize="18"
              fontWeight="600"
            >
              {nodeNum}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ==================== MAIN APP ====================
const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [category, setCategory] = useState('sorting');
  const [algorithm, setAlgorithm] = useState('bubble');
  const [array, setArray] = useState(generateRandomArray(30));
  const [arraySize, setArraySize] = useState(30);
  const [speed, setSpeed] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [swapCount, setSwapCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTarget, setSearchTarget] = useState(null);
  const [notification, setNotification] = useState('');
  const [treeData, setTreeData] = useState(createSampleTree());
  const [graphData, setGraphData] = useState(createSampleGraph());
  const [weightedGraphData, setWeightedGraphData] = useState(generateWeightedGraph());
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [showExplanation, setShowExplanation] = useState(true);
  const [currentExplanation, setCurrentExplanation] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [isCustomArray, setIsCustomArray] = useState(false);
  const [customArrayData, setCustomArrayData] = useState([]);

  const animationRef = useRef(null);

  const algorithms = {
    sorting: [
      { id: 'bubble', name: 'Bubble Sort', time: 'O(n²)', space: 'O(1)' },
      { id: 'selection', name: 'Selection Sort', time: 'O(n²)', space: 'O(1)' },
      { id: 'insertion', name: 'Insertion Sort', time: 'O(n²)', space: 'O(1)' },
      { id: 'merge', name: 'Merge Sort', time: 'O(n log n)', space: 'O(n)' },
      { id: 'quick', name: 'Quick Sort', time: 'O(n log n)', space: 'O(log n)' },
      { id: 'heap', name: 'Heap Sort', time: 'O(n log n)', space: 'O(1)' },
    ],
    searching: [
      { id: 'linear', name: 'Linear Search', time: 'O(n)', space: 'O(1)' },
      { id: 'binary', name: 'Binary Search', time: 'O(log n)', space: 'O(1)' },
    ],
    tree: [
      { id: 'preorder', name: 'Preorder Traversal', time: 'O(n)', space: 'O(h)' },
      { id: 'inorder', name: 'Inorder Traversal', time: 'O(n)', space: 'O(h)' },
      { id: 'postorder', name: 'Postorder Traversal', time: 'O(n)', space: 'O(h)' },
      { id: 'levelorder', name: 'Level Order Traversal', time: 'O(n)', space: 'O(w)' },
    ],
    graph: [
      { id: 'bfs', name: 'BFS Traversal', time: 'O(V+E)', space: 'O(V)' },
      { id: 'dfs', name: 'DFS Traversal', time: 'O(V+E)', space: 'O(V)' },
      { id: 'dijkstra', name: "Dijkstra's Algorithm", time: 'O(V²)', space: 'O(V)' },
    ],
  };

  const currentAlgo = algorithms[category]?.find(a => a.id === algorithm);

  useEffect(() => {
    resetVisualization();
  }, [algorithm, category]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const delay = (category === 'tree' || category === 'graph') 
        ? Math.max(300, 1500 - (speed * 12))
        : 101 - speed;
      
      animationRef.current = setTimeout(() => {
        executeStep(steps[currentStep]);
        setCurrentStep(prev => prev + 1);
      }, delay);
    } else if (currentStep >= steps.length && steps.length > 0) {
       setIsPlaying(false);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, currentStep, steps, speed, category]);

  const executeStep = (step) => {
    if (!step) return;

    setCurrentExplanation(step.description || '');

    switch (step.type) {
      case 'compare':
        setHighlightedIndices(step.indices || [step.index]);
        setComparisonCount(prev => prev + 1);
        break;
      case 'swap':
        setHighlightedIndices(step.indices);
        setSwapCount(prev => prev + 1);
        const [i, j] = step.indices;
        setArray(prev => {
          const newArr = [...prev];
          [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
          return newArr;
        });
        break;
      case 'sorted':
        setSortedIndices(prev => [...prev, step.index]);
        setHighlightedIndices([]);
        break;
      case 'overwrite':
        setHighlightedIndices([step.index]);
        setArray(prev => {
          const newArr = [...prev];
          newArr[step.index] = step.value;
          return newArr;
        });
        break;
      case 'found':
        setHighlightedIndices([step.index]);
        setSortedIndices([step.index]);
        break;
      case 'notfound':
        setHighlightedIndices([]);
        setNotification(`Target ${searchTarget} not found in the array.`);
        break;
      case 'visit':
        setVisitedNodes(prev => [...prev, step.node]);
        setComparisonCount(prev => prev + 1);
        break;
      case 'discover':
        setSwapCount(prev => prev + 1);
        break;
      case 'update':
        setComparisonCount(prev => prev + 1);
        break;
      default:
        setHighlightedIndices([]);
    }
  };

  const startVisualization = () => {
    setNotification('');
    if (steps.length === 0) {
      generateSteps();
    }
    setIsPlaying(true);
  };

  const pauseVisualization = () => {
    setIsPlaying(false);
  };

  const resetVisualization = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSteps([]);
    setHighlightedIndices([]);
    setSortedIndices([]);
    setComparisonCount(0);
    setSwapCount(0);
    // Only generate new array if not using custom input
    if (!isCustomArray) {
      setArray(generateRandomArray(arraySize));
    } else {
      // Restore custom array
      setArray([...customArrayData]);
    }
    setSearchTarget(null);
    setNotification('');
    setTreeData(createSampleTree());
    setGraphData(createSampleGraph());
    setWeightedGraphData(generateWeightedGraph());
    setVisitedNodes([]);
    setCurrentExplanation('');
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      executeStep(steps[currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(0);
      setHighlightedIndices([]);
      setSortedIndices([]);
      setVisitedNodes([]);
      setComparisonCount(0);
      setSwapCount(0);
      setArray(generateRandomArray(arraySize));
      for (let i = 0; i < currentStep - 1; i++) {
        executeStep(steps[i]);
      }
      setCurrentStep(prev => prev - 1);
    }
  };

  const jumpToStep = (stepNum) => {
    setCurrentStep(0);
    setHighlightedIndices([]);
    setSortedIndices([]);
    setVisitedNodes([]);
    setComparisonCount(0);
    setSwapCount(0);
    setArray(generateRandomArray(arraySize));
    for (let i = 0; i < stepNum && i < steps.length; i++) {
      executeStep(steps[i]);
    }
    setCurrentStep(stepNum);
  };

  const generateSteps = () => {
    let newSteps = [];

    if (category === 'sorting') {
      switch (algorithm) {
        case 'bubble':
          newSteps = bubbleSort(array);
          break;
        case 'selection':
          newSteps = selectionSort(array);
          break;
        case 'insertion':
          newSteps = insertionSort(array);
          break;
        case 'merge':
          newSteps = mergeSort(array);
          break;
        case 'quick':
          newSteps = quickSort(array);
          break;
        case 'heap':
          newSteps = heapSort(array);
          break;
      }
    } else if (category === 'searching') {
      const target = searchTarget || array[Math.floor(Math.random() * array.length)];
      setSearchTarget(target);

      if (algorithm === 'linear') {
        newSteps = linearSearch(array, target);
      } else if (algorithm === 'binary') {
        newSteps = binarySearch(array, target);
      }
    } else if (category === 'tree') {
      switch (algorithm) {
        case 'preorder':
          newSteps = preorderTraversal(treeData);
          break;
        case 'inorder':
          newSteps = inorderTraversal(treeData);
          break;
        case 'postorder':
          newSteps = postorderTraversal(treeData);
          break;
        case 'levelorder':
          newSteps = levelOrderTraversal(treeData);
          break;
      }
    } else if (category === 'graph') {
      if (algorithm === 'bfs') {
        newSteps = bfsTraversal(graphData, 0);
      } else if (algorithm === 'dfs') {
        newSteps = dfsTraversal(graphData, 0);
      } else if (algorithm === 'dijkstra') {
        newSteps = dijkstra(weightedGraphData, 0);
      }
    }

    setSteps(newSteps);
  };

  const generateNewArray = () => {
    setIsCustomArray(false); // Clear custom flag
    setCustomArrayData([]); // Clear custom data
    setArray(generateRandomArray(arraySize));
    resetVisualization();
  };

  const handleCustomInput = () => {
    try {
      if (category === 'sorting' || category === 'searching') {
        const values = customInput.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
        if (values.length > 0) {
          setArraySize(values.length);
          setArray(values);
          setCustomArrayData(values); // Store custom array
          setIsCustomArray(true); // Mark as custom
          setShowCustomInput(false);
          setCustomInput('');
          // Reset visualization state without generating new array
          setIsPlaying(false);
          setCurrentStep(0);
          setSteps([]);
          setHighlightedIndices([]);
          setSortedIndices([]);
          setComparisonCount(0);
          setSwapCount(0);
          setSearchTarget(null);
          setNotification('Custom array applied successfully!');
          setTimeout(() => setNotification(''), 3000);
          setCurrentExplanation('');
        }
      }
    } catch (e) {
      alert('Invalid input format. Use comma-separated numbers.');
    }
  };

  const exportData = () => {
    const data = {
      category,
      algorithm,
      array: category === 'sorting' || category === 'searching' ? array : null,
      tree: category === 'tree' ? treeData : null,
      graph: category === 'graph' ? graphData : null,
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dsa-${category}-${algorithm}-${Date.now()}.json`;
    link.click();
  };

  const shareVisualization = () => {
    const shareData = {
      category,
      algorithm,
      arraySize,
      array: array.slice(0, 10).join(',')
    };
    const shareUrl = `${window.location.origin}?data=${btoa(JSON.stringify(shareData))}`;
    navigator.clipboard.writeText(shareUrl);
    setNotification('Share link copied to clipboard!');
    setTimeout(() => setNotification(''), 3000);
  };

  const getBarColor = (index) => {
    if (sortedIndices.includes(index)) return '#10b981';
    if (highlightedIndices.includes(index)) return '#f59e0b';
    return darkMode ? '#6366f1' : '#8b5cf6';
  };

  const renderVisualization = () => {
    if (category === 'sorting' || category === 'searching') {
      return (
        <div className="visualization-area">
          {array.map((value, index) => (
            <div
              key={index}
              className="bar"
              style={{
                height: `${(value / 100) * 300}px`,
                backgroundColor: getBarColor(index),
              }}
              title={`Value: ${value}`}
            >
              {arraySize <= 50 && <span>{value}</span>}
            </div>
          ))}
        </div>
      );
    } else if (category === 'tree') {
  return (
    <div className="tree-visualization">
      {/* 👇 CHANGED: Removed fixed width/height, added viewBox */}
      <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
        <TreeNode node={treeData} visitedNodes={visitedNodes} darkMode={darkMode} x={300} y={50} />
      </svg>
    </div>
  );
    } else if (category === 'graph') {
      return (
        <div className="graph-visualization">
          <GraphView 
            graph={algorithm === 'dijkstra' ? {} : graphData} 
            visitedNodes={visitedNodes} 
            darkMode={darkMode}
            isWeighted={algorithm === 'dijkstra'}
            graphData={algorithm === 'dijkstra' ? weightedGraphData : null}
          />
        </div>
      );
    }
  };

  const getAlgorithmDescription = (algo, cat) => {
    const descriptions = {
      sorting: {
        bubble: "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order. Named for the way smaller elements 'bubble' to the top.",
        selection: "Selection Sort divides the input into sorted and unsorted portions. It repeatedly finds the minimum element from the unsorted portion and moves it to the end of the sorted portion.",
        insertion: "Insertion Sort builds the final sorted array one item at a time. It iterates through the array and inserts each element into its correct position in the sorted portion.",
        merge: "Merge Sort is a divide-and-conquer algorithm that divides the array into two halves, recursively sorts them, and then merges the two sorted halves.",
        quick: "Quick Sort picks an element as a pivot and partitions the array around it, placing smaller elements to the left and greater elements to the right.",
        heap: "Heap Sort builds a max heap from the array and repeatedly extracts the maximum element, placing it at the end of the sorted portion.",
      },
      searching: {
        linear: "Linear Search sequentially checks each element of the list until a match is found or the whole list has been searched. Best for small or unsorted datasets.",
        binary: "Binary Search efficiently searches a sorted array by repeatedly dividing the search interval in half, comparing the target to the middle element.",
      },
      tree: {
        preorder: "Preorder Traversal visits nodes in Root-Left-Right order. Useful for creating a copy of the tree or getting prefix expressions.",
        inorder: "Inorder Traversal visits nodes in Left-Root-Right order. For binary search trees, this visits nodes in ascending order.",
        postorder: "Postorder Traversal visits nodes in Left-Right-Root order. Useful for deleting a tree or getting postfix expressions.",
        levelorder: "Level Order Traversal visits nodes level by level from top to bottom and left to right. Uses a queue and is also known as Breadth-First Search.",
      },
      graph: {
        bfs: "Breadth-First Search explores the graph level by level. Uses a queue and is ideal for finding shortest paths in unweighted graphs.",
        dfs: "Depth-First Search explores as far as possible along each branch before backtracking. Uses recursion or a stack.",
        dijkstra: "Dijkstra's Algorithm finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights.",
      }
    };

    return descriptions[cat]?.[algo] || "Algorithm description not available.";
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          overflow-x: hidden;
        }

        .app {
          min-height: 100vh;
          transition: all 0.3s ease;
        }

        .app.dark {
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          color: #e2e8f0;
        }

        .app.light {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
          color: #1e293b;
        }

        .navbar {
          backdrop-filter: blur(20px);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .dark .navbar {
          background: rgba(15, 23, 42, 0.8);
        }

        .light .navbar {
          background: rgba(255, 255, 255, 0.8);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .dark .icon-btn {
          background: rgba(99, 102, 241, 0.2);
          color: #e2e8f0;
        }

        .light .icon-btn {
          background: rgba(139, 92, 246, 0.2);
          color: #1e293b;
        }

        .icon-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
        }

        .main-container {
          display: flex;
          height: calc(100vh - 73px); /* Adjusted for navbar height */
          overflow: hidden;
        }

        .sidebar {
          width: 280px;
          padding: 2rem;
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          overflow-y: auto;
          flex-shrink: 0; /* Prevents sidebar from shrinking */
        }

        .dark .sidebar {
          background: rgba(15, 23, 42, 0.5);
        }

        .light .sidebar {
          background: rgba(255, 255, 255, 0.5);
        }

        .sidebar.closed {
          width: 0;
          padding: 0;
          opacity: 0;
          border-right: none;
        }

        .section-title {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1rem;
          opacity: 0.7;
        }

        .category-tabs {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .category-tab {
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          text-align: left;
        }

        .dark .category-tab {
          background: rgba(99, 102, 241, 0.1);
          color: #e2e8f0;
        }

        .light .category-tab {
          background: rgba(139, 92, 246, 0.1);
          color: #1e293b;
        }

        .category-tab.active {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: white;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
        }

        .category-tab:hover:not(.active) {
          transform: translateX(5px);
        }

        .algo-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .algo-item {
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          font-size: 0.9rem;
        }

        .dark .algo-item {
          background: rgba(71, 85, 105, 0.2);
          color: #cbd5e1;
        }

        .light .algo-item {
          background: rgba(148, 163, 184, 0.2);
          color: #475569;
        }

        .algo-item.active {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: white;
          font-weight: 500;
        }

        .algo-item:hover:not(.active) {
          transform: translateX(5px);
        }

        .content {
          flex: 1;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          overflow-y: auto;
        }

        .glass-card {
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .dark .glass-card {
          background: rgba(30, 41, 59, 0.5);
        }

        .light .glass-card {
          background: rgba(255, 255, 255, 0.7);
        }

        .visualization-area,
        .tree-visualization,
        .graph-visualization {
          min-height: 400px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 4px;
          padding: 2rem;
          border-radius: 15px; /* Added for consistency */
        }
        
        .tree-visualization,
        .graph-visualization {
          align-items: center; /* Override for non-bar visualizations */
        }

        .bar {
          flex: 1;
          max-width: 50px;
          border-radius: 8px 8px 0 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          position: relative;
        }

        .bar > span {
          position: absolute;
          bottom: 5px;
          width: 100%;
          text-align: center;
          font-size: 0.8rem;
          font-weight: bold;
          color: white;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .bar:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }

        .notification {
          text-align: center;
          padding: 0.75rem 1rem;
          margin: 0 0 1rem 0;
          border-radius: 10px;
          background-color: rgba(16, 185, 129, 0.2);
          color: #6ee7b7;
          font-weight: 500;
          animation: fadeIn 0.5s ease-in-out;
        }

        .explanation-box {
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-top: 1rem;
          min-height: 60px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .dark .explanation-box {
          background: rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .light .explanation-box {
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .controls-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .control-group {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .control-label {
          font-size: 0.875rem;
          font-weight: 500;
          opacity: 0.8;
          min-width: 100px;
        }

        .slider {
          flex: 1;
          min-width: 200px;
          height: 8px;
          border-radius: 10px;
          outline: none;
          -webkit-appearance: none;
        }

        .dark .slider {
          background: rgba(71, 85, 105, 0.5);
        }

        .light .slider {
          background: rgba(203, 213, 225, 0.5);
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center; /* Center button content */
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: white;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(99, 102, 241, 0.4);
        }

        .btn-secondary {
          backdrop-filter: blur(10px);
        }

        .dark .btn-secondary {
          background: rgba(71, 85, 105, 0.5);
          color: #e2e8f0;
        }

        .light .btn-secondary {
          background: rgba(203, 213, 225, 0.5);
          color: #1e293b;
        }

        .btn-secondary:hover {
          transform: translateY(-2px);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .btn-small {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .info-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); /* Adjusted minmax for better fit */
          gap: 1rem;
        }

        .info-card {
          padding: 1.5rem;
          border-radius: 15px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dark .info-card {
          background: rgba(71, 85, 105, 0.3);
        }

        .light .info-card {
          background: rgba(255, 255, 255, 0.5);
        }

        .info-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          opacity: 0.7;
          margin-bottom: 0.5rem;
        }

        .info-value {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .search-input {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          font-size: 1rem;
          width: 100%; /* Make search input full width within its container */
          max-width: 250px; /* Set a max-width */
        }

        .dark .search-input {
          background: rgba(71, 85, 105, 0.3);
          color: #e2e8f0;
        }

        .light .search-input {
          background: rgba(255, 255, 255, 0.5);
          color: #1e293b;
        }

        .search-input:focus {
          outline: none;
          border-color: #6366f1;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dark .modal-content {
          background: rgba(30, 41, 59, 0.95);
        }

        .light .modal-content {
          background: rgba(255, 255, 255, 0.95);
        }

        .step-controls {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }

        .step-info {
          font-size: 0.875rem;
          opacity: 0.8;
          min-width: 120px;
          text-align: center;
          font-weight: 500;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pulse {
          animation: pulse 1s infinite;
        }

        /* --- Responsive Design --- */

        /* Laptops and Large Tablets */
        @media (max-width: 1024px) {
          .sidebar {
            width: 250px;
          }
          .content {
            padding: 1.5rem;
          }
          .glass-card {
            padding: 1.5rem;
          }
          .visualization-area,
          .tree-visualization,
          .graph-visualization {
            padding: 1.5rem;
          }
        }
        
        /* Tablets */
        @media (max-width: 768px) {
          .main-container {
            flex-direction: column;
            height: auto;
          }
        
          .sidebar {
            position: fixed;
            left: 0;
            top: 65px; /* Adjust based on new navbar height */
            height: calc(100% - 65px);
            z-index: 999;
            width: 280px;
            transform: translateX(-100%);
            border-right: 1px solid rgba(255, 255, 255, 0.1); /* Ensure border is visible */
          }
        
          .sidebar.closed {
            transform: translateX(-100%);
            width: 280px; /* Keep width for animation */
            padding: 2rem;
            opacity: 1;
          }
        
          .sidebar:not(.closed) {
            transform: translateX(0);
          }
        
          .content {
            padding: 1.5rem 1rem;
            width: 100%;
          }
        
          .navbar {
            padding: 0.75rem 1.5rem;
          }
          
          .main-container {
            height: calc(100vh - 65px); /* Recalculate based on navbar height */
          }
          
          .logo {
            font-size: 1.25rem;
          }
        
          .control-group {
            flex-direction: column;
            align-items: stretch;
            gap: 1.5rem;
          }

          .slider {
            min-width: 100%;
          }

          .bar {
            max-width: 30px;
          }

          .visualization-area,
          .tree-visualization,
          .graph-visualization {
            min-height: 350px;
          }

          .info-value {
            font-size: 1.25rem;
          }
        }

        /* Mobile Phones */
        @media (max-width: 480px) {
          .navbar {
            padding: 0.75rem 1rem;
          }

          .main-container {
            height: calc(100vh - 65px);
          }

          .sidebar {
            top: 65px;
            height: calc(100% - 65px);
            width: 80vw; /* Make sidebar take most of the screen width */
          }
        
          .sidebar.closed {
            width: 80vw;
          }

          .content {
            padding: 1rem;
            gap: 1rem;
          }

          .glass-card {
            padding: 1rem;
            border-radius: 15px;
          }
          
          .visualization-area,
          .tree-visualization,
          .graph-visualization {
            min-height: 280px;
            padding: 1rem;
            gap: 2px;
          }

          .bar {
            max-width: 20px;
          }
          
          .bar > span {
            font-size: 0.7rem;
            bottom: 2px;
          }
          
          .btn {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
          }

          .step-controls {
            gap: 0.5rem;
          }
        }
          @media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  .nav-controls {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .icon-btn {
    width: 36px;
    height: 36px;
  }

  .search-input {
    max-width: 180px;
  }

  .logo {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .navbar {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
  }

  .nav-controls {
    justify-content: center;
    flex-wrap: wrap;
  }
    .visualization-area,
.tree-visualization,
.graph-visualization {
  min-height: 400px;
  display: flex;
  align-items: center;        
  justify-content: center;
  gap: 4px;
  padding: 2rem;
  border-radius: 15px;
  overflow: auto;              
  max-height: 600px;           
  width: 100%;
}


.tree-visualization svg,
.graph-visualization svg {
  max-width: none;            
  height: auto;
}


.tree-visualization::-webkit-scrollbar,
.graph-visualization::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.tree-visualization::-webkit-scrollbar-thumb,
.graph-visualization::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border-radius: 10px;
}



.tree-visualization,
.graph-visualization {
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 1rem;
  border-radius: 15px;
  overflow: auto;
  max-height: 600px;
  width: 100%;
}

.tree-visualization svg,
.graph-visualization svg {
  max-width: none;
  min-width: 400px;
  height: auto;
}

.tree-visualization::-webkit-scrollbar,
.graph-visualization::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.tree-visualization::-webkit-scrollbar-thumb,
.graph-visualization::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 10px;
}


@media (max-width: 480px) {
  .controls-panel {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .control-group {
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }

  .control-group input,
  .control-group button {
    flex: 1 1 auto;
    min-width: 120px;
  }
}

.visualization-area,
.tree-visualization,
.graph-visualization {
  min-height: 300px;
  max-height: 70vh;         
  display: flex;
  align-items: center;      
  justify-content: center;
  padding: 1rem;
  overflow: auto;           
  flex-wrap: wrap;
}


.tree-visualization svg,
.graph-visualization svg {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}


.bar {
  max-width: min(50px, 8vw);  
}


@media (max-width: 480px) {
  .visualization-area,
  .tree-visualization,
  .graph-visualization {
    min-height: 220px;
    max-height: 60vh;
    padding: 0.5rem;
    gap: 2px;
  }

  .bar {
    max-width: min(25px, 6vw);
  }
}
}
`}</style>

      <nav className="navbar">
        <div className="logo">
          <Code size={32} />
          <span>AlgoFlow</span>
        </div>
        <div className="nav-controls">
          <button className="icon-btn" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle Sidebar">
            <Menu size={20} />
          </button>
          <button className="icon-btn" onClick={exportData} title="Export Data">
            <Download size={20} />
          </button>
          <button className="icon-btn" onClick={shareVisualization} title="Share">
            <Share2 size={20} />
          </button>
          <button className="icon-btn" onClick={() => setShowExplanation(!showExplanation)} title="Toggle Explanations">
            {showExplanation ? <Lightbulb size={20} /> : <HelpCircle size={20} />}
          </button>
          <button className="icon-btn" onClick={() => setShowCustomInput(!showCustomInput)} title="Custom Input">
            <Upload size={20} />
          </button>
          <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle Theme">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      <div className="main-container">
        <aside className={`sidebar ${!sidebarOpen ? 'closed' : ''}`}>
          <div className="section-title">Categories</div>
          <div className="category-tabs">
            <button
              className={`category-tab ${category === 'sorting' ? 'active' : ''}`}
              onClick={() => {
                setCategory('sorting');
                setAlgorithm('bubble');
              }}
            >
              Sorting Algorithms
            </button>
            <button
              className={`category-tab ${category === 'searching' ? 'active' : ''}`}
              onClick={() => {
                setCategory('searching');
                setAlgorithm('linear');
              }}
            >
              Searching Algorithms
            </button>
            <button
              className={`category-tab ${category === 'tree' ? 'active' : ''}`}
              onClick={() => {
                setCategory('tree');
                setAlgorithm('preorder');
              }}
            >
              Tree Traversals
            </button>
            <button
              className={`category-tab ${category === 'graph' ? 'active' : ''}`}
              onClick={() => {
                setCategory('graph');
                setAlgorithm('bfs');
              }}
            >
              Graph Traversals
            </button>
          </div>

          <div className="section-title">Algorithms</div>
          <div className="algo-list">
            {algorithms[category]?.map(algo => (
              <button
                key={algo.id}
                className={`algo-item ${algorithm === algo.id ? 'active' : ''}`}
                onClick={() => setAlgorithm(algo.id)}
              >
                {algo.name}
              </button>
            ))}
          </div>
        </aside>

        <main className="content">
          <div className="glass-card">
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                {currentAlgo?.name}
              </h2>
              {category === 'searching' && (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', opacity: '0.8' }}>Target:</span>
                  <input
                    type="number"
                    className="search-input"
                    value={searchTarget || ''}
                    onChange={(e) => setSearchTarget(parseInt(e.target.value) || null)}
                    placeholder="Enter target"
                    style={{ width: '120px' }}
                  />
                </div>
              )}
            </div>

            {notification && <div className="notification">{notification}</div>}

            {renderVisualization()}

            {showExplanation && currentExplanation && (
              <div className="explanation-box">
                <Lightbulb size={20} style={{ flexShrink: 0, color: '#f59e0b' }} />
                <span>{currentExplanation}</span>
              </div>
            )}
          </div>

          <div className="glass-card controls-panel">
            <div className="control-group">
              <button
                className="btn btn-primary"
                onClick={isPlaying ? pauseVisualization : startVisualization}
                disabled={currentStep >= steps.length && steps.length > 0}
              >
                {isPlaying ? <><Pause size={20} />Pause</> : <><Play size={20} />Start</>}
              </button>
              <button className="btn btn-secondary" onClick={resetVisualization}>
                <RotateCcw size={20} />
                Reset
              </button>
              {(category === 'sorting' || category === 'searching') && (
                <button className="btn btn-secondary" onClick={generateNewArray}>
                  <Plus size={20} />
                  New Array
                </button>
              )}
            </div>

            <div className="step-controls">
              <button 
                className="btn btn-secondary btn-small" 
                onClick={prevStep}
                disabled={currentStep === 0 || isPlaying}
              >
                <ChevronLeft size={16} />
                Prev
              </button>
              <div className="step-info">
                Step {currentStep} / {steps.length}
              </div>
              <button 
                className="btn btn-secondary btn-small" 
                onClick={nextStep}
                disabled={currentStep >= steps.length || isPlaying}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>

            {steps.length > 0 && (
              <div className="control-group">
                <span className="control-label">Jump to Step:</span>
                <input
                  type="range"
                  className="slider"
                  min="0"
                  max={steps.length}
                  value={currentStep}
                  onChange={(e) => jumpToStep(parseInt(e.target.value))}
                  disabled={isPlaying}
                />
              </div>
            )}

            {(category === 'sorting' || category === 'searching') && (
              <div className="control-group">
                <span className="control-label">Array Size: {arraySize}</span>
                <input
                  type="range"
                  className="slider"
                  min="5"
                  max="100"
                  value={arraySize}
                  onChange={(e) => {
                    const newSize = parseInt(e.target.value);
                    setArraySize(newSize);
                    if (!isCustomArray) {
                      setArray(generateRandomArray(newSize));
                    }
                  }}
                  disabled={isPlaying || isCustomArray}
                />
                {isCustomArray && (
                  <span style={{ fontSize: '0.75rem', opacity: '0.7', fontStyle: 'italic' }}>
                    (Custom array active)
                  </span>
                )}
              </div>
            )}

            <div className="control-group">
              <span className="control-label">Speed: {speed}%</span>
              <input
                type="range"
                className="slider"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="glass-card">
            <div className="info-panel">
              <div className="info-card">
                <div className="info-label">Time Complexity</div>
                <div className="info-value">{currentAlgo?.time}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Space Complexity</div>
                <div className="info-value">{currentAlgo?.space}</div>
              </div>
              <div className="info-card">
                <div className="info-label">
                  {category === 'tree' || category === 'graph' ? 'Visits' : 'Comparisons'}
                </div>
                <div className="info-value">{comparisonCount}</div>
              </div>
              <div className="info-card">
                <div className="info-label">
                  {category === 'sorting' ? 'Swaps' : category === 'searching' ? 'Operations' : 'Discoveries'}
                </div>
                <div className="info-value">{swapCount}</div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <div className="section-title">Legend</div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '4px', 
                    background: darkMode ? '#6366f1' : '#8b5cf6' 
                  }}></div>
                  <span style={{ fontSize: '0.875rem' }}>
                    {category === 'tree' || category === 'graph' ? 'Unvisited' : 'Unsorted'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '4px', 
                    background: '#f59e0b' 
                  }}></div>
                  <span style={{ fontSize: '0.875rem' }}>
                    {category === 'tree' || category === 'graph' ? 'Current' : 'Comparing'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '4px', 
                    background: '#10b981' 
                  }}></div>
                  <span style={{ fontSize: '0.875rem' }}>
                    {category === 'sorting' ? 'Sorted' : category === 'searching' ? 'Found' : 'Visited'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                About {currentAlgo?.name}
              </h3>
            </div>
            <div style={{ lineHeight: '1.6', opacity: '0.9' }}>
              {getAlgorithmDescription(algorithm, category)}
            </div>
          </div>
        </main>
      </div>

      {showCustomInput && (
        <div className="modal-overlay" onClick={() => setShowCustomInput(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>
              Custom Input
            </h3>
            <p style={{ marginBottom: '1rem', opacity: '0.8', fontSize: '0.875rem' }}>
              Enter comma-separated numbers for your custom array:
            </p>
            <input
              type="text"
              className="search-input"
              style={{ width: '100%', marginBottom: '1rem' }}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-secondary btn-small" 
                onClick={() => setShowCustomInput(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary btn-small" 
                onClick={handleCustomInput}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
