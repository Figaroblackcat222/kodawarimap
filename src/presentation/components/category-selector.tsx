import { useState } from "react";
import { PRESET_CATEGORIES, type Category } from "@domain/entities/category";
import { useMediaQuery } from "@presentation/hooks/use-media-query";

interface Props {
  selected: Category;
  onChange: (category: Category) => void;
  bottom: number;
}

export function CategorySelector({ selected, onChange, bottom }: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
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
        display: "flex",
        gap: 8,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
        borderRadius: 24,
        padding: "6px 10px",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15)",
        zIndex: 10,
        transition: "all 0.2s ease",
        overflow: "hidden",
      }}
    >
      {isOpen ? (
        PRESET_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat)}
            style={{
              border: "none",
              borderRadius: 18,
              padding: "6px 14px",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: selected.id === cat.id ? 700 : 400,
              background: selected.id === cat.id ? cat.markerColor : "transparent",
              color: selected.id === cat.id ? "#fff" : "#1a1a2e",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            {cat.emoji}
            {isDesktop && ` ${cat.name}`}
          </button>
        ))
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
          }}
        >
          {selected.emoji}
          {isDesktop && ` ${selected.name}`}
        </button>
      )}
    </div>
  );
}
