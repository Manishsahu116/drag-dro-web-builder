// src/components/Sidebar.jsx
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
      fontSize: "20px",
      color: "#1f2937",
    },
  },
  {
    type: "image",
    label: "Image",
    icon: FiImage,
    defaultProps: {
      src: "https://via.placeholder.com/150",
      width: "150px",
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
    },
  },
];

export default function Sidebar({ setElements }) {
  const handleDragStart = (e, element) => {
    e.dataTransfer.setData("element", JSON.stringify(element));
  };

  return (
    <div className="w-full md:w-1/5 min-w-0 md:min-w-[200px] bg-white shadow-md border-b md:border-b-0 md:border-r p-2 md:p-4 max-h-60 md:max-h-screen overflow-auto flex-shrink-0">
      <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-800">Elements</h2>
      <div className="space-y-2 md:space-y-4">
        {elementsList.map((el) => {
          const Icon = el.icon;
          return (
            <div
              key={el.type}
              draggable
              onDragStart={(e) =>
                handleDragStart(e, {
                  id: nanoid(),
                  type: el.type,
                  ...el.defaultProps,
                })
              }
              className="cursor-move p-2 md:p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition flex items-center gap-2 text-base md:text-lg"
            >
              <Icon className="text-gray-700 text-lg" />
              <span className="text-gray-800">{el.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
