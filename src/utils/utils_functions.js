
/**
 * Function that deletes an specific element from an array 
 * @param {Array} array - Array where you want to delete an element
 * @param {any} element - Element that you want to delete from the array
 * @returns {Array} Array without the element passed
 */
function delete_element_from_array(element, array) {
  const index = array.indexOf(element);
  if (index !== -1) {
    array.splice(index, 1);
  }
  return array;
}

/**
 * Function that capitalize the first character of a text
 * @param {String} text - Text that you want to capitalize its first character
 * @returns {String} Text with first character capitalized
 */
function capitalized_first_character(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export {
  delete_element_from_array,
  capitalized_first_character
}