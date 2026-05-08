export function isExpired(expiryDate) {
  // Check if the format is valid (MM/YY)
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(expiryDate)) {
    return false; // Invalid format
  }

  // Parse the expiry month and year
  const [month, year] = expiryDate.split('/').map(Number);

  // Get the current date
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Months are zero-based
  const currentYear = currentDate.getFullYear() % 100; // Get last two digits of the year

  // Check if the expiry date has passed
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return true; // Expired
  }

  return false; // Not expired
}

export function isValidExpiryFormat(expiryDate) {
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  return expiryRegex.test(expiryDate);
}
