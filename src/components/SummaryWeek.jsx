import { useEffect, useState } from "react";

function SummaryWeek() {
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/data/total");
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        console.log("Summary Data:", data);

        const today = new Date();
        const monthNow = today.getMonth() + 1;
        const yearNow = today.getFullYear();

        setCurrentMonth(monthNow - 1);
        setCurrentYear(yearNow);

        //filter agar yang muncul cuma bulan saat ini
        const weeklyData = Array.isArray(data.weekly) ? data.weekly : [];
        const monthlyData = Array.isArray(data.monthly) ? data.monthly : [];

        const filteredWeekly = weeklyData.filter(
          (w) => w.month === monthNow && w.year === yearNow
        );
        const filteredMonthly = monthlyData.filter(
          (m) => m.month === monthNow && m.year === yearNow
        );

        setWeekly(filteredWeekly);
        setMonthly(filteredMonthly);
      } catch (err) {
        console.error("Error:", err);
        setWeekly([]);
        setMonthly([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p>Loading...</p>;

  // 🔹 Biar fix 4 minggu
  const weeks = [1, 2, 3, 4];

  return (
    <div>
      <h2 className="font-bold text-lg mb-2">
        Weekly Summary in {monthNames[currentMonth]} {currentYear}
      </h2>

      <table className="w-60 h-96 border-collapse border border-gray-300 text-md shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border border-gray-300 px-4 py-2 w-1/2">Week</th>
            <th className="border border-gray-300 px-4 py-2 w-1/2">Spending</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((weekNum, idx) => {
            const found = weekly.find((w) => w.week === weekNum);
            const spending = found ? found.totalSpending : 0;

            return (
              <tr
                key={weekNum}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="border border-gray-300 px-4 py-2 text-center w-1/2">
                  Week-{weekNum}
                </td>
                <td className="border border-gray-300 px-4 py-2 font-semibold text-right w-1/2">
                  Rp {spending.toLocaleString("id-ID")}
                </td>
              </tr>
            );
          })}

          {/* 🔹 Row total bulan */}
          {monthly.length > 0 && (
            <tr className="bg-green-100 font-bold">
              <td className="border  border-gray-300 px-4 py-2 text-center text-green-700 w-1/2">
                Total Monthly Spending
              </td>
              <td className="border  border-gray-300 px-4 py-2 text-right text-green-700 w-1/2">
                Rp {monthly[0].monthlyTotal.toLocaleString("id-ID")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SummaryWeek;
