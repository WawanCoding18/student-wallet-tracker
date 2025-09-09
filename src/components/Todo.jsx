import { useState, useEffect } from "react";

/**
 * Todo Component
 * Handles creation, listing, and deletion of spending tasks.
 * Stores todos in localStorage and deducts total spending from wallet balance.
 *
 * @param {Array} wallet - Current wallet state (array with one number)
 * @param {Function} setWallet - Function to update the wallet balance
 */
function Todo({ wallet, setWallet }) {
  const [task, setTask] = useState({ text: "", source: "", qty: "", price: "", calculateTotal:""});
  const [todos, setTodos] = useState([]);

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

      if (latestData && latestData.spendingItems) {
        const loadedTodos = latestData.spendingItems.map((item) => ({
          text: item.name,
          source: item.source,
          qty: item.qty,
          price: item.price,
          calculateTotal: item.subtotal, // <== ganti 'subtotal' jadi 'calculateTotal'
        }));
        setTodos(loadedTodos);
        console.log(loadedTodos)
      }

    } catch (err) {
      console.error("Gagal ambil data dari backend:", err);
    }
  };

  fetchFromBackend();
}, []);

  // Load saved tasks from localStorage on component mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("todos"));
    if (saved) setTodos(saved);
  }, []);

  // Persist todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Add a new task if input is valid
  const addTask = () => {
    const { text, source, qty, price } = task;

    // Validate fields: no empty or zero values
    if (!text.trim() || !source || !qty || !price) return;

    const calculateTotal = Number(qty) * Number(price);
    const newTask = { text, source, qty, price, calculateTotal };

    // Add the new task to the existing list by creating a new array (immutable update)
    setTodos([...todos, newTask]);

    setTask({ text: "", source: "", qty: "", price: "" });
  };

  // Remove task by index
  const deleteTask = (index) => {
    const updated = todos.filter((_, i) => i !== index);
    setTodos(updated);
  };

  // Calculate the sum of all task subtotals
  const totalPrice = todos.reduce((acc, todo) => acc + todo.calculateTotal, 0);

  // Handle submit: deduct total from wallet if balance is sufficient
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If the wallet array is empty or undefined, default to 0 to prevent errors.
    const currentMoney = wallet[0] || 0;

    if (currentMoney < totalPrice) {
      alert("Not enough money in wallet!");
      return;
    }

    setWallet([currentMoney - totalPrice]);

    //For connect data frontend to mongoDB thought backend
    try {
      //fetch data from backend
      const response = await fetch("http://localhost:5000/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        //parser to json all of data
        body: JSON.stringify({
          currentBalance: wallet[0],
          totalSpending: totalPrice,
          date: new Date().toISOString(),
          spendingItems: todos.map((item) => ({
            name: item.text,
            source: item.source,
            qty: Number (item.qty),
            price: Number(item.price),
            subtotal: Number(item.calculateTotal)
          })),
        }),
      });

      //response sign the data success to mongodb
      const result = await response.json();
      console.log("Submitted:", result);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="max-w-4xl p-2 bg-white shadow-md rounded-lg min-h-[450px]">
      {/* Labels for input fields */}
      <div className="flex flex-row mb-1 mr-2 gap-x-45">
        <h3 className="text-lg font-semibold">Item:</h3>
        <h3 className="text-lg font-semibold">Source:</h3>
        <h3 className="text-lg font-semibold">Qty:</h3>
        <h3 className="text-lg font-semibold">Price:</h3>
      </div>

      {/* Input section for adding new tasks */}
      <div className="flex flex-row mb-4 gap-x-5">
        <input
          type="text"
          value={task.text}
          onChange={(e) => setTask({ ...task, text: e.target.value })}
          placeholder="Add item"
          className="mb-2 p-2 border border-gray-300 rounded"
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <input
          type="text"
          value={task.source}
          onChange={(e) => setTask({ ...task, source: e.target.value })}
          placeholder="Add source"
          className="mb-2 p-2 border border-gray-300 rounded"
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <input
          type="number"
          value={task.qty}
          onChange={(e) => setTask({ ...task, qty: e.target.value })}
          placeholder="Qty"
          className="mb-2 p-2 border border-gray-300 rounded"
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <input
          type="number"
          value={task.price}
          onChange={(e) => setTask({ ...task, price: e.target.value })}
          placeholder="Price"
          className="mb-2 p-2 border border-gray-300 rounded"
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
      </div>

      {/* Task list section with scroll */}
      <div className="overflow-y-auto max-h-50 border border-gray-300">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="border border-gray-300 p-2">No</th>
              <th className="border border-gray-300 p-2">Item</th>
              <th className="border border-gray-300 p-2">Source</th>
              <th className="border border-gray-300 p-2">Qty</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Subtotal</th>
              <th className="border border-gray-300 p-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo, i) => (
              <tr key={i}>
                <td className="border border-gray-300 p-2 text-center">
                  {i + 1}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {todo.text}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {todo.source}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {todo.qty}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {todo.price}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {todo.calculateTotal}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => deleteTask(i)}
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {/* Display total spending amount */}
            <tr>
              <td
                colSpan="5"
                className="border border-gray-300 p-2 text-center font-bold"
              >
                Total Price: {totalPrice}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Submit button to deduct balance from wallet */}
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            className="w-full bg-green-500 mt-2 text-white p-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Add button for mouse users (alternative to Enter key) */}
      <button
        onClick={addTask}
        className="w-full bg-blue-500 text-white py-2 px-5 mt-10 
        rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Add
      </button>
    </div>
  );
}

export default Todo;
