//Imports
import { defineStore } from "pinia";
import axios from "../config/axios";
import { ref } from "vue";

//Exercise store
export const useExerciseStore = defineStore("exercise", () => {
  //Variables
  const selected_exercises = ref([]);

  //Methods
  /**
   * Function that creates a new exercise
   * @param {Object} data - Object with:
   * {String} exercise_name - Is required
   * {String} time_after_exercise - Is required. Must be like
   * ('5 seconds', '10 minutes', '10 minutes 5 seconds')
   * {String} description - Is required
   * {number} intensity - Is required. Must be 1 (low), 2 (mid), or 3 (high)
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function create_new_exercise(data) {
    try {
      return (await axios.post("/exercise", data)).data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that finds exercises
   * @param {String} sort_by - Attribute to which sort. It can be exercise_name,
   * created_at, intensity
   * @param {String} order - In which way sort, ASC (ascendent) or DESC (descendent)
   * @param {String} filter - Attribute to which filter. It can be intensity,
   * muscle_group or is_favorite
   * @param {Array} filter_values - Array with values to which filter
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_exercises(sort_by, order, filter, filter_values) {
    try {
      let url = "/exercise";

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

      return (await axios.get(url)).data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that finds a specific exercise
   * @param {Number} id_exercise - Id of the exercise searched
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_specific_exercise(id_exercise) {
    try {
      return (await axios.get(`/exercise/${id_exercise}`)).data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that updates a specific exercise
   * @param {Number} id_exercise - Id of the exercise searched
   * @param {Object} data - An object with the attributes wanted to update:
   * Attributes allow to change
   * {String} exercise_name
   * {String} time_after_exercise. Must be like ('5 seconds', '10 minutes', '10 minutes 5 seconds')
   * {String} description
   * {Boolean} is_favorite
   * {number} intensity - Must be 1 (low), 2 (mid), or 3 (high)
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function update_specific_exercise(id_exercise, data) {
    try {
      return (await axios.put(`/exercise/${id_exercise}`, data)).data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that finds exercises assigned to a routine or which are not assigned
   * @param {Number} id_routine - Id of the routine searched
   * @param {Boolean} not_present - Indicates if the exercises to bring belong, or not, to the routine
   * @param {String} sort_by - Attribute to which sort. It can be exercise_name,
   * created_at, intensity
   * @param {String} order - In which way sort, ASC (ascendent) or DESC (descendent)
   * @param {String} filter - Attribute to which filter. It can be intensity,
   * muscle_group or is_favorite
   * @param {Array} filter_values - Array with values to which filter
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_exercises_of_routine(id_routine, not_present, sort_by, order, filter, filter_values) {
    try {
      let url = `/exercise/routine/${id_routine}`;

      url = not_present ? url + `?not_present=${not_present}` : url + "";

      url =
        sort_by && order && !(filter && filter_values.length > 0)
          ? url + `&sort_by=${sort_by}&order=${order}`
          : url + "";

      url =
        !(sort_by && order) && filter && filter_values.length > 0
          ? url + `&`
          : url + "";

      url =
        sort_by && order && filter && filter_values.length > 0
          ? url + `&sort_by=${sort_by}&order=${order}&`
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

      return (await axios.get(url)).data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that deletes a specific exercise
   * @param {Number} id_exercise - Id of the exercise searched
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function delete_specific_exercise(id_exercise) {
    try {
      return (await axios.delete(`/exercise/${id_exercise}`)).data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that finds the id_exercise of the last exercise created
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_last_id_exercise() {
    try {
      return (await axios.get(`/exercise/last`)).data;
    } catch (error) {
      throw error;
    }
  }

  //Exports
  return {
    create_new_exercise,
    delete_specific_exercise,
    find_exercises,
    update_specific_exercise,
    find_specific_exercise,
    find_exercises_of_routine,
    find_last_id_exercise,
    selected_exercises,
  };
});
