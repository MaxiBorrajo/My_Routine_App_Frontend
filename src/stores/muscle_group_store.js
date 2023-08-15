//Imports
import { defineStore } from "pinia";
import axios from "../config/axios";

//Muscle group store
export const useMuscleGroupStore = defineStore("muscle_group", () => {
  //Methods
  /**
   * Function that assigns a muscle group to a exercise
   * @param {Object} data - Object with id_exercise and id_muscle_group
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function assign_muscle_group_to_exercise(data) {
    try {
      return (await axios.post("/muscle_group/works", data)).data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that finds all muscle_groups available
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_all_muscle_groups() {
    try {
      return (await axios.get("/muscle_group")).data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that finds all muscle groups assigned to a exercise
   * @param {Number} id_exercise - Id_exercise of the searched exercise
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_muscle_groups_of_exercise(id_exercise) {
    try {
      return (await axios.get(`/muscle_group/exercise/${id_exercise}`)).data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that unassigned a muscle group from an exercise
   * @param {Number} id_muscle_group - id_muscle_group of the muscle group to unassigned
   * @param {Number} id_exercise - id_exercise of the searched exercise
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function unassigned_muscle_group_from_exercise(
    id_muscle_group,
    id_exercise
  ) {
    try {
      return (
        await axios.delete(
          `/muscle_group/${id_muscle_group}/exercise/${id_exercise}`
        )
      ).data;
    } catch (error) {
      throw error;
    }
  }

  //Exports
  return {
    assign_muscle_group_to_exercise,
    find_all_muscle_groups,
    find_muscle_groups_of_exercise,
    unassigned_muscle_group_from_exercise,
  };
});
