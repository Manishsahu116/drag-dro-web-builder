// src/components/Canvas.jsx
import React, { useRef, useEffect, useState } from "react";
import Element from "./Element";

const GRID_SIZE = 20;
const snapToGrid = (val) => Math.round(val / GRID_SIZE) * GRID_SIZE;

export default function Canvas({
  elements,
  setElements,
  selectedId,
  setSelectedId,
}) {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const dragDataRef = useRef(null); // Ref to store element data during drag/touch

  // Logic to calculate the correct scale for mobile view
  const calculateScale = () => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      setScale(1);
      return;
    }

    if (!canvasRef.current) return;

    // Find the max dimensions of the content
    let maxX = 0;
    let maxY = 0;
    elements.forEach((el) => {
      const w = parseInt(el.width || 100);
      const h = parseInt(el.height || 50);
      maxX = Math.max(maxX, (el.x || 0) + w);
      maxY = Math.max(maxY, (el.y || 0) + h);
    });

    const padding = 16;
    const availableWidth = window.innerWidth - padding * 2;
    const availableHeight = window.innerHeight - 120; // Assuming a toolbar height
    const scaleX = maxX > 0 ? Math.min(1, availableWidth / maxX) : 1;
    const scaleY = maxY > 0 ? Math.min(1, availableHeight / maxY) : 1;
    
    // Set the scale to the smaller of the two to fit everything
    setScale(Math.min(scaleX, scaleY, 1));
  };

  useEffect(() => {
    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [elements]);

  // Unified function to handle element creation after a drop or touch end
  const addNewElement = (elementData, clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const element = JSON.parse(elementData);
    
    const rawX = (clientX - rect.left) / scale;
    const rawY = (clientY - rect.top) / scale;

    const width = parseInt(element.width || 100);
    const height = parseInt(element.height || 50);

    const newElement = {
      ...element,
      id: crypto.randomUUID(),
      x: snapToGrid(rawX - width / 2),
      y: snapToGrid(rawY - height / 2),
    };

    setElements((prev) => [...prev, newElement]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const elementData = e.dataTransfer.getData("element");
    if (!elementData) return;

    addNewElement(elementData, e.clientX, e.clientY);
  };
  
  // Mobile drag-and-drop handling
  const handleTouchStart = (e) => {
    const target = e.target.closest("[draggable]");
    if (!target) return;
    const elementData = target.getAttribute("data-element");
    
    // Store the element data in a ref for later use in touch end
    if (elementData) {
      dragDataRef.current = { data: elementData };
    }
  };

  const handleTouchEnd = (e) => {
    if (!dragDataRef.current) return;

    const touch = e.changedTouches[0];
    addNewElement(dragDataRef.current.data, touch.clientX, touch.clientY);
    dragDataRef.current = null; // Clear the ref
  };
  
  // A helper function to manage the canvas click behavior
  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  return (
    <div
      ref={canvasRef}
      className="flex-1 relative bg-gray-100 max-w-full"
      style={{
        width: "100%", // Use a more flexible width
        height: "100dvh", 
        overflow: "hidden",
        touchAction: "pan-x pan-y", // Allow native scrolling for mobile
        position: "relative",
      }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={handleCanvasClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: "100%",
          height: "100%",
          willChange: "transform",
        }}
      >
        {elements.map((el) => (
          <Element
            key={el.id}
            element={el}
            isSelected={selectedId === el.id}
            setSelectedId={setSelectedId}
            setElements={setElements}
          />
        ))}
      </div>
    </div>
  );
}