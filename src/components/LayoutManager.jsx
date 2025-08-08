// src/components/LayoutManager.jsx
import React, { useState, useEffect } from "react";

export default function LayoutManager({ elements, setElements }) {
  const [templates, setTemplates] = useState({});
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState("");

  useEffect(() => {
    const all = localStorage.getItem("dragdrop-layouts");
    if (all) {
      try {
        const parsed = JSON.parse(all);
        setTemplates(parsed);
        if (parsed.__lastUsed && parsed[parsed.__lastUsed]) {
          setElements(parsed[parsed.__lastUsed]);
        }
      } catch {}
    }
  }, []);

  const saveTemplates = (newTemplates) => {
    localStorage.setItem("dragdrop-layouts", JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  };

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
    alert(`Layout saved as "${name}"!`);
  };

  const handleLoad = (name) => {
    if (templates[name]) {
      setElements(templates[name]);
      const newTemplates = { ...templates, __lastUsed: name };
      saveTemplates(newTemplates);
      setShowTemplates(false);
    }
  };

  const handleDelete = (name) => {
    if (!window.confirm(`Delete template "${name}"?`)) return;
    const newTemplates = { ...templates };
    delete newTemplates[name];
    if (newTemplates.__lastUsed === name) delete newTemplates.__lastUsed;
    saveTemplates(newTemplates);
  };

  const handleReset = () => {
    setElements([]);
  };

  const templateNames = Object.keys(templates).filter((k) => k !== "__lastUsed");

  return (
    <>
      {/* Bottom Control Panel */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex flex-wrap gap-2 justify-center px-2">
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-3 py-1 rounded shadow text-xs md:text-sm"
        >
          Save as Template
        </button>
        <button
          onClick={() => setShowTemplates((v) => !v)}
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded shadow text-xs md:text-sm"
        >
          Templates
        </button>
        <button
          onClick={handleReset}
          className="bg-red-100 text-red-700 px-3 py-1 rounded shadow text-xs md:text-sm"
        >
          Reset
        </button>
      </div>

      {/* Save Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg p-4 w-full max-w-sm space-y-3">
            <h3 className="font-semibold text-base">Save Template</h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Template name"
              className="border rounded px-2 py-1 text-sm w-full"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleSaveConfirm}
                className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg p-4 w-full max-w-sm max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-base">Templates</h3>
              <button
                onClick={() => setShowTemplates(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            {templateNames.length === 0 ? (
              <p className="text-gray-500 text-sm">No templates saved.</p>
            ) : (
              <ul className="space-y-2">
                {templateNames.map((name) => (
                  <li
                    key={name}
                    className="flex items-center justify-between gap-2"
                  >
                    <span
                      className="truncate max-w-[160px] md:max-w-[220px]"
                      title={name}
                    >
                      {name}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleLoad(name)}
                        className="bg-indigo-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(name)}
                        className="bg-red-200 text-red-700 px-2 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
