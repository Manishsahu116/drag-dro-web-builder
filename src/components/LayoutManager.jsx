import React, { useState, useEffect, useCallback, memo } from "react";

// Memoized modal components for better performance
const SaveTemplateModal = memo(({ saveName, setSaveName, onSave, onClose }) => (
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
          onClick={onSave}
          className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
));

const TemplatesListModal = memo(({ templates, onSelect, onDelete, onClose }) => {
  const templateNames = Object.keys(templates).filter((k) => k !== "__lastUsed");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-lg p-4 w-full max-w-sm max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-base">Templates</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close templates modal">
            ✕
          </button>
        </div>
        {templateNames.length === 0 ? (
          <p className="text-gray-500 text-sm">No templates saved.</p>
        ) : (
          <ul className="space-y-2">
            {templateNames.map((name) => (
              <li key={name} className="flex items-center justify-between gap-2">
                <span className="truncate max-w-[160px] md:max-w-[220px]" title={name}>
                  {name}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => onSelect(name)}
                    className="bg-indigo-500 text-white px-2 py-1 rounded text-xs"
                    aria-label={`Load template ${name}`}
                  >
                    Load
                  </button>
                  <button
                    onClick={() => onDelete(name)}
                    className="bg-red-200 text-red-700 px-2 py-1 rounded text-xs"
                    aria-label={`Delete template ${name}`}
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
  );
});

export default function LayoutManager({ elements, setElements }) {
  const [templates, setTemplates] = useState({});
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState("");

  const saveTemplates = useCallback((newTemplates) => {
    localStorage.setItem("dragdrop-layouts", JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  }, []);

  useEffect(() => {
    const all = localStorage.getItem("dragdrop-layouts");
    if (all) {
      try {
        const parsed = JSON.parse(all);
        setTemplates(parsed);
        if (parsed.__lastUsed && parsed[parsed.__lastUsed]) {
          setElements(parsed[parsed.__lastUsed]);
        }
      } catch (error) {
        console.error("Failed to parse layouts from localStorage:", error);
      }
    }
  }, [setElements]);

  const handleSaveConfirm = useCallback(() => {
    let name = saveName.trim();
    if (!name) return;
    const newTemplates = { ...templates, [name]: elements, __lastUsed: name };
    saveTemplates(newTemplates);
    setSaveName("");
    setShowSaveModal(false);
    // Use a non-blocking UI for notifications instead of alert
    // e.g., A toast or a small pop-up
    console.log(`Layout saved as "${name}"!`);
  }, [saveName, elements, templates, saveTemplates]);

  const handleLoad = useCallback((name) => {
    if (templates[name]) {
      setElements(templates[name]);
      const newTemplates = { ...templates, __lastUsed: name };
      saveTemplates(newTemplates);
      setShowTemplates(false);
    }
  }, [templates, setElements, saveTemplates]);

  const handleDelete = useCallback((name) => {
    // Use a custom modal for confirmation instead of window.confirm
    if (window.confirm(`Delete template "${name}"?`)) {
      const newTemplates = { ...templates };
      delete newTemplates[name];
      if (newTemplates.__lastUsed === name) delete newTemplates.__lastUsed;
      saveTemplates(newTemplates);
    }
  }, [templates, saveTemplates]);

  const handleReset = useCallback(() => {
    setElements([]);
  }, [setElements]);

  return (
    <>
      {/* Bottom Control Panel */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex flex-wrap gap-2 justify-center px-2">
        <button
          onClick={() => setShowSaveModal(true)}
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

      {showSaveModal && (
        <SaveTemplateModal
          saveName={saveName}
          setSaveName={setSaveName}
          onSave={handleSaveConfirm}
          onClose={() => setShowSaveModal(false)}
        />
      )}

      {showTemplates && (
        <TemplatesListModal
          templates={templates}
          onSelect={handleLoad}
          onDelete={handleDelete}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </>
  );
}