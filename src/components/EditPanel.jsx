// src/components/EditPanel.jsx
import React from "react";

const EditPanel = ({
  selectedId,
  elements,
  updateElement,
  showEditPanel,
  setShowEditPanel,
}) => {
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

  if (!selectedElement) {
    return null;
  }

  // Common input for number fields (x, y, width, height, etc.)
  const NumberInput = ({ label, field, value, onChange }) => (
    <div>
      <label className="block mb-1 text-sm font-medium capitalize">
        {label}
      </label>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(field, parseInt(e.target.value, 10) || 0)}
        className="w-full p-2 border rounded text-sm"
      />
    </div>
  );

  // Common input for text fields
  const TextInput = ({ label, value, onChange, placeholder = "" }) => (
    <>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mb-3 p-2 border rounded text-sm"
        placeholder={placeholder}
      />
    </>
  );

  // Common input for color fields
  const ColorInput = ({ label, value, onChange }) => (
    <>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mb-4"
      />
    </>
  );

  return (
    <div
      className={`fixed md:static inset-y-0 right-0 z-40 bg-white w-full md:w-72 p-4 overflow-y-auto border-l shadow-lg transform transition-transform duration-300 ${
        showEditPanel ? "translate-x-0" : "translate-x-full"
      } md:translate-x-0`}
      style={{ maxHeight: "100dvh" }}
    >
      {/* Mobile Close Button */}
      <div className="flex justify-between items-center mb-4 md:hidden">
        <h2 className="text-lg font-semibold text-gray-800">Edit Element</h2>
        <button
          onClick={() => setShowEditPanel(false)}
          className="text-gray-900"
          aria-label="Close edit panel"
        >
          ✕
        </button>
      </div>

      {/* Position & Size */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <NumberInput
          label="x"
          field="x"
          value={selectedElement.x}
          onChange={handleChange}
        />
        <NumberInput
          label="y"
          field="y"
          value={selectedElement.y}
          onChange={handleChange}
        />
        <NumberInput
          label="width"
          field="width"
          value={selectedElement.width}
          onChange={handleChange}
        />
        <NumberInput
          label="height"
          field="height"
          value={selectedElement.height}
          onChange={handleChange}
        />
      </div>

      {/* Text Settings */}
      {selectedElement.type === "text" && (
        <>
          <TextInput
            label="Text"
            value={selectedElement.content}
            onChange={(value) => handleChange("content", value)}
          />

          <NumberInput
            label="Font Size"
            field="fontSize"
            value={parseInt(styles.fontSize, 10) || 16}
            onChange={(field, value) => handleStyleChange(field, `${value}px`)}
          />

          <label className="block mb-1 text-sm font-medium">Font Family</label>
          <select
            value={styles.fontFamily || "sans-serif"}
            onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
            className="w-full mb-3 p-2 border rounded"
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
            className="w-full mb-3 p-2 border rounded"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>

          <ColorInput
            label="Text Color"
            value={styles.color}
            onChange={(value) => handleStyleChange("color", value)}
          />
        </>
      )}

      {/* Image Settings */}
      {selectedElement.type === "image" && (
        <TextInput
          label="Image URL"
          value={selectedElement.src}
          onChange={(value) => handleChange("src", value)}
          placeholder="https://..."
        />
      )}

      {/* Button Settings */}
      {selectedElement.type === "button" && (
        <>
          <TextInput
            label="Button Text"
            value={selectedElement.content}
            onChange={(value) => handleChange("content", value)}
          />
          <ColorInput
            label="Background Color"
            value={styles.backgroundColor}
            onChange={(value) => handleStyleChange("backgroundColor", value)}
          />
          <ColorInput
            label="Text Color"
            value={styles.color}
            onChange={(value) => handleStyleChange("color", value)}
          />
        </>
      )}
    </div>
  );
};

export default EditPanel;