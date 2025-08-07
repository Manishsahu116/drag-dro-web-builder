// src/components/EditPanel.jsx
import React from "react";

export default function EditPanel({ selectedId, elements, updateElement }) {
  const selectedElement = elements.find((el) => el.id === selectedId);

  const handleChange = (field, value) => {
    updateElement(selectedId, { [field]: value });
  };

  if (!selectedElement) return <div className="w-full md:w-1/5 bg-white p-2 md:p-4 border-t md:border-t-0 md:border-l" />;

  return (
    <div className="w-full md:w-1/5 bg-white p-2 md:p-4 border-t md:border-t-0 md:border-l">
      <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4 text-gray-800">Edit Element</h2>

      {selectedElement.type === "text" && (
        <>
          <label className="block mb-2 text-sm font-medium">Text</label>
          <input
            type="text"
            value={selectedElement.content}
            onChange={(e) => handleChange("content", e.target.value)}
            className="w-full mb-2 md:mb-4 p-2 border rounded text-sm md:text-base"
          />
          <label className="block mb-2 text-sm font-medium">Font Size</label>
          <input
            type="text"
            value={selectedElement.fontSize}
            onChange={(e) => handleChange("fontSize", e.target.value)}
            className="w-full mb-2 md:mb-4 p-2 border rounded text-sm md:text-base"
          />
          <label className="block mb-2 text-sm font-medium">Text Color</label>
          <input
            type="color"
            value={selectedElement.color}
            onChange={(e) => handleChange("color", e.target.value)}
            className="w-full mb-2 md:mb-4"
          />
        </>
      )}

      {selectedElement.type === "image" && (
        <>
          <label className="block mb-2 text-sm font-medium">Image URL</label>
          <input
            type="text"
            value={selectedElement.src}
            onChange={(e) => handleChange("src", e.target.value)}
            className="w-full mb-2 md:mb-4 p-2 border rounded text-sm md:text-base"
          />
          <label className="block mb-2 text-sm font-medium">Width (px)</label>
          <input
            type="text"
            value={selectedElement.width}
            onChange={(e) => handleChange("width", e.target.value)}
            className="w-full mb-2 md:mb-4 p-2 border rounded text-sm md:text-base"
          />
        </>
      )}

      {selectedElement.type === "button" && (
        <>
          <label className="block mb-2 text-sm font-medium">Button Text</label>
          <input
            type="text"
            value={selectedElement.content}
            onChange={(e) => handleChange("content", e.target.value)}
            className="w-full mb-2 md:mb-4 p-2 border rounded text-sm md:text-base"
          />
          <label className="block mb-2 text-sm font-medium">Background Color</label>
          <input
            type="color"
            value={selectedElement.backgroundColor}
            onChange={(e) => handleChange("backgroundColor", e.target.value)}
            className="w-full mb-2 md:mb-4"
          />
          <label className="block mb-2 text-sm font-medium">Text Color</label>
          <input
            type="color"
            value={selectedElement.color}
            onChange={(e) => handleChange("color", e.target.value)}
            className="w-full mb-2 md:mb-4"
          />
        </>
      )}
    </div>
  );
}
