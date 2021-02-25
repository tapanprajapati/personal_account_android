const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'September',
  'October',
  'November',
  'December',
];

function getMonthName(num) {
  if (num < 1 || num > 12) {
    console.log(`Invalid month number: ${num}`);
    return;
  }
  return months[num];
}
