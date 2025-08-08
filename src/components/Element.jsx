// src/components/Element.jsx
import React, { useRef } from "react";
import { Rnd } from "react-rnd";

const GRID_SIZE = 20;

const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

export default function Element({
  element,
  isSelected,
  setSelectedId,
  setElements,
}) {
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleDragStart = (e, d) => {
    dragStartRef.current = { x: d.x, y: d.y };
  };

  const handleDragStop = (e, d) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === element.id ? { ...el, x: snapToGrid(d.x), y: snapToGrid(d.y) } : el
      )
    );
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === element.id
          ? {
              ...el,
              x: snapToGrid(position.x),
              y: snapToGrid(position.y),
              width: snapToGrid(ref.offsetWidth),
              height: snapToGrid(ref.offsetHeight),
            }
          : el
      )
    );
  };

  const handleDelete = () => {
    setElements((prev) => prev.filter((el) => el.id !== element.id));
    setSelectedId(null);
  };

  const handleDuplicate = () => {
    const offset = 40;

    const cloned = {
      ...element,
      id: crypto.randomUUID(),
      x: element.x + offset,
      y: element.y + offset,
    };

    setElements((prev) => [...prev, cloned]);
    setSelectedId(cloned.id);
  };

  const commonStyle = {
    fontFamily: element.styles?.fontFamily || "sans-serif",
    fontSize: element.styles?.fontSize || "16px",
    color: element.styles?.color || "#000",
    textAlign: element.styles?.textAlign || "left",
    width: "100%",
    height: "100%",
  };

  const getContent = () => {
    switch (element.type) {
      case "text":
        return <div style={commonStyle}>{element.content}</div>;

      case "image":
        return (
          <img
            src={element.src}
            alt={element.content || "Editable image"}
            className="w-full h-full object-contain rounded"
            draggable={false}
          />
        );

      case "button":
        return (
          <button
            className="w-full h-full rounded focus:outline-none"
            style={{
              ...commonStyle,
              backgroundColor: element.styles?.backgroundColor || "#efefef",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: element.styles?.padding || "0.25rem 0.5rem",
            }}
          >
            {element.content}
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <Rnd
      dragAxis="both"
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      snapgrid={[GRID_SIZE, GRID_SIZE]}
      size={{
        width: element.width || 120,
        height: element.height || 50,
      }}
      position={{
        x: element.x,
        y: element.y,
      }}
      onClick={() => setSelectedId(element.id)}
      onTouchStart={() => setSelectedId(element.id)}
      bounds="parent"
      enableResizing={isSelected}
      className={`absolute group transition duration-200 ease-in-out ${
        isSelected ? "z-20" : "z-10"
      }`}
      style={{
        border: isSelected ? "2px solid #6366f1" : "none",
        backgroundColor:
          element.type === "text" ? "transparent" : element.styles?.backgroundColor,
        userSelect: "none",
        overflow: "visible",
        touchAction: "none",
        borderRadius: 4,
      }}
    >
      {isSelected && (
        <div className="absolute -top-8 right-0 flex gap-1 z-30">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDuplicate();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              handleDuplicate();
            }}
            className="bg-gray-100 hover:bg-gray-200 text-sm px-2 py-1 rounded shadow border"
            style={{ touchAction: "manipulation" }}
            aria-label="Duplicate element"
          >
            ⧉
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="bg-red-100 hover:bg-red-200 text-sm px-2 py-1 rounded shadow border text-red-700"
            style={{ touchAction: "manipulation" }}
            aria-label="Delete element"
          >
            ✕
          </button>
        </div>
      )}

      {getContent()}
    </Rnd>
  );
}