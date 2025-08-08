// src/components/Element.jsx
import React from "react";
import { Rnd } from "react-rnd";

export default function Element({
  element,
  isSelected,
  setSelectedId,
  setElements,
}) {
  const GRID_SIZE = 20;

  const handleDragStop = (e, d) => {
    const snappedX = Math.round(d.x / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(d.y / GRID_SIZE) * GRID_SIZE;

    setElements((prev) =>
      prev.map((el) =>
        el.id === element.id ? { ...el, x: snappedX, y: snappedY } : el
      )
    );
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    const snappedX = Math.round(position.x / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(position.y / GRID_SIZE) * GRID_SIZE;

    const snappedWidth = Math.round(ref.offsetWidth / GRID_SIZE) * GRID_SIZE;
    const snappedHeight = Math.round(ref.offsetHeight / GRID_SIZE) * GRID_SIZE;

    setElements((prev) =>
      prev.map((el) =>
        el.id === element.id
          ? {
              ...el,
              x: snappedX,
              y: snappedY,
              width: snappedWidth,
              height: snappedHeight,
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
    const newEl = {
      ...JSON.parse(JSON.stringify(element)),
      id: crypto.randomUUID(),
      x: element.x + offset,
      y: element.y + offset,
    };

    setElements((prev) => [...prev, newEl]);
    setSelectedId(newEl.id);
  };

  const getContent = () => {
    const commonStyle = {
      fontFamily: element.styles?.fontFamily || "sans-serif",
      fontSize: element.fontSize || 16,
      color: element.color || "#000",
      textAlign: element.styles?.textAlign || "left",
      width: "100%",
      height: "100%",
    };

    switch (element.type) {
      case "text":
        return <div style={commonStyle}>{element.content}</div>;

      case "image":
        return (
          <img
            src={element.src}
            alt="Element"
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
              backgroundColor: element.backgroundColor || "#efefef",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: element.padding || "0.25rem 0.5rem",
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
      snapGrid={[GRID_SIZE, GRID_SIZE]}
      size={{
        width: element.width || 120,
        height: element.height || 50,
      }}
      position={{
        x: element.x,
        y: element.y,
      }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onClick={() => setSelectedId(element.id)}
      onTouchStart={() => setSelectedId(element.id)}
      bounds="parent"
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      className={`absolute group transition duration-200 ease-in-out ${
        isSelected ? "z-20" : "z-10"
      }`}
      style={{
        border: isSelected ? "2px solid #6366f1" : "none",
        backgroundColor:
          element.type === "text" ? "transparent" : element.backgroundColor,
        userSelect: "none",
        overflow: "visible",
        borderRadius: 4,
      }}
    >
      {/* Action buttons (duplicate/delete) */}
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
          >
            ✕
          </button>
        </div>
      )}

      {getContent()}
    </Rnd>
  );
}
