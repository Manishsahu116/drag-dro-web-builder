// src/App.jsx
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import EditPanel from "./components/EditPanel";
import LayoutManager from "./components/LayoutManager";
function App() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const updateElement = (id, newProps) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...newProps } : el))
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      <LayoutManager elements={elements} setElements={setElements} />
      <Sidebar setElements={setElements} />
      <Canvas
        elements={elements}
        setElements={setElements}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
      <EditPanel
        selectedId={selectedId}
        elements={elements}
        updateElement={updateElement}
      />
    </div>
  );
}

export default App;
