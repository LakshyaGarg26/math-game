'use client';

import React from 'react';

type AnswerInputProps = {
  userInput: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const AnswerInput: React.FC<AnswerInputProps> = ({ userInput, onChange }) => {
  return (
    <div className="absolute bottom-80 w-full max-w-md px-4 mb-2">
      <input
        type="text"
        value={userInput}
        onChange={onChange}
        className="w-full p-4 text-lg text-white bg-transparent border-2 border-white rounded-md placeholder-white text-center"
        placeholder="Enter answer"
        readOnly
      />
    </div>
  );
};

export default AnswerInput;
