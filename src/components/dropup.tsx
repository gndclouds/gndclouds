import { useState } from "react";

interface DropupProps {
  onYearChange: (year: string) => void;
}

const Dropup: React.FC<DropupProps> = ({ onYearChange }) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleYearClick = (year: string) => {
    onYearChange(year);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button className="ruler-button" onClick={handleToggle}>
        Year
      </button>
      {open && (
        <div className="ruler-content">
          <div className="ruler-mark" onClick={() => handleYearClick("2023")}>
            2023
          </div>
          <div className="ruler-mark" onClick={() => handleYearClick("2024")}>
            2024
          </div>
          {/* Add more years as needed */}
        </div>
      )}
    </div>
  );
};

export default Dropup;
