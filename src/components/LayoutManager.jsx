import React, { useState, useEffect } from "react";

export default function LayoutManager({ elements, setElements }) {
  const [templates, setTemplates] = useState({});
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState("");

  // Load templates and last used layout from localStorage on mount
  useEffect(() => {
    const all = localStorage.getItem('dragdrop-layouts');
    if (all) {
      try {
        const parsed = JSON.parse(all);
        setTemplates(parsed);
        if (parsed.__lastUsed && parsed[parsed.__lastUsed]) {
          setElements(parsed[parsed.__lastUsed]);
        }
      } catch {}
    }
    // eslint-disable-next-line
  }, []);

  // Save all templates to localStorage
  const saveTemplates = (newTemplates) => {
    localStorage.setItem('dragdrop-layouts', JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  };

  // Save current layout as a new template
  const handleSave = () => {
    setShowSaveModal(true);
  };

  const handleSaveConfirm = () => {
    let name = saveName.trim();
    if (!name) return;
    const newTemplates = { ...templates, [name]: elements, __lastUsed: name };
    saveTemplates(newTemplates);
    setSaveName("");
    setShowSaveModal(false);
    alert('Layout saved as "' + name + '"!');
  };

  // Load a template by name
  const handleLoad = (name) => {
    if (templates[name]) {
      setElements(templates[name]);
      const newTemplates = { ...templates, __lastUsed: name };
      saveTemplates(newTemplates);
      setShowTemplates(false);
    }
  };

  // Delete a template by name
  const handleDelete = (name) => {
    if (!window.confirm(`Delete template "${name}"?`)) return;
    const newTemplates = { ...templates };
    delete newTemplates[name];
    if (newTemplates.__lastUsed === name) delete newTemplates.__lastUsed;
    saveTemplates(newTemplates);
  };

  // Reset layout
  const handleReset = () => {
    setElements([]);
  };

  // List of template names (exclude __lastUsed)
  const templateNames = Object.keys(templates).filter((k) => k !== "__lastUsed");

  return (
    <>
      <div className="absolute bottom-2 left-80 z-40 flex gap-2">
        <button onClick={handleSave} className="bg-indigo-600 text-white px-3 py-1 rounded shadow text-xs md:text-sm">Save as Template</button>
        <button onClick={() => setShowTemplates(v => !v)} className="bg-gray-200 text-gray-800 px-3 py-1 rounded shadow text-xs md:text-sm">Templates</button>
        <button onClick={handleReset} className="bg-red-100 text-red-700 px-3 py-1 rounded shadow text-xs md:text-sm">Reset</button>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-4 min-w-[250px] max-w-[90vw] flex flex-col gap-2">
            <h3 className="font-semibold text-base mb-2">Save Template</h3>
            <input
              type="text"
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              placeholder="Template name"
              className="border rounded px-2 py-1 text-sm"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button onClick={handleSaveConfirm} className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">Save</button>
              <button onClick={() => setShowSaveModal(false)} className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal/Dropdown */}
      {showTemplates && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-4 min-w-[250px] max-w-[90vw]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-base">Templates</h3>
              <button onClick={() => setShowTemplates(false)} className="text-gray-500 hover:text-gray-800">✕</button>
            </div>
            {templateNames.length === 0 && <div className="text-gray-500 text-sm">No templates saved.</div>}
            <ul className="space-y-2 max-h-60 overflow-auto">
              {templateNames.map(name => (
                <li key={name} className="flex items-center justify-between gap-2">
                  <span className="truncate max-w-[120px] md:max-w-[200px]" title={name}>{name}</span>
                  <div className="flex gap-1">
                    <button onClick={() => handleLoad(name)} className="bg-indigo-500 text-white px-2 py-1 rounded text-xs">Load</button>
                    <button onClick={() => handleDelete(name)} className="bg-red-200 text-red-700 px-2 py-1 rounded text-xs">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
