// src/App.jsx
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import EditPanel from "./components/EditPanel";
import LayoutManager from "./components/LayoutManager";

function App() {
  const [elements, setElements] = useState([]); // Stores all draggable elements
  const [selectedId, setSelectedId] = useState(null); // Currently selected element for editing

  // Update specific element's properties
  const updateElement = (id, newProps) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...newProps } : el))
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      {/* Layout Import/Export Controls */}
      <LayoutManager elements={elements} setElements={setElements} />

      {/* Sidebar for adding new elements */}
      <Sidebar setElements={setElements} />

      {/* Main Canvas for displaying and positioning elements */}
      <Canvas
        elements={elements}
        setElements={setElements}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />

      {/* Panel to edit selected element’s properties */}
      <EditPanel
        selectedId={selectedId}
        elements={elements}
        updateElement={updateElement}
      />
    </div>
  );
}

export default App;
