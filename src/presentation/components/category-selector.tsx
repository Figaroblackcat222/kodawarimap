import { useState } from "react";
import { PRESET_CATEGORIES, type Category } from "@domain/entities/category";

interface Props {
  selected: Category;
  onChange: (category: Category) => void;
  bottom: number;
}

export function CategorySelector({ selected, onChange, bottom }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (cat: Category) => {
    onChange(cat);
    setIsOpen(false);
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
        borderRadius: isOpen ? 16 : 24,
        padding: isOpen ? "10px" : "6px 10px",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15)",
        zIndex: 10,
        transition: "all 0.2s ease",
      }}
    >
      {isOpen ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
          }}
        >
          {PRESET_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat)}
              style={{
                border: "none",
                borderRadius: 12,
                padding: "7px 12px",
                fontSize: 13,
                cursor: "pointer",
                fontWeight: selected.id === cat.id ? 700 : 400,
                background: selected.id === cat.id ? cat.markerColor : "rgba(0,0,0,0.05)",
                color: selected.id === cat.id ? "#fff" : "#1a1a2e",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                textAlign: "left",
              }}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            border: "none",
            borderRadius: 18,
            padding: "6px 14px",
            fontSize: 13,
            cursor: "pointer",
            fontWeight: 700,
            background: selected.markerColor,
            color: "#fff",
            whiteSpace: "nowrap",
            display: "block",
          }}
        >
          {selected.emoji} {selected.name}
        </button>
      )}
    </div>
  );
}
