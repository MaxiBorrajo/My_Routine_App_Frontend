//Imports
import { defineStore } from "pinia";
import axios from "../config/axios";

//Routine store
export const useRoutineStore = defineStore("routine", () => {
  //Methods

  /**
   * Function that creates a new routine
   * @param {Object} data - Object with:
   * {String} routine_name - Is required
   * {String} time_before_start - Is required. Must be like
   * ('5 seconds', '10 minutes', '10 minutes 5 seconds')
   * {String} description
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function create_new_routine(data) {
    try {
      const result = await axios.post("/routine", data);

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that finds routines
   * @param {String} sort_by - Attribute to which sort. It can be routine_name,
   * created_at, usage_routine
   * @param {String} order - In which way sort, ASC (ascendent) or DESC (descendent)
   * @param {String} filter - Attribute to which filter. It can be day,
   * or is_favorite
   * @param {Array} filter_values - Array with values to which filter
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_routines(sort_by, order, filter, filter_values) {
    try {
      let url = "/routine";

      url =
        sort_by && order && !(filter && filter_values.length > 0)
          ? url + `?sort_by=${sort_by}&order=${order}`
          : url + "";

      url =
        !(sort_by && order) && filter && filter_values.length > 0
          ? url + `?`
          : url + "";

      url =
        sort_by && order && filter && filter_values.length > 0
          ? url + `?sort_by=${sort_by}&order=${order}&`
          : url + "";

      if (filter && filter_values.length > 0) {
        url = url + `filter=${filter}&`;

        filter_values.forEach((filter_value, index) => {
          if (index === filter_values.length - 1) {
            url = url + `filter_values[${index}]=${filter_value}`;
          } else {
            url = url + `filter_values[${index}]=${filter_value}&`;
          }
        });
      }

      const result = await axios.get(url);

      return result.data.resource;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that finds a specific routine
   * @param {Number} id_routine - Id of the routine searched
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_specific_routine(id_routine) {
    try {
      const result = await axios.get(`/routine/${id_routine}`);

      return result.data.resource;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that updates a specific exercise
   * @param {Number} id_routine - Id of the routine searched
   * @param {Object} data - An object with the attributes wanted to update:
   * Attributes allow to change:
   * {String} routine_name
   * {number} usage_routine
   * {String} time_before_start. Must be like ('5 seconds', '10 minutes', '10 minutes 5 seconds')
   * {String} description
   * {Boolean} is_favorite
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function update_specific_routine(id_routine, data) {
    try {
      const result = await axios.put(`/routine/${id_routine}`, data);

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that finds routines in which an exercise is assigned
   * @param {Number} id_exercise - Id of the exercise searched
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_routines_of_exercise(id_exercise) {
    try {
      const result = await axios.get(`/routine/exercise/${id_exercise}`);

      return result.data.resource;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that deletes a specific routine
   * @param {Number} id_routine - Id of the routine searched
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function delete_specific_routine(id_routine) {
    try {
      const result = await axios.delete(`/routine/${id_routine}`);

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that adds an exercise to a routine
   * @param {Number} id_exercise - Id of the exercise searched
   * @param {Number} id_routine - Id of the routine searched
   * @param {Object} data - An object with the attributes wanted to create:
   * {number} exercise_order - The position that the exercise occupy. Is required
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function add_exercise_to_routine(id_exercise, id_routine, data) {
    try {
      const result = await axios.post(
        `/routine/${id_routine}/exercise/${id_exercise}`,
        data
      );

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that change the order of an exercise in a routine
   * @param {Number} id_exercise - Id of the exercise searched
   * @param {Number} id_routine - Id of the routine searched
   * @param {Object} data - An object with the attributes wanted to update:
   * {number} exercise_order - The position that the exercise occupy. Is required
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function change_order_of_an_exercise(id_exercise, id_routine, data) {
    try {
      const result = await axios.put(
        `/routine/${id_routine}/exercise/${id_exercise}`,
        data
      );

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that removes an exercise from a routine
   * @param {Number} id_exercise - Id of the exercise searched
   * @param {Number} id_routine - Id of the routine searched
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function remove_exercise_from_routine(id_exercise, id_routine) {
    try {
      const result = await axios.delete(
        `/routine/${id_routine}/exercise/${id_exercise}`
      );

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that finds the id_routine of the last routine created
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_last_id_routine() {
    try {
      const result = await axios.get(`/routine/last`);

      return result.data.resource;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that gets amount of exercises of a routine
   * @param {Number} id_routine - Id of the routine searched
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_amount_exercises_of_routine(id_routine) {
    try {
      const result = await axios.get(`/routine/${id_routine}/amount/exercises`);

      return result.data.resource;
    } catch (error) {
      throw error;
    }
  }

  //Exports
  return {
    create_new_routine,
    delete_specific_routine,
    find_routines,
    update_specific_routine,
    find_specific_routine,
    find_routines_of_exercise,
    add_exercise_to_routine,
    change_order_of_an_exercise,
    remove_exercise_from_routine,
    find_last_id_routine,
    find_amount_exercises_of_routine,
  };
});
