import { useState } from "react";
import Todo from "./components/Todo";
import Header from "./components/Header";
import Wallet from "./components/Wallet";
import DateTime from "./components/DateTime";

function App() {
  const [wallet, setWallet] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 gap-y-10">
      <Header />
      <DateTime />

      {/* The NEW COMMON CONTAINER for both Wallet and Todo */}
      {/* Increased max-w- to make it wider, added min-h- for taller */}
      <div className="max-w-full w-full bg-white shadow-xl rounded-lg p-6 space-y-8 md:flex md:space-x-6 md:space-y-0 min-h-[500px]">
        {/* Wallet Section */}
        <div className="md:w-1/2">
          <Wallet wallet={wallet} setWallet={setWallet} />
        </div>

        {/* Optional vertical separator for larger screens */}
        <div className="hidden md:block border-l border-gray-300"></div>

        {/* Todo Section */}
        <div className="md:w-1/2">
          <Todo wallet={wallet} setWallet={setWallet} />
        </div>
      </div>
    </div>
  );
}

export default App;
