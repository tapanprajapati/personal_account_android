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

export function formatLargeNumber(num) {
  numStr = parseInt(num).toString();
  const len = numStr.length;

  if (len >= 8) {
    return `${numStr.substr(0, 2)}.${numStr.substr(2, 2)} M`;
  }

  if (len >= 5) {
    return `${numStr.substr(0, 2)}.${numStr.substr(2, 2)} K`;
  }

  return num.toFixed(2);
}
