export function toTitleCase(text: string) {
  const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i;
  const alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/;
  const wordSeparators = /([ :–—-])/;

  return text
    .split(wordSeparators)
    .map(function (current, index, array) {
      if (
        // Check for small words
        current.search(smallWords) > -1 &&
        // Skip first and last word
        index !== 0 &&
        index !== array.length - 1 &&
        // Ignore title end and subtitle start
        array[index - 3] !== ':' &&
        array[index + 1] !== ':' &&
        // Ignore small words that start a hyphenated phrase
        (array[index + 1] !== '-' || (array[index - 1] === '-' && array[index + 1] === '-'))
      ) {
        return current.toLowerCase();
      }

      // Ignore intentional capitalization
      if (current.substring(1).search(/[A-Z]|\../) > -1) {
        return current;
      }

      // Ignore URLs
      if (array[index + 1] === ':' && array[index + 2] !== '') {
        return current;
      }

      // Capitalize the first letter
      return current.replace(alphanumericPattern, function (match: string) {
        return match.toUpperCase();
      });
    })
    .join('');
}
