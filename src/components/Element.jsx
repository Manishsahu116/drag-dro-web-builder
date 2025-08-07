// src/components/Element.jsx
import React, { useRef } from "react";

export default function Element({
    element,
    isSelected,
    setSelectedId,
    setElements,
}) {
    const elementRef = useRef(null);
    const startDrag = (e) => {
        e.stopPropagation();
        setSelectedId(element.id);

        let prevX = e.clientX;
        let prevY = e.clientY;

        const onMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - prevX;
            const dy = moveEvent.clientY - prevY;

            setElements((prev) =>
                prev.map((el) =>
                    el.id === element.id
                        ? {
                            ...el,
                            x: el.x + dx,
                            y: el.y + dy,
                        }
                        : el
                )
            );

            prevX = moveEvent.clientX;
            prevY = moveEvent.clientY;
        };

        const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    const startResize = (e) => {
        e.stopPropagation();
        e.preventDefault();

        let startX = e.clientX;
        let startY = e.clientY;

        const onMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;

            setElements((prev) =>
                prev.map((el) =>
                    el.id === element.id
                        ? {
                            ...el,
                            width: `${parseInt(el.width || 100) + dx}px`,
                            height: `${parseInt(el.height || 50) + dy}px`,
                        }
                        : el
                )
            );

            startX = moveEvent.clientX;
            startY = moveEvent.clientY;
        };

        const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    const handleDelete = () => {
        setElements((prev) => prev.filter((el) => el.id !== element.id));
        setSelectedId(null);
    };

    const handleDuplicate = () => {
        const newId = crypto.randomUUID();
        const offset = 40; // try 40px instead of 20

        const newEl = {
            ...element,
            id: newId,
            x: element.x + offset,
            y: element.y + offset,
        };

        setElements((prev) => [...prev, newEl]);
        setSelectedId(newId); // Focus newly created one
    };

    const getStyle = () => ({
        position: "absolute",
        top: element.y,
        left: element.x,
        width: element.width || "auto",
        height: element.height || "auto",
        padding: element.padding || "0",
        color: element.color || "#000",
        backgroundColor: element.backgroundColor || "transparent",
        fontSize: element.fontSize || "inherit",
        cursor: "move",
        border: isSelected ? "2px solid #6366f1" : "none",
        zIndex: isSelected ? 10 : 1,
        userSelect: "none",
    });

    const renderElement = () => {
        switch (element.type) {
            case "text":
                return <p>{element.content}</p>;
            case "image":
                return (
                    <img
                        src={element.src}
                        alt="Image"
                        className="rounded"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                        }}
                    />
                );
            case "button":
                return (
                    <button
                        className="rounded px-4 py-2 w-full h-full"
                        style={{ backgroundColor: element.backgroundColor, color: element.color }}
                    >
                        {element.content}
                    </button>
                );
            default:
                return null;
        }
    };

    return (
        <div
            ref={elementRef}
            style={getStyle()}
            onMouseDown={startDrag}
            className="group relative transition duration-200 ease-in-out touch-none"
        >
            {isSelected && (
                <div className="absolute -top-8 md:-top-6 right-0 flex gap-2 z-20">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicate();
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-base md:text-xs px-3 md:px-2 py-2 md:py-1 rounded shadow border min-w-[36px] min-h-[36px] md:min-w-0 md:min-h-0"
                        style={{ touchAction: 'manipulation' }}
                    >
                        ⧉
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete();
                        }}
                        className="bg-red-100 hover:bg-red-200 text-base md:text-xs px-3 md:px-2 py-2 md:py-1 rounded shadow border text-red-700 min-w-[36px] min-h-[36px] md:min-w-0 md:min-h-0"
                        style={{ touchAction: 'manipulation' }}
                    >
                        ✕
                    </button>
                </div>
            )}

            {renderElement()}

            {isSelected && (
                <div
                    onMouseDown={startResize}
                    className="absolute bottom-0 right-0 w-5 h-5 md:w-3 md:h-3 bg-indigo-600 cursor-nwse-resize rounded-tr-sm"
                    style={{ touchAction: 'manipulation' }}
                ></div>
            )}
        </div>
    );
}
