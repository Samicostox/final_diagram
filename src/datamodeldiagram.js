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
  Handle,
} from 'reactflow';




const RectangleNode = ({ id, data }) => {
  const nodeStyle = {
    padding: 10,
    border: '1px solid black',
    backgroundColor: data.style?.backgroundColor || 'white',
    color: 'black',
    fontSize: '14px', // Adjust the font size
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200, // Adjust the width as needed
    height: 100, // Adjust the height as needed
  };

  return (
    <div style={nodeStyle}>
      <Handle type="target" position="top" id={`${id}_t`} />
      <Handle type="source" position="right" id={`${id}_r`} />
      <Handle type="target" position="bottom" id={`${id}_b`} />
      <Handle type="source" position="left" id={`${id}_l`} />

      {data.label}
    </div>
  );
};

const CircleNode = ({ id, data }) => {
  const nodeStyle = {
    padding: 10,
    borderRadius: '50%',
    border: '1px solid black',
    backgroundColor: data.style?.backgroundColor || 'white',
    color: 'black',
    width: 50,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    fontSize : '12px'

  };

  return (
    <div style={nodeStyle}>
      {/* Top Handle */}
      <Handle type="target" position="top" id={`${id}_t`} style={{ borderRadius: '50%' }} />
      {/* Right Handle */}
      <Handle type="source" position="right" id={`${id}_r`} style={{ borderRadius: '50%' }} />
      {/* Bottom Handle */}
      <Handle type="target" position="bottom" id={`${id}_b`} style={{ borderRadius: '50%' }} />
      {/* Left Handle */}
      <Handle type="source" position="left" id={`${id}_l`} style={{ borderRadius: '50%' }} />

      {data.label}
    </div>
  );
};
const TriangleNode = ({ id, data }) => {
  const triangleHeight = 100; // Height of the triangle
  const triangleBase = 100; // Base of the triangle

  const nodeStyle = {
    width: 0,
    height: 0,
    borderLeft: `${triangleBase / 2}px solid transparent`,
    borderRight: `${triangleBase / 2}px solid transparent`,
    borderBottom: `${triangleHeight}px solid ${data.style?.backgroundColor || 'white'}`,
    position: 'relative',
  };

  const labelStyle = {
    position: 'absolute',
    top: `${triangleHeight / 2}px`, // Adjust to center in the triangle
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: 'black',
    fontSize: '14px',
    pointerEvents: 'none',
    width: `${triangleBase}px`, // Ensure the text width is the same as the base of the triangle
  };

  return (
    <div style={nodeStyle}>
      {/* Top (Middle of Base) Handle */}
      <Handle type="target" position="top" id={`${id}_t`} style={{ top: `${triangleHeight}px`, left: '50%', transform: 'translateX(-50%)' }} />
      {/* Right (Middle of Right Side) Handle */}
      <Handle type="source" position="right" id={`${id}_r`} style={{ top: `${triangleHeight / 2}px`, right: `-${triangleBase / 4}px` }} />
      {/* Left (Middle of Left Side) Handle */}
      <Handle type="source" position="left" id={`${id}_l`} style={{ top: `${triangleHeight / 2}px`, left: `-${triangleBase / 4}px` }} />

      <div style={labelStyle}>{data.label}</div>
    </div>
  );
};


const nodeTypes = {
    rectangle: RectangleNode,
    circle: CircleNode,
    triangle: TriangleNode
  };


/*
  const initialNodes = [
    { id: '1', type: 'circle', position: { x: 100, y: 50 }, data: { label: 'Start/Auth Page' ,style: { backgroundColor: '#f9d342'}} },
    { id: '2', type: 'triangle', position: { x: 300, y: 50 }, data: { label: 'Auth System',style: { backgroundColor: '#f9d342'}  }, style: { } },
    { id: '3', position: { x: 500, y: 50 }, data: { label: 'Home Page' }, style: { backgroundColor: '#f5cac3' } },
    { id: '4', position: { x: 100, y: 200 }, data: { label: 'Bet Page 1' }, style: { backgroundColor: '#84a59d' } },
    { id: '5', position: { x: 300, y: 200 }, data: { label: 'Bet Page 2' }, style: { backgroundColor: '#f28482' } },
    { id: '6', position: { x: 500, y: 200 }, data: { label: 'Profile Page' }, style: { backgroundColor: '#9d8189' } },
    { id: '7', position: { x: 100, y: 350 }, data: { label: 'Settings' }, style: { backgroundColor: '#6d6875' } },
    { id: '8', position: { x: 300, y: 350 }, data: { label: 'Support' }, style: { backgroundColor: '#e56b6f' } },
    { id: '9', position: { x: 500, y: 350 }, data: { label: 'Log Out' }, style: { backgroundColor: '#355070' } },
    { id: '10', type: 'triangle', position: { x: 700, y: 50 }, data: { label: 'Sign Up Page',style: { backgroundColor: '#f9d342'} }, style: { borderBottom: '#cdb4db' } }
  ];
  const initialEdges = [
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e2-10', source: '2', target: '10' },
    { id: 'e3-4', source: '3', target: '4' },
    { id: 'e3-5', source: '3', target: '5' },
    { id: 'e3-6', source: '3', target: '6' },
    { id: 'e4-7', source: '4', target: '7' },
    { id: 'e5-8', source: '5', target: '8' },
    { id: 'e6-9', source: '6', target: '9' }
  ];
  
  */
  // You can add more edges as needed to represent additional navigation paths.
  const initialNodes = [
    { id: 'start', type: 'input', position: { x: 150, y: 5 }, data: { label: 'Start' }, style: { backgroundColor: '#d3d3d3' } },
    { id: 'login', position: { x: 150, y: 50 }, data: { label: 'Login' }, style: { backgroundColor: '#add8e6' } },
    { id: 'success_login', type: 'triangle', position: { x: 150, y: 150 }, data: { label: 'Success', style: { backgroundColor: '#90ee90' } } },
    { id: 'fail_login', type: 'triangle', position: { x: 150, y: 250 }, data: { label: 'Fail' , style: { backgroundColor: '#ffcccb' }},  },
    { id: 'register', position: { x: 300, y: 50 }, data: { label: 'Register' }, style: { backgroundColor: '#add8e6' } },
    { id: 'email_verification', position: { x: 450, y: 50 }, data: { label: 'Email Verification' }, style: { backgroundColor: '#add8e6' } },
    { id: 'admin_page', position: { x: 150, y: 350 }, data: { label: 'Admin Page' }, style: { backgroundColor: '#ffffe0' } },
    { id: 'navbar', type: 'rectangle', position: { x: 300, y: 350 }, data: { label: '' , style: { backgroundColor: '#d3d3d3', width: 300, height: 50 }} }, // Navbar as a visual element
    { id: 'dashboard_page', position: { x: 450, y: 350 }, data: { label: 'Dashboard Page' }, style: { backgroundColor: '#ffffe0' } },
    { id: 'ongoing_complaints', position: { x: 150, y: 450 }, data: { label: 'Ongoing Complaints' }, style: { backgroundColor: '#ffffe0' } },
    { id: 'account_venue_form', position: { x: 150, y: 550 }, data: { label: 'Account Venue Form' }, style: { backgroundColor: '#ffffe0' } },
  ];
  
  const initialEdges = [
    { id: 'e-start-login', source: 'start', target: 'login', animated: true },
    { id: 'e-login-success_login', source: 'login', target: 'success_login', animated: true },
    { id: 'e-login-fail_login', source: 'login', target: 'fail_login', animated: true },
    { id: 'e-success_login-admin_page', source: 'success_login', target: 'admin_page', animated: true },
    { id: 'e-fail_login-register', source: 'fail_login', target: 'register', animated: true },
    { id: 'e-register-email_verification', source: 'register', target: 'email_verification', animated: true },
    { id: 'e-admin_page-ongoing_complaints', source: 'admin_page', target: 'ongoing_complaints', animated: true },
    { id: 'e-admin_page-account_venue_form', source: 'admin_page', target: 'account_venue_form', animated: true },
    { id: 'e-admin_page-dashboard_page', source: 'admin_page', target: 'dashboard_page', animated: true },
  ];
  
  // Note: Further nodes and edges can be added for additional functionalities and steps.
  
  
  // You can further customize the nodes and edges with styles, labels, and more.
  /*
  const initialNodes = [
    // Authentication Flow
    { id: '1', type: 'circle', position: { x: 50, y: 25 }, data: { label: 'Start' , style: { backgroundColor: '#f9d342' }} },
    { id: '2', position: { x: 200, y: 25 }, data: { label: 'Login/Register' } , style: { backgroundColor: '#f9844a' }},
    { id: '3', type: 'circle', position: { x: 350, y: 25 }, data: { label: 'Forgot Password' , style: { backgroundColor: '#f5cac3' }} },
    { id: '4', type: 'circle', position: { x: 500, y: 25 }, data: { label: 'Email Verification' , style: { backgroundColor: '#84a59d' }} },
  
    // Report/Review Flow
    { id: '5', type: 'triangle', position: { x: 50, y: 150 }, data: { label: 'Review/Report Venue', style: { backgroundColor: '#f28482' } } },
    { id: '6', position: { x: 200, y: 150 }, data: { label: 'Store Incident Reports' }, style: { backgroundColor: '#9d8189' } },
    { id: '7', position: { x: 350, y: 150 }, data: { label: 'Store Venue Info' }, style: { backgroundColor: '#6d6875' } },
    { id: '8', position: { x: 500, y: 150 }, data: { label: 'Filter Reports' }, style: { backgroundColor: '#e56b6f' } },
  
    // Venues Flow
    { id: '9', position: { x: 50, y: 275 }, data: { label: 'Venues Page' }, style: { backgroundColor: '#355070' } },
    { id: '10', type: 'triangle', position: { x: 200, y: 275 }, data: { label: 'Detailed Venue Page' , style: { backgroundColor: '#cdb4db' }} },
  
    // Profile Flow
    { id: '11', type: 'rectangle', position: { x: 350, y: 275 }, data: { label: 'Profile Page', style: { backgroundColor: '#ffcad4' } } },
    { id: '12', position: { x: 500, y: 275 }, data: { label: 'Update Personal Info' }, style: { backgroundColor: '#b0c4de' } },
  ];
  
  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e2-4', source: '2', target: '4' },
    { id: 'e2-5', source: '2', target: '5' },
    { id: 'e5-6', source: '5', target: '6' },
    { id: 'e5-7', source: '5', target: '7' },
    { id: 'e5-8', source: '5', target: '8' },
    { id: 'e2-9', source: '2', target: '9' },
    { id: 'e9-10', source: '9', target: '10' },
    { id: 'e2-11', source: '2', target: '11' },
    { id: 'e11-12', source: '11', target: '12' },
  ];
    */
  // Additional edges can be added to represent further navigation paths.
  

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
            // For custom nodes
            if (n.type === 'rectangle' || n.type === 'circle' || n.type === 'triangle') {
              return {
                ...n,
                data: { ...n.data, style: { backgroundColor: color } }
              };
            } 
            // For default nodes or any other custom types not specified
            else {
              return {
                ...n,
                style: { ...n.style, backgroundColor: color }
              };
            }
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