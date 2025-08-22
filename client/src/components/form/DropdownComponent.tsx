import { useState, useMemo, useEffect, useRef } from "react";

interface DropdownOption {
  label: string;
  value: string | number;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string | number;
  placeholder?: string;
  required?: boolean;
  width?: string;
  onChange: (val: string | number) => void;
  error: string;
}

const DropdownComponent = ({
  label,
  options,
  value,
  placeholder = "Select...",
  required = false,
  width = "100%",
  onChange,
  error,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options by search query
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options]);

  // Find label for current value
  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="form-field relative"
      style={{ width }}
      ref={containerRef}
      tabIndex={0}
      aria-haspopup="listbox"
    >
      <label className="flex gap-x-1 text-gray-700 font-medium dark:text-gray-light2">
        {label} {required && <p className="text-red-600">*</p>}
      </label>

      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="dropdown-list"
        aria-labelledby="dropdown-label"
        tabIndex={0}
        onClick={() => setIsOpen((val) => !val)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
          }
          if (e.key === "Escape") setIsOpen(false);
        }}
        className={`w-full px-3 py-2 rounded-md bg-white border dark:bg-gray-50/10 dark:border-none ${
          isOpen ? "border-blue-400 ring-2 ring-blue-200" : "border-gray-300"
        } text-sm flex items-center justify-between cursor-pointer`}
        aria-label="Dropdown"
      >
        <span className={selectedLabel ? "text-gray-900" : "text-gray-400"}>
          {selectedLabel || placeholder}
        </span>
        <span className="ml-2 text-gray-500">▾</span>
      </div>

      {isOpen && (
        <div
          id="dropdown-list"
          role="listbox"
          className="absolute mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-md z-10"
        >
          {/* Search bar */}
          <input
            type="text"
            value={search}
            autoFocus
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full px-3 py-2 text-sm border-b border-gray-200 focus:outline-none"
            aria-label="Search options"
          />
          {/* Options list */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                tabIndex={-1}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
                  option.value === value ? "bg-blue-100 text-primary" : ""
                }`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch("");
                  }
                }}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm italic text-gray-400">
              No options found
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default DropdownComponent;
