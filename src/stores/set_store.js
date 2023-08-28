//Imports
import { defineStore } from "pinia";
import axios from "../config/axios";

//Set store
export const useSetStore = defineStore("set", () => {
  //Methods
  /**
   * Function that creates a new set
   * @param {Object} data - Object with:
   * {number} id_exercise. It is required
   * {number} weight. It is required. Admits 5 digits and 2 decimals
   * {string} rest_after_set. It is required.  Must be like
   * ('5 seconds', '10 minutes', '10 minutes 5 seconds')
   * {number} set_order. It is required
   * {string} type. It is required. Must be 'repetition' or 'time'
   * {number | string} quantity. It is required.
   * if type is repetition, quantity must be an integer but if it is time,
   * must be an string like ('5 seconds', '10 minutes', '10 minutes 5 seconds')
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function create_new_set(data) {
    try {
      const result = await axios.post(`/set`, data);

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that finds sets of an exercise
   * @param {Number} id_exercise - Id of the exercise searched
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_all_sets_of_exercise(id_exercise) {
    try {
      const result = await axios.get(`/set/exercise/${id_exercise}`);

      return result.data.resource;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that amount of time sets of exercise
   * @param {Number} id_exercise - Id of the exercise searched
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_amount_time_sets_of_exercise(id_exercise) {
    try {
      const result = await axios.get(
        `/exercise/${id_exercise}/amount/time_set`
      );

      return result.data.resource;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that amount of repetition sets of exercise
   * @param {Number} id_exercise - Id of the exercise searched
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_amount_repetition_sets_of_exercise(id_exercise) {
    try {
      const result = await axios.get(
        `/exercise/${id_exercise}/amount/repetition_set`
      );

      return result.data.resource;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that deletes a specific set of an exercise
   * @param {Number} id_set - Id of the set searched
   * @param {Number} id_exercise - Id of the exercise searched
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function delete_specific_set(id_set, id_exercise) {
    try {
      const result = await axios.delete(
        `/set/${id_set}/exercise/${id_exercise}`
      );

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that updates a specific set of an exercise
   * @param {Number} id_set - Id of the set searched
   * @param {Number} id_exercise - Id of the exercise searched
   * @param {Object} data - An object with the attributes wanted to update:
   * Attributes allow to change:
   * {number} weight. Admits 5 digits and 2 decimals
   * {string} rest_after_set. Must be like
   * ('5 seconds', '10 minutes', '10 minutes 5 seconds')
   * {number} set_order
   * {string} type. Must be 'repetition' or 'time'
   * {number | string} quantity. It is required if
   * type is present. If type is repetition, quantity must be an integer but if it is time,
   * must be an string like ('5 seconds', '10 minutes', '10 minutes 5 seconds')
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function update_specific_set(id_set, id_exercise, data) {
    try {
      const result = await axios.put(
        `/set/${id_set}/exercise/${id_exercise}`,
        data
      );

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that finds the id_set of the last set created
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_last_id_set() {
    try {
      const result = await axios.get(`/set/last`);

      return result.data.resource;
    } catch (error) {
      throw error;
    }
  }

  //Exports
  return {
    create_new_set,
    delete_specific_set,
    find_all_sets_of_exercise,
    update_specific_set,
    find_amount_repetition_sets_of_exercise,
    find_amount_time_sets_of_exercise,
    find_last_id_set
  };
});
