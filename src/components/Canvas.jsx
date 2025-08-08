// src/components/Canvas.jsx
import React, { useRef, useEffect, useState } from "react";
import Element from "./Element";

const GRID_SIZE = 20;
const snap = (val) => Math.round(val / GRID_SIZE) * GRID_SIZE;

export default function Canvas({
  elements,
  setElements,
  selectedId,
  setSelectedId,
}) {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Auto-scale content to fit mobile screen
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      setScale(1);
      return;
    }

    if (!canvasRef.current) return;

    let maxX = 0,
      maxY = 0;
    elements.forEach((el) => {
      const w = parseInt(el.width || 100);
      const h = parseInt(el.height || 50);
      maxX = Math.max(maxX, (el.x || 0) + w);
      maxY = Math.max(maxY, (el.y || 0) + h);
    });

    const pad = 16;
    const availW = window.innerWidth - pad * 2;
    const availH = window.innerHeight - 120; // leave space for panels
    const scaleX = maxX > 0 ? Math.min(1, availW / maxX) : 1;
    const scaleY = maxY > 0 ? Math.min(1, availH / maxY) : 1;
    setScale(Math.min(scaleX, scaleY, 1));
  }, [elements]);

  const handleDrop = (e) => {
    e.preventDefault();
    const element = JSON.parse(e.dataTransfer.getData("element"));
    const rect = e.currentTarget.getBoundingClientRect();

    const rawX = e.clientX - rect.left - 50;
    const rawY = e.clientY - rect.top - 20;

    const newElement = {
      ...element,
      x: snap(rawX),
      y: snap(rawY),
    };

    setElements((prev) => [...prev, newElement]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Touch support for mobile drag-and-drop
  const handleTouchStart = (e) => {
    const target = e.target.closest("[draggable]");
    if (!target) return;
    const elementData = target.getAttribute("data-element");
    if (!elementData) return;
    e.target._draggedElement = elementData;
  };

  const handleTouchEnd = (e) => {
    if (!e.target._draggedElement) return;
    const touch = e.changedTouches[0];
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const element = JSON.parse(e.target._draggedElement);

    const rawX = touch.clientX - rect.left - 50;
    const rawY = touch.clientY - rect.top - 20;

    const newElement = {
      ...element,
      x: snap(rawX),
      y: snap(rawY),
    };

    setElements((prev) => [...prev, newElement]);
    e.target._draggedElement = null;
  };

  return (
    <div
      ref={canvasRef}
      className="flex-1 relative bg-gray-100 max-w-full min-h-[40vh] md:min-h-0 md:h-auto"
      style={{
        width: "100vw",
        height: "calc(100vh - 120px)",
        overflow: "hidden",
        touchAction: "none",
        position: "relative",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
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
