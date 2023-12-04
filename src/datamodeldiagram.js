import React, { useCallback, useState,useEffect,useRef  } from 'react';
import 'reactflow/dist/style.css';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Sidebar from './sidebar';
import './App.css';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';



const RectangleNode = ({ data }) => {
  return <div style={{ padding: 10, border: '1px solid black', backgroundColor: 'white' }}>{data.label}</div>;
};

const CircleNode = ({ data }) => {
  return (
    <div 
      style={{ 
        padding: 10, 
        borderRadius: '50%', 
        border: '1px solid black', 
        backgroundColor: 'white', 
        width: 200, 
        height: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {data.label}
    </div>
  );
};

const TriangleNode = ({ data }) => {
  return <div style={{ width: 0, height: 0, borderLeft: '50px solid transparent', borderRight: '50px solid transparent', borderBottom: '100px solid black' }}>{data.label}</div>;
};


const nodeTypes = {
    rectangle: RectangleNode,
    circle: CircleNode,
    triangle: TriangleNode
  };



const initialNodes = [
  { id: '1',position: { x: 250, y: 0 }, data: { label: 'Auth System' } },
  { id: '2', position: { x: 100, y: 150 }, data: { label: 'Profile Page' } },
  { id: '3', position: { x: 250, y: 150 }, data: { label: 'History Page' } },
  { id: '4', position: { x: 400, y: 150 }, data: { label: 'Bet Page' } },
  { id: '5', position: { x: 550, y: 150 }, data: { label: 'Bet Page2' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e1-4', source: '1', target: '4' },
];


const defaultColors = ['#FF5733', '#33FF57', '#3357FF', '#FFFF33', '#FF33FF', '#33FFFF'];

export default function DataModelDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeName, setNodeName] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerPosition, setColorPickerPosition] = useState({ x: 0, y: 0 });
  const [usedColors, setUsedColors] = useState(new Set());
  const [customColor, setCustomColor] = useState('#000000');
  const [reactFlowInstance, setReactFlowInstance] = useState(null);


  const reactFlowWrapper = useRef(null);
  let id = 0;
  const getId = () => `dndnode_${id++}`;

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
  
      if (!reactFlowInstance || !reactFlowWrapper.current) {
        return;
      }
  
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }
  
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
  
      // Generate a label based on the node type
      const label = type.charAt(0).toUpperCase() + type.slice(1) + ' Node';
  
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: label },
      };
  
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );
  
  const exportDiagramAsPdf = async () => {
    const flowContainer = document.querySelector('.react-flow__container');
    if (flowContainer) {
        const canvas = await html2canvas(flowContainer);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('diagram.pdf');
    }
};

const onDragOver = useCallback((event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
}, []);



const onDragStart = useCallback((event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  useEffect(() => {
    const colorsInUse = new Set(nodes.map(node => node.style?.backgroundColor).filter(Boolean));
    setUsedColors(colorsInUse);
  }, [nodes]);


    const onConnect = useCallback(
      (params) => setEdges((eds) => addEdge(params, eds)),
      [setEdges],
    );
  
    const onNodeClick = useCallback((event, node) => {
      setSelectedNode(node);
      setNodeName(node.data.label);
      setShowColorPicker(true);
      setColorPickerPosition({ x: event.clientX, y: event.clientY });
    }, []);

    const changeNodeColor = useCallback((color) => {
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === selectedNode.id) {
              return {
                ...n,
                style: { ...n.style, backgroundColor: color }
              };
            }
            return n;
          })
        );
        setShowColorPicker(false);
      }, [selectedNode, setNodes]);
    
      const onCustomColorChange = useCallback((e) => {
        setCustomColor(e.target.value);
      }, []);
    
      const onCustomColorKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
          changeNodeColor(customColor);
        }
      }, [customColor, changeNodeColor]);
    
      const onCustomColorBlur = useCallback(() => {
        changeNodeColor(customColor);
      }, [customColor, changeNodeColor]);
  
    const updateNodeName = useCallback(() => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === selectedNode.id) {
            return {
              ...n,
              data: { ...n.data, label: nodeName }
            };
          }
          return n;
        })
      );
      setSelectedNode(null);
      setNodeName('');
    }, [nodeName, selectedNode, setNodes]);
  
    const addNewNode = useCallback(() => {
      const newNodeId = `node_${nodes.length + 1}`;
      const newNode = {
        id: newNodeId,
        data: { label: `Node ${nodes.length + 1}` },
        position: { x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 50 } // Adjust for node size
      };
      setNodes((nds) => nds.concat(newNode));
      setSelectedNode(newNode);
      setNodeName(newNode.data.label);
    }, [nodes, setNodes]);
  
    return (
      <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
        <Sidebar onDragStart={onDragStart} />
        <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }}>
          {/* Color Picker */}
          {showColorPicker && (
            <div style={{ position: 'absolute', left: colorPickerPosition.x, top: colorPickerPosition.y, zIndex: 5, padding: '10px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.2)' }}>
              {([...usedColors].length ? [...usedColors] : defaultColors).map(color => (
                <div key={color} style={{ background: color, width: '25px', height: '25px', display: 'inline-block', cursor: 'pointer', margin: '5px' }}
                  onClick={() => changeNodeColor(color)} />
              ))}
              <input type="color" value={customColor} onChange={onCustomColorChange} onKeyDown={onCustomColorKeyDown} onBlur={onCustomColorBlur} />
            </div>
          )}
          {/* Node Name Input */}
          {selectedNode && (
            <div style={{ position: 'absolute', zIndex: 4, left: 10, top: 10 }}>
              <input
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                onBlur={updateNodeName}
                style={{ padding: '5px' }}
              />
            </div>
          )}
          {/* Add Node and Export PDF Button */}
          <button onClick={exportDiagramAsPdf} style={{ position: 'absolute', right: 20, top: 20, zIndex: 4 }}>Export as PDF</button>
          <button onClick={addNewNode} style={{ position: 'absolute', left: 20, bottom: 20, zIndex: 4, padding: '10px' }}>Add Node</button>
          {/* React Flow */}
          <ReactFlow
            onInit={setReactFlowInstance}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            fitView
            nodeTypes={nodeTypes}
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    );
          }    