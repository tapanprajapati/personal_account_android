const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function getMonthName(num) {
  num = parseInt(num);
  if (!num) {
    return;
  }
  if (num < 1 || num > 12) {
    console.log(`Invalid month number: ${num}`);
    return;
  }
  return months[num - 1];
}

export function getSelectedCategories(categories) {
  let selectedCats = [];
  categories.forEach((category) => {
    if (category.status) {
      selectedCats.push(category.category.id);
    }
  });

  return selectedCats;
}
