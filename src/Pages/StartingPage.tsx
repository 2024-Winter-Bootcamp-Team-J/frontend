import React from 'react';

const StartingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to My App! 🎉</h1>
      <p className="mt-4 text-lg text-gray-700">
        Let's get started by editing <code>startingPage.tsx</code>.
      </p>
    </div>
  );
};

export default StartingPage;