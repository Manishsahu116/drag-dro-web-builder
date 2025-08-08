// src/App.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import EditPanel from "./components/EditPanel";
import LayoutManager from "./components/LayoutManager";

function App() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showEditPanel, setShowEditPanel] = useState(false);

  // When a new element is selected, close the mobile edit panel
  // This is a more declarative way to handle the side effect of state change
  useEffect(() => {
    if (window.innerWidth < 768) {
      setShowEditPanel(false);
    }
  }, [selectedId]);

  const updateElement = (id, newProps) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...newProps } : el))
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full relative overflow-hidden">
      <LayoutManager elements={elements} setElements={setElements} />
      <Sidebar setElements={setElements} />
      <Canvas
        elements={elements}
        setElements={setElements}
        selectedId={selectedId}
        setSelectedId={setSelectedId} // Pass the setter directly
      />
      
      {/* 🛠️ Edit Button for Mobile */}
      {selectedId && !showEditPanel && (
        <button
          className="md:hidden fixed bottom-20 right-4 bg-indigo-600 text-white px-4 py-2 rounded shadow-lg z-40"
          onClick={() => setShowEditPanel(true)}
        >
          🛠️ Edit
        </button>
      )}

      <EditPanel
        selectedId={selectedId}
        elements={elements}
        updateElement={updateElement}
        showEditPanel={showEditPanel}
        setShowEditPanel={setShowEditPanel}
      />
    </div>
  );
}

export default App;