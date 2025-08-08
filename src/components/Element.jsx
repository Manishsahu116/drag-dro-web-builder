import React, { useRef, useCallback } from "react";
import { Rnd } from "react-rnd";

const GRID_SIZE = 20;
const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

const Element = React.memo(function Element({
  element,
  isSelected,
  setSelectedId,
  setElements,
}) {
  const { id, type, content, src, x, y, width, height, styles = {} } = element;
  const { fontFamily, fontSize, color, textAlign, backgroundColor, padding } = styles;

  const handleUpdateElements = useCallback(
    (newProps) => {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...newProps } : el))
      );
    },
    [id, setElements]
  );

  const handleDragStop = useCallback(
    (e, d) => {
      handleUpdateElements({ x: snapToGrid(d.x), y: snapToGrid(d.y) });
    },
    [handleUpdateElements]
  );

  const handleResizeStop = useCallback(
    (e, direction, ref, delta, position) => {
      handleUpdateElements({
        x: snapToGrid(position.x),
        y: snapToGrid(position.y),
        width: snapToGrid(ref.offsetWidth),
        height: snapToGrid(ref.offsetHeight),
      });
    },
    [handleUpdateElements]
  );

  const handleDelete = useCallback(() => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedId(null);
  }, [id, setElements, setSelectedId]);

  const handleDuplicate = useCallback(() => {
    const offset = 40;
    const cloned = {
      ...element,
      id: crypto.randomUUID(),
      x: x + offset,
      y: y + offset,
    };
    setElements((prev) => [...prev, cloned]);
    setSelectedId(cloned.id);
  }, [element, x, y, setElements, setSelectedId]);

  const handleTextChange = useCallback(
    (e) => {
      handleUpdateElements({ content: e.target.value });
    },
    [handleUpdateElements]
  );

  const commonStyle = {
    fontFamily: fontFamily || "sans-serif",
    fontSize: fontSize || "16px",
    color: color || "#000",
    textAlign: textAlign || "left",
  };

  const getContent = () => {
    switch (type) {
      case "text":
        return isSelected ? (
          <input
            type="text"
            value={content}
            onChange={handleTextChange}
            style={{
              ...commonStyle,
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              padding: "0.25rem",
              width: "100%",
              height: "100%",
            }}
            autoFocus
          />
        ) : (
          <div style={{ ...commonStyle, width: "100%", height: "100%" }}>
            {content}
          </div>
        );

      case "image":
        return (
          <img
            src={src}
            alt={content || "Editable image"}
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
              backgroundColor: backgroundColor || "#efefef",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: padding || "0.25rem 0.5rem",
            }}
          >
            {content}
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <Rnd
      dragAxis="both"
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      snapgrid={[GRID_SIZE, GRID_SIZE]}
      size={{ width: width || 120, height: height || 50 }}
      position={{ x, y }}
      onClick={() => setSelectedId(id)}
      onTouchStart={() => setSelectedId(id)}
      bounds="parent"
      enableResizing={isSelected}
      className={`absolute group transition duration-200 ease-in-out ${
        isSelected ? "z-20" : "z-10"
      }`}
      style={{
        border: isSelected ? "2px solid #6366f1" : "none",
        backgroundColor: type === "text" ? "transparent" : backgroundColor,
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
            // Added onTouchEnd to handle mobile taps
            onTouchEnd={(e) => {
              e.stopPropagation();
              handleDuplicate();
            }}
            className="bg-gray-100 hover:bg-gray-200 text-sm px-2 py-1 rounded shadow border"
            aria-label="Duplicate element"
          >
            ⧉
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            // Added onTouchEnd to handle mobile taps
            onTouchEnd={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="bg-red-100 hover:bg-red-200 text-sm px-2 py-1 rounded shadow border text-red-700"
            aria-label="Delete element"
          >
            ✕
          </button>
        </div>
      )}
      {getContent()}
    </Rnd>
  );
});

export default Element;