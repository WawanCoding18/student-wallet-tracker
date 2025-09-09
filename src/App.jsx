import { useState, useEffect} from "react";
import Todo from "./components/Todo";
import Header from "./components/Header";
import Wallet from "./components/Wallet";
import DateTime from "./components/DateTime";
import SummaryWeek from "./components/SummaryWeek";

function App() {
  const [wallet, setWallet] = useState([]);
  useEffect(() => {
    const fetchFromBackend = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        // Parse JSON
        const result = await res.json();
  
        // Pastikan data valid
        const allData = result.data;
        const latestData = allData[allData.length - 1];

        const loadWallet = latestData.remainBalance

        setWallet([loadWallet])
        console.log(loadWallet)
  
      } catch (err) {
        console.error("Gagal ambil data dari backend:", err);
      }
    };
  
    fetchFromBackend();
  }, []);

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
        <SummaryWeek />
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
