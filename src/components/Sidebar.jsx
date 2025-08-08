import React from "react";
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

export default function Sidebar({ setElements }) {
  // Function to prepare element data for drag-and-drop
  const handleDragStart = (e, element) => {
    // The id is generated here so each new element has a unique ID from the start
    const dragElementData = {
      ...element,
      id: nanoid(),
    };
    e.dataTransfer.setData("element", JSON.stringify(dragElementData));
    e.dataTransfer.effectAllowed = "copy";
  };

  // Function to add a new element to the canvas with a default position
  const addElementToCanvas = (el) => {
    const newElement = {
      ...el.defaultProps,
      id: nanoid(),
      type: el.type,
      x: 20, // Default starting X position
      y: 20, // Default starting Y position
    };
    setElements((prev) => [...prev, newElement]);
  };

  return (
    <div className="w-full md:w-1/5 min-w-0 md:min-w-[200px] bg-white shadow-md border-b md:border-b-0 md:border-r p-2 md:p-4 max-h-60 md:max-h-screen overflow-auto flex-shrink-0">
      <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-800">
        Elements
      </h2>
      <div className="space-y-2 md:space-y-4">
        {elementsList.map((el) => {
          const Icon = el.icon;
          return (
            <div
              key={el.type}
              draggable
              onDragStart={(e) => handleDragStart(e, el)}
              className="cursor-move p-2 md:p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition flex items-center gap-2 text-base md:text-lg"
              data-element={JSON.stringify({ ...el.defaultProps, type: el.type, id: nanoid() })}
            >
              <Icon className="text-gray-700 text-lg" />
              <span className="text-gray-800">{el.label}</span>
              <button
                type="button"
                onClick={() => addElementToCanvas(el)}
                className="text-sm text-indigo-600 hover:underline ml-auto"
              >
                Add
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}