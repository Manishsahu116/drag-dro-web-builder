// src/components/EditPanel.jsx
import React from "react";

const EditPanel = ({ selectedId, elements, updateElement }) => {
  const selectedElement = elements.find((el) => el.id === selectedId);
  const styles = selectedElement?.styles || {};

  const handleChange = (field, value) => {
    updateElement(selectedId, { [field]: value });
  };

  const handleStyleChange = (property, value) => {
    const updatedStyles = {
      ...styles,
      [property]: value,
    };

    updateElement(selectedId, { styles: updatedStyles });
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

      {/* Position & Size */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <label className="block mb-1 text-sm font-medium">X</label>
          <input
            type="number"
            value={selectedElement.x || 0}
            onChange={(e) => handleChange("x", parseInt(e.target.value))}
            className="w-full p-2 border rounded text-sm"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Y</label>
          <input
            type="number"
            value={selectedElement.y || 0}
            onChange={(e) => handleChange("y", parseInt(e.target.value))}
            className="w-full p-2 border rounded text-sm"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Width</label>
          <input
            type="number"
            value={
              selectedElement.width === "auto"
                ? ""
                : parseInt(selectedElement.width) || 100
            }
            onChange={(e) =>
              handleChange("width", parseInt(e.target.value) || 100)
            }
            className="w-full p-2 border rounded text-sm"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Height</label>
          <input
            type="number"
            value={
              selectedElement.height === "auto"
                ? ""
                : parseInt(selectedElement.height) || 100
            }
            onChange={(e) =>
              handleChange("height", parseInt(e.target.value) || 100)
            }
            className="w-full p-2 border rounded text-sm"
          />
        </div>
      </div>

      {/* Text Element Settings */}
      {selectedElement.type === "text" && (
        <>
          <label className="block mb-1 text-sm font-medium">Text</label>
          <input
            type="text"
            value={selectedElement.content || ""}
            onChange={(e) => handleChange("content", e.target.value)}
            className="w-full mb-3 p-2 border rounded text-sm"
          />

          <label className="block mb-1 text-sm font-medium">Font Size</label>
          <input
            type="number"
            value={parseInt(styles.fontSize) || 16}
            onChange={(e) =>
              handleStyleChange("fontSize", `${e.target.value}px`)
            }
            className="w-full mb-4 p-2 border rounded"
          />

          <label className="block mb-1 text-sm font-medium">Font Family</label>
          <select
            value={styles.fontFamily || "sans-serif"}
            onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
            <option value="cursive">Cursive</option>
          </select>

          <label className="block mb-1 text-sm font-medium">Text Align</label>
          <select
            value={styles.textAlign || "left"}
            onChange={(e) => handleStyleChange("textAlign", e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>

          <label className="block mb-1 text-sm font-medium">Text Color</label>
          <input
            type="color"
            value={selectedElement.color || "#000000"}
            onChange={(e) => handleChange("color", e.target.value)}
            className="w-full mb-3"
          />
        </>
      )}

      {/* Image Element Settings */}
      {selectedElement.type === "image" && (
        <>
          <label className="block mb-1 text-sm font-medium">Image URL</label>
          <input
            type="text"
            value={selectedElement.src || ""}
            onChange={(e) => handleChange("src", e.target.value)}
            className="w-full mb-3 p-2 border rounded text-sm"
            placeholder="https://..."
          />
        </>
      )}

      {/* Button Element Settings */}
      {selectedElement.type === "button" && (
        <>
          <label className="block mb-1 text-sm font-medium">Button Text</label>
          <input
            type="text"
            value={selectedElement.content || ""}
            onChange={(e) => handleChange("content", e.target.value)}
            className="w-full mb-3 p-2 border rounded text-sm"
          />

          <label className="block mb-1 text-sm font-medium">
            Background Color
          </label>
          <input
            type="color"
            value={selectedElement.backgroundColor || "#ffffff"}
            onChange={(e) =>
              handleChange("backgroundColor", e.target.value)
            }
            className="w-full mb-3"
          />

          <label className="block mb-1 text-sm font-medium">Text Color</label>
          <input
            type="color"
            value={selectedElement.color || "#000000"}
            onChange={(e) => handleChange("color", e.target.value)}
            className="w-full mb-3"
          />
        </>
      )}
    </div>
  );
};

export default EditPanel;
