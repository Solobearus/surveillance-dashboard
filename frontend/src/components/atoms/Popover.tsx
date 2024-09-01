import React, { useRef, useEffect } from "react";

interface PopoverProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Popover: React.FC<PopoverProps> = ({ children, onClose }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={popoverRef} className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
        {children}
      </div>
    </div>
  );
};

export default Popover;
