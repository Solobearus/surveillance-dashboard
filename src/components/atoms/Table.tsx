// components/styled/Table.tsx
import React from "react";

interface TableProps {
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ children }) => {
  return (
    <table className="w-full text-sm text-left text-gray-300">{children}</table>
  );
};

export default Table;
