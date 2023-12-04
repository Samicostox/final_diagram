import React from 'react';

const Sidebar = ({ onDragStart }) => {
  return (
    <aside>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'rectangle')} draggable>
        Rectangle
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'circle')} draggable>
        Circle
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'triangle')} draggable>
        Triangle
      </div>
    </aside>
  );
};

export default Sidebar;
