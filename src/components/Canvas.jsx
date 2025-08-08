import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import Element from "./Element";

const GRID_SIZE = 20;
const snapToGrid = (val) => Math.round(val / GRID_SIZE) * GRID_SIZE;

// Memoize the Element component to prevent unnecessary re-renders
const MemoizedElement = memo(Element);

export default function Canvas({
  elements,
  setElements,
  selectedId,
  setSelectedId,
}) {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const dragDataRef = useRef(null);
  
  // Memoize the handler for state updates to ensure stability
  const updateElementState = useCallback(
    (newProps) => {
      setElements((prev) =>
        prev.map((el) => (el.id === newProps.id ? newProps : el))
      );
    },
    [setElements]
  );

  // Memoize the scale calculation function
  const calculateScale = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      setScale(1);
      return;
    }

    if (!canvasRef.current || elements.length === 0) return;

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
    const availableHeight = window.innerHeight - 120;
    const scaleX = maxX > 0 ? availableWidth / maxX : 1;
    const scaleY = maxY > 0 ? availableHeight / maxY : 1;
    
    // Set the scale to the smaller of the two, but not greater than 1
    setScale(Math.min(scaleX, scaleY, 1));
  }, [elements]);

  useEffect(() => {
    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [calculateScale]);

  // Memoize the function for adding new elements
  const addNewElement = useCallback(
    (elementData, clientX, clientY) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const element = JSON.parse(elementData);
      
      const rawX = (clientX - rect.left) / scale;
      const rawY = (clientY - rect.top) / scale;

      const width = parseInt(element.width || 120);
      const height = parseInt(element.height || 50);

      const newElement = {
        ...element,
        id: crypto.randomUUID(),
        x: snapToGrid(rawX - width / 2),
        y: snapToGrid(rawY - height / 2),
      };

      setElements((prev) => [...prev, newElement]);
    },
    [setElements, scale]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    const elementData = e.dataTransfer.getData("element");
    if (!elementData) return;

    addNewElement(elementData, e.clientX, e.clientY);
  };
  
  const handleTouchStart = (e) => {
    const target = e.target.closest("[draggable]");
    if (!target) return;
    const elementData = target.getAttribute("data-element");
    
    if (elementData) {
      dragDataRef.current = { data: elementData };
    }
  };

  const handleTouchEnd = (e) => {
    if (!dragDataRef.current || !canvasRef.current) return;

    const touch = e.changedTouches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Check if the drop was inside the canvas
    if (touch.clientX > rect.left && touch.clientX < rect.right &&
        touch.clientY > rect.top && touch.clientY < rect.bottom) {
      addNewElement(dragDataRef.current.data, touch.clientX, touch.clientY);
    }
    
    dragDataRef.current = null;
  };
  
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
        height: "100dvh",
        overflow: "hidden",
        position: "relative",
        userSelect: "none",
        touchAction: "pan-x pan-y",
      }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={handleCanvasClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="absolute left-0 top-0 w-full h-full"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          willChange: "transform",
        }}
      >
        {elements.map((el) => (
          <MemoizedElement
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