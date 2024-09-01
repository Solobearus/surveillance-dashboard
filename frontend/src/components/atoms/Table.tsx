import React from "react";

interface TableProps {
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ children }) => {
  return (
    <table className="w-full flex-1 text-sm text-left text-gray-300">
      {children}
    </table>
  );
};

export default Table;
