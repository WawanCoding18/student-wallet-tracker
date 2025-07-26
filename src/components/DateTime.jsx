// DateTime.js
// This component displays the current date formatted in English locale

function DateTime() {
  // Get the current date and time
  const now = new Date();

  // Define formatting options: full weekday, numeric day, month, and year
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Format the current date based on the English locale
  const formatted = now.toLocaleDateString("en-US", options);

  return (
    // Render the formatted date centered with Tailwind styling
    <div className="text-center">
      <p className="text-2xl font-semibold">{formatted}</p>
    </div>
  );
}

export default DateTime;
