# 🚀 Drag-and-Drop Website Builder

This is a sleek and responsive browser-based drag-and-drop website builder. It allows users to visually compose web layouts by dragging elements like text, images, and buttons onto a canvas, customizing their appearance and layout in real-time.

Built using **React**, **Tailwind CSS**, and **@dnd-kit**, the application is optimized for both desktop and mobile devices and supports template saving, layout import/export, and live editing.

---

## 🌟 Features

* **Drag-and-Drop:** Easily add text, image, and button elements to the canvas from the sidebar using drag functionality or the quick "Add" button.
* **Real-time Editing:** Select an element to instantly modify its:

  * Content (text, image URL, button label)
  * Position & size
  * Styling (font, font size, color, background, border, etc.)
* **Responsive Design:** Fully optimized UI for both desktop and mobile. Mobile users get a collapsible properties panel and intuitive editing controls.
* **Element Actions:** Quickly resize, move, duplicate, or delete any component on the canvas.
* **Template Management:** Save multiple custom layouts locally and reuse them anytime via the Layout Manager.
* **Snap-to-Grid (Optional):** Smart alignment for elements when moved.

---

## 🛠 Getting Started

### 💡 Add Elements

* Drag an item from the **Sidebar** to the canvas.
* Or click the ➕ **Add** button next to any element type for instant placement.

### ✏️ Edit Elements

* Click or tap an element to **select** it.
* The **Edit Panel** appears on the right (or via edit icon on mobile).
* Modify text, colors, styles, borders, dimensions, and more.

### 📐 Move & Resize

* Drag to **move** an element.
* Use the visible **resize handles** on hover to change size.

### 💾 Save/Load Layouts

* Open the **Layout Manager** to save your current canvas with a name.
* Load or delete saved layouts with a single click.

### 📤 Import / 📥 Export

* Copy/paste layout JSON in the Layout Manager to export or import designs.

---

## 📱 Mobile Experience

* UI adjusts automatically for smaller screens.
* Edit Panel collapses into a toggleable drawer.
* Edit buttons appear on each selected element.
* Fully touch-compatible drag-and-drop and resizing.

---

## ⚙️ Technical Stack

| Tool             | Purpose                                   |
| ---------------- | ----------------------------------------- |
| **React**        | Core framework for UI and component logic |
| **Tailwind CSS** | Rapid, responsive styling                 |
| **@dnd-kit**     | Drag-and-drop functionality (touch-ready) |
| **react-icons**  | Icons for UI interaction                  |
| **localStorage** | Saving/loading layouts locally            |

---

## 📂 Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx        # Element toolbox
│   ├── Canvas.jsx         # Drop area for elements
│   ├── EditPanel.jsx      # Property editor for selected elements
│   ├── LayoutManager.jsx  # Save/load/import/export UI
├── App.jsx                # Main app layout and state management
├── main.jsx               # App entry point
```

---

## ✅ To Do / Improvements

* Add support for additional components (videos, forms, headers, etc.)
* Add image uploading from local device
* Enable undo/redo functionality
* Introduce multi-select and group editing

---

## 📧 Author

**Manish Sahu**
📧 [sahumanish2969@gmail.com](mailto:sahumanish2969@gmail.com)