// src/components/EditPanel.jsx
import React from "react";

const EditPanel = ({ selectedId, elements, updateElement }) => {
  const selectedElement = elements.find((el) => el.id === selectedId);

  const handleChange = (field, value) => {
    updateElement(selectedId, { [field]: value });
  };

  if (!selectedElement)
    return (
      <div className="w-full md:w-1/5 bg-white p-2 md:p-4 border-t md:border-t-0 md:border-l" />
    );

  return (
    <div className="w-full md:w-1/5 bg-white p-2 md:p-4 border-t md:border-t-0 md:border-l">
      <h2 className="text-base md:text-lg font-semibold mb-4 text-gray-800">
        Edit Element
      </h2>

      {/* Shared position & size controls */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <label className="block mb-1 text-sm font-medium">X</label>
          <input
            type="number"
            value={selectedElement.x}
            onChange={(e) => handleChange("x", parseInt(e.target.value))}
            className="w-full p-2 border rounded text-sm"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Y</label>
          <input
            type="number"
            value={selectedElement.y}
            onChange={(e) => handleChange("y", parseInt(e.target.value))}
            className="w-full p-2 border rounded text-sm"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Width</label>
          <input
            type="number"
            value={selectedElement.width}
            onChange={(e) => handleChange("width", parseInt(e.target.value))}
            className="w-full p-2 border rounded text-sm"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Height</label>
          <input
            type="number"
            value={selectedElement.height}
            onChange={(e) => handleChange("height", parseInt(e.target.value))}
            className="w-full p-2 border rounded text-sm"
          />
        </div>
      </div>

      {selectedElement.type === "text" && (
        <>
          <label className="block mb-1 text-sm font-medium">Text</label>
          <input
            type="text"
            value={selectedElement.content}
            onChange={(e) => handleChange("content", e.target.value)}
            className="w-full mb-3 p-2 border rounded text-sm"
          />
          <label className="block mb-1 text-sm font-medium">Font Size</label>
          <input
            type="number"
            value={selectedElement.fontSize}
            onChange={(e) => handleChange("fontSize", parseInt(e.target.value))}
            className="w-full mb-3 p-2 border rounded text-sm"
          />
          <label className="block mb-1 text-sm font-medium">Text Color</label>
          <input
            type="color"
            value={selectedElement.color}
            onChange={(e) => handleChange("color", e.target.value)}
            className="w-full mb-3"
          />
          
        </>
      )}

      {selectedElement.type === "image" && (
        <>
          <label className="block mb-1 text-sm font-medium">Image URL</label>
          <input
            type="text"
            value={selectedElement.src}
            onChange={(e) => handleChange("src", e.target.value)}
            className="w-full mb-3 p-2 border rounded text-sm"
            placeholder="https://..."
          />
        </>
      )}

      {selectedElement.type === "button" && (
        <>
          <label className="block mb-1 text-sm font-medium">Button Text</label>
          <input
            type="text"
            value={selectedElement.content}
            onChange={(e) => handleChange("content", e.target.value)}
            className="w-full mb-3 p-2 border rounded text-sm"
          />
          <label className="block mb-1 text-sm font-medium">
            Background Color
          </label>
          <input
            type="color"
            value={selectedElement.backgroundColor}
            onChange={(e) => handleChange("backgroundColor", e.target.value)}
            className="w-full mb-3"
          />
          <label className="block mb-1 text-sm font-medium">Text Color</label>
          <input
            type="color"
            value={selectedElement.color}
            onChange={(e) => handleChange("color", e.target.value)}
            className="w-full mb-3"
          />
        </>
      )}
    </div>
  );
};

export default EditPanel;
