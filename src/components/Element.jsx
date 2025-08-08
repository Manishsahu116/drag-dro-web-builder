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
        el.id === element.id
          ? { ...el, x: snappedX, y: snappedY }
          : el
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
    const newId = crypto.randomUUID();
    const offset = 40;

    const newEl = {
      ...element,
      id: newId,
      x: element.x + offset,
      y: element.y + offset,
    };

    setElements((prev) => [...prev, newEl]);
    setSelectedId(newId);
  };

  const getContent = () => {
    switch (element.type) {
      case "text":
        return <p>{element.content}</p>;
      case "image":
        return (
          <img
            src={element.src}
            alt="Image"
            className="rounded w-full h-full object-contain"
          />
        );
      case "button":
        return (
          <button
            className="rounded px-4 py-2 w-full h-full"
            style={{
              backgroundColor: element.backgroundColor,
              color: element.color,
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
        width: element.width || "auto",
        height: element.height || "auto",
      }}
      position={{ x: element.x, y: element.y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onClick={() => setSelectedId(element.id)}
      bounds="parent"
      enableResizing={isSelected}
      className={`absolute group transition duration-200 ease-in-out ${
        isSelected ? "z-10" : "z-1"
      }`}
      style={{
        padding: element.padding || "0",
        color: element.color || "#000",
        backgroundColor: element.backgroundColor || "transparent",
        fontSize: element.fontSize || "inherit",
        border: isSelected ? "2px solid #6366f1" : "none",
        userSelect: "none",
        transform: "translate3d(0, 0, 0)", // GPU acceleration
      }}
    >
      {isSelected && (
        <div className="absolute -top-8 md:-top-6 right-0 flex gap-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDuplicate();
            }}
            className="bg-gray-100 hover:bg-gray-200 text-base md:text-xs px-3 md:px-2 py-2 md:py-1 rounded shadow border min-w-[36px] min-h-[36px] md:min-w-0 md:min-h-0"
            style={{ touchAction: "manipulation" }}
          >
            ⧉
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="bg-red-100 hover:bg-red-200 text-base md:text-xs px-3 md:px-2 py-2 md:py-1 rounded shadow border text-red-700 min-w-[36px] min-h-[36px] md:min-w-0 md:min-h-0"
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
