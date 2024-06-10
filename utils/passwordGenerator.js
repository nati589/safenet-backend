const crypto = require('crypto');

function generateSecurePassword(length = 12) {
  if (length < 12) {
    throw new Error('Password length must be at least 12 characters.');
  }

  // Define character sets
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
  
  // Generate at least 3 characters from each set
  function getRandomChars(charSet, count) {
    const result = [];
    const charSetLength = charSet.length;
    for (let i = 0; i < count; i++) {
      const randomIndex = crypto.randomBytes(1)[0] % charSetLength;
      result.push(charSet[randomIndex]);
    }
    return result.join('');
  }

  const passwordParts = [
    getRandomChars(upperCase, 3),
    getRandomChars(lowerCase, 3),
    getRandomChars(numbers, 3),
    getRandomChars(specialChars, 3)
  ];

  // Fill the remaining length with random characters from all sets combined
  const allChars = upperCase + lowerCase + numbers + specialChars;
  const remainingLength = length - passwordParts.join('').length;
  if (remainingLength > 0) {
    passwordParts.push(getRandomChars(allChars, remainingLength));
  }

  // Shuffle the final password
  const password = passwordParts.join('').split('');
  for (let i = password.length - 1; i > 0; i--) {
    const j = crypto.randomBytes(1)[0] % (i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join('');
}

module.exports = generateSecurePassword;
