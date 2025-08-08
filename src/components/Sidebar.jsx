// src/components/Sidebar.jsx
import React from "react";
import { nanoid } from "nanoid";
import { FiType, FiImage, FiSquare } from "react-icons/fi";

const GRID_SIZE = 20;

const elementsList = [
  {
    type: "text",
    label: "Text",
    icon: FiType,
    defaultProps: {
      content: "Your Text Here",
      fontSize: "20px",
      color: "#1f2937",
      width: "200px",
      height: "40px", // avoid 'auto' for consistent rendering
    },
  },
  {
    type: "image",
    label: "Image",
    icon: FiImage,
    defaultProps: {
      src: "https://placehold.co/150x150", // fixed broken placeholder.com
      width: "150px",
      height: "150px",
    },
  },
  {
    type: "button",
    label: "Button",
    icon: FiSquare,
    defaultProps: {
      content: "Click Me",
      backgroundColor: "#4f46e5",
      color: "#ffffff",
      padding: "10px 20px",
      width: "180px",
      height: "50px",
    },
  },
];

export default function Sidebar({ setElements }) {
  const handleDragStart = (e, element) => {
    e.dataTransfer.setData("element", JSON.stringify(element));
  };

  const snap = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

  const addElementToCanvas = (el) => {
    const element = {
      id: nanoid(),
      type: el.type,
      x: snap(100),
      y: snap(100),
      ...el.defaultProps,
    };
    setElements((prev) => [...prev, element]);
  };

  return (
    <div className="w-full md:w-1/5 min-w-0 md:min-w-[200px] bg-white shadow-md border-b md:border-b-0 md:border-r p-2 md:p-4 max-h-60 md:max-h-screen overflow-auto flex-shrink-0">
      <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-800">
        Elements
      </h2>
      <div className="space-y-2 md:space-y-4">
        {elementsList.map((el) => {
          const Icon = el.icon;
          const draggableEl = {
            id: nanoid(), // ensures each drag generates a new id
            type: el.type,
            ...el.defaultProps,
          };

          return (
            <div
              key={el.type}
              draggable
              onDragStart={(e) => handleDragStart(e, draggableEl)}
              className="cursor-move p-2 md:p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition flex items-center gap-2 text-base md:text-lg"
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
