import React from 'react';

const steps = [
  { label: 'Quote' },
  { label: 'Application' },
  { label: 'Payment Status' },
];

const ProgressBar = ({ step }) => {
  return (
    <div className="flex items-center justify-center my-6">
      {steps.map((s, idx) => {
        const isActive = step === idx + 1;
        const isCompleted = step > idx + 1;
        return (
          <React.Fragment key={s.label}>
            <div className="flex flex-col items-center">
              <div
                className={`rounded-full w-9 h-9 flex items-center justify-center font-bold text-white transition-all duration-300
                  ${isActive ? 'bg-blue-600 scale-110 shadow-lg' : isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                {idx + 1}
              </div>
              <span className={`mt-2 text-xs font-medium ${isActive ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-500'}`}>{s.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${step > idx + 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressBar; 