const parseSearchKeyword = (searchString: string) => {
  // * searchString contains the pattern you want to search for, which includes a single quote (O'Connell).
  // * .replace(/'/g, "''") is used to escape the single quote in the searchString by replacing each single quote with two single quotes.
  return searchString.replace(/'/g, "''");
};
export default parseSearchKeyword;
