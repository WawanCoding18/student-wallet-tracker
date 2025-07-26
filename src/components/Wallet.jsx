import { useState, useEffect } from "react";

/**
 * Wallet Component
 * Manages wallet balance input and display.
 * Uses localStorage for data persistence across sessions.
 *
 * @param {Array} wallet - Current wallet balance (array with one number)
 * @param {Function} setWallet - Function to update wallet balance
 */
function Wallet({ wallet, setWallet }) {
  const [money, setMoney] = useState("");

  // Handle form submission: prevent default, add new amount, and reset input
  const handleSubmit = (e) => {
    e.preventDefault();
    addMoney();
    setMoney("");
  };

  // Add the entered amount to the wallet after validating the input
  const addMoney = () => {
    if (money === "" || isNaN(money) || parseFloat(money) <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }
    setWallet([parseFloat(money)]);
  };

  // Load wallet data from localStorage when the component mounts
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wallet"));
    if (saved && Array.isArray(saved) && saved.length > 0) {
      setWallet(saved);
    } else {
      setWallet([]);
    }
  }, [setWallet]);

  // Save wallet data to localStorage every time it changes
  useEffect(() => {
    localStorage.setItem("wallet", JSON.stringify(wallet));
  }, [wallet]);

  return (
    <div className="max-w-2xl p-2 bg-white shadow-md rounded-lg min-h-[450px]">
      {/* Main heading for the wallet management section */}
      <h2 className="text-xl font-bold mb-4">Balance Management</h2>

      {/* Form for entering wallet amount */}
      <form onSubmit={handleSubmit} className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Top Up Balance:</h3>

        {/* Input field for entering the amount */}
        <input
          id="moneyInput"
          type="number"
          placeholder="Contoh: 500000"
          value={money}
          onChange={(e) => setMoney(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 mb-4"
        />

        {/* Submit button for saving wallet balance */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-5 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Simpan
        </button>
      </form>

      {/* Section displaying the current wallet balance */}
      <div className="border-t pt-4 flex flex-col items-center">
        <h3 className="text-6xl font-semibold mb-10 text-center">
          Current Balance:
        </h3>
        <ul className="list-none p-0">
          {wallet.length > 0 ? (
            // Display current balance with formatting
            <li className="text-6xl font-bold text-green-700 mb-10 text-center">
              Rp {wallet[0].toLocaleString("id-ID")}
            </li>
          ) : (
            // Fallback if no balance exists
            <li className="text-6xl font-bold text-gray-500 mb-10 text-center">
              There is no balance yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Wallet;
