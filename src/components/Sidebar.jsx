import React, { useCallback, memo } from "react";
import { nanoid } from "nanoid";
import { FiType, FiImage, FiSquare } from "react-icons/fi";

const elementsList = [
  {
    type: "text",
    label: "Text",
    icon: FiType,
    defaultProps: {
      content: "Your Text Here",
      styles: {
        fontSize: "20px",
        color: "#1f2937",
        backgroundColor: "transparent",
      },
      width: 200,
      height: 40,
    },
  },
  {
    type: "image",
    label: "Image",
    icon: FiImage,
    defaultProps: {
      src: "https://placehold.co/150x150",
      width: 150,
      height: 150,
      styles: {},
    },
  },
  {
    type: "button",
    label: "Button",
    icon: FiSquare,
    defaultProps: {
      content: "Click Me",
      styles: {
        backgroundColor: "#4f46e5",
        color: "#ffffff",
        padding: "10px 20px",
      },
      width: 180,
      height: 50,
    },
  },
];

const SidebarItem = memo(({ element, addElementToCanvas, handleDragStart }) => {
  const Icon = element.icon;

  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, element)}
      className="cursor-move p-2 md:p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition flex items-center gap-2 text-base md:text-lg"
      data-element={JSON.stringify({ ...element.defaultProps, type: element.type })}
      // For mobile drag-and-drop consistency, the `data-element` should not have an ID here.
    >
      <Icon className="text-gray-700 text-lg" />
      <span className="text-gray-800">{element.label}</span>
      <button
        type="button"
        onClick={() => addElementToCanvas(element)}
        className="text-sm text-indigo-600 hover:underline ml-auto"
        aria-label={`Add ${element.label.toLowerCase()} to canvas`}
      >
        Add
      </button>
    </div>
  );
});

export default function Sidebar({ setElements }) {
  // Memoize handlers to prevent unnecessary re-renders
  const handleDragStart = useCallback((e, element) => {
    // Generate a unique ID only when the drag starts
    const dragElementData = {
      ...element.defaultProps,
      type: element.type,
      id: nanoid(),
    };
    e.dataTransfer.setData("element", JSON.stringify(dragElementData));
    e.dataTransfer.effectAllowed = "copy";
  }, []);

  const addElementToCanvas = useCallback((el) => {
    const newElement = {
      ...el.defaultProps,
      id: nanoid(),
      type: el.type,
      x: 20,
      y: 20,
    };
    setElements((prev) => [...prev, newElement]);
  }, [setElements]);

  return (
    <div className="w-full md:w-1/5 min-w-0 md:min-w-[200px] bg-white shadow-md border-b md:border-b-0 md:border-r p-2 md:p-4 max-h-60 md:max-h-screen overflow-auto flex-shrink-0">
      <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-800">
        Elements
      </h2>
      <div className="space-y-2 md:space-y-4">
        {elementsList.map((el) => (
          <SidebarItem
            key={el.type}
            element={el}
            addElementToCanvas={addElementToCanvas}
            handleDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
}