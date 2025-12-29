export const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getMonthGrid = (month: Date) => {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const startWeekDay = firstDay.getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  const prevMonthDays = startWeekDay;
  const totalCells = Math.ceil((prevMonthDays + daysInMonth) / 7) * 7;

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayOffset = i - prevMonthDays + 1;
    const cellDate = new Date(month.getFullYear(), month.getMonth(), dayOffset);
    const inCurrentMonth = cellDate.getMonth() === month.getMonth();

    cells.push({
      date: cellDate,
      key: toDateKey(cellDate),
      inCurrentMonth,
    });
  }

  return cells;
};
