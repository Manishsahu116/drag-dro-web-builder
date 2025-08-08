import React, { useCallback, memo } from "react";

// Helper function to safely update nested objects
const setIn = (obj, path, value) => {
  const newObj = { ...obj };
  let current = newObj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  current[path[path.length - 1]] = value;
  return newObj;
};

// Memoized Helper Components
const NumberInput = memo(({ label, value, onChange }) => (
  <div>
    <label className="block mb-1 text-sm font-medium capitalize">
      {label}
    </label>
    <input
      type="number"
      value={value ?? ""}
      onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
      className="w-full p-2 border rounded text-sm"
    />
  </div>
));

const TextInput = memo(({ label, value, onChange, placeholder = "" }) => (
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
));

const ColorInput = memo(({ label, value, onChange }) => (
  <>
    <label className="block mb-1 text-sm font-medium">{label}</label>
    <input
      type="color"
      value={value || "#000000"}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mb-4"
    />
  </>
));

const EditPanel = ({
  selectedId,
  elements,
  updateElement,
  showEditPanel,
  setShowEditPanel,
}) => {
  const selectedElement = elements.find((el) => el.id === selectedId);
  const styles = selectedElement?.styles || {};

  // Memoized generic handler for any property path
  const handleUpdate = useCallback(
    (path, value) => {
      if (!selectedElement) return;
      const updatedElement = setIn(selectedElement, path, value);
      updateElement(selectedId, updatedElement);
    },
    [selectedElement, selectedId, updateElement]
  );

  if (!selectedElement) {
    return (
      <div className={`fixed md:static inset-y-0 right-0 z-40 bg-white w-full md:w-72 p-4 overflow-y-auto border-l shadow-lg transform transition-transform duration-300 ${
          showEditPanel ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0`}>
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-lg font-semibold text-gray-800">Edit Element</h2>
          <button onClick={() => setShowEditPanel(false)} className="text-gray-900 text-xl" aria-label="Close edit panel">✕</button>
        </div>
        <p className="text-gray-500 text-sm">No element selected.</p>
      </div>
    );
  }

  const { type } = selectedElement;

  return (
    <div
      className={`fixed md:static inset-y-0 right-0 z-40 bg-white w-full md:w-72 p-4 overflow-y-auto border-l shadow-lg transform transition-transform duration-300 ${
        showEditPanel ? "translate-x-0" : "translate-x-full"
      } md:translate-x-0`}
      style={{ maxHeight: "100dvh" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 md:hidden">
        <h2 className="text-lg font-semibold text-gray-800">Edit Element</h2>
        <button
          onClick={() => setShowEditPanel(false)}
          className="text-gray-900 text-xl"
          aria-label="Close edit panel"
        >
          ✕
        </button>
      </div>

      <>
        {/* Position & Size */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <NumberInput label="x" value={selectedElement.x} onChange={(val) => handleUpdate(['x'], val)} />
          <NumberInput label="y" value={selectedElement.y} onChange={(val) => handleUpdate(['y'], val)} />
          <NumberInput label="width" value={selectedElement.width} onChange={(val) => handleUpdate(['width'], val)} />
          <NumberInput label="height" value={selectedElement.height} onChange={(val) => handleUpdate(['height'], val)} />
        </div>

        {/* Dynamic Controls based on Element Type */}
        {type === "text" && (
          <div className="mb-4">
            <TextInput label="Text" value={selectedElement.content} onChange={(val) => handleUpdate(['content'], val)} />
            <NumberInput label="Font Size (px)" value={parseInt(styles.fontSize || "16", 10)} onChange={(val) => handleUpdate(['styles', 'fontSize'], `${val}px`)} />
            
            <label className="block mb-1 text-sm font-medium">Font Family</label>
            <select
              value={styles.fontFamily || "sans-serif"}
              onChange={(e) => handleUpdate(['styles', 'fontFamily'], e.target.value)}
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
              onChange={(e) => handleUpdate(['styles', 'textAlign'], e.target.value)}
              className="w-full mb-3 p-2 border rounded"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
            
            <ColorInput label="Text Color" value={styles.color} onChange={(val) => handleUpdate(['styles', 'color'], val)} />
          </div>
        )}

        {type === "image" && (
          <div className="mb-4">
            <TextInput label="Image URL" value={selectedElement.src} onChange={(val) => handleUpdate(['src'], val)} placeholder="https://..." />
          </div>
        )}

        {type === "button" && (
          <div className="mb-4">
            <TextInput label="Button Text" value={selectedElement.content} onChange={(val) => handleUpdate(['content'], val)} />
            <ColorInput label="Background Color" value={styles.backgroundColor} onChange={(val) => handleUpdate(['styles', 'backgroundColor'], val)} />
            <ColorInput label="Text Color" value={styles.color} onChange={(val) => handleUpdate(['styles', 'color'], val)} />
          </div>
        )}
      </>
    </div>
  );
};

export default EditPanel;