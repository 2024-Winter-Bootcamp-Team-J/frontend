// App.tsx
import React, { useState } from "react";
import Login from "../src/modal/userModal/Register";

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={openModal}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        로그인
      </button>

      {isModalOpen && <Login onClose={closeModal} />}
    </div>
  );
};

export default App;
