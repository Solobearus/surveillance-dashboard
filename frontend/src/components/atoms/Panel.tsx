import React from "react";

interface PanelProps {
  title: string;
  children: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ title, children }) => {
  return (
    <div className="bg-gray-800 p-4 rounded flex flex-col">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {children}
    </div>
  );
};

export default Panel;
