// /components/Keypad.tsx
import React from 'react';

type KeypadProps = {
  onInput: (value: string) => void;
  onSubmit: () => void;
  onBackspace: () => void;
};

const Keypad: React.FC<KeypadProps> = ({ onInput, onSubmit, onBackspace }) => {
  return (
    <div className="absolute bottom-4 w-full max-w-md px-4">
      <div className="grid grid-cols-3 gap-2 bg-black bg-opacity-50 p-4 rounded-lg">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            className="text-white text-xl bg-transparent border border-white py-4 rounded-md"
            onClick={() => onInput(num.toString())}
          >
            {num}
          </button>
        ))}
        <button
          className="col-span-1 text-white text-xl bg-transparent border border-white py-4 rounded-md"
          onClick={onBackspace}
        >
          Backspace
        </button>
        <button
          className="col-span-1 text-white text-xl bg-transparent border border-white py-4 rounded-md"
          onClick={() => onInput('0')}
        >
          0
        </button>
        <button
          className="col-span-1 text-white text-xl bg-transparent border border-white py-4 rounded-md"
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Keypad;
