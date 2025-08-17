import { useState } from 'react';

export const FaqItem = ({ question, answer, icon}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4">
      <button
        className="flex justify-between items-center w-full p-4 text-left font-roboto font-bold bg-[#E6938B] rounded-lg shadow-md"
        onClick={toggleAccordion}
      >
        <div className="flex items-center gap-4">
          {icon}
          <span className="text-sm md:text-base">{question}</span>
        </div>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          &#9660;
        </span>
      </button>

      {isOpen && (
        <div className="py-2 text-gray-muted">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};