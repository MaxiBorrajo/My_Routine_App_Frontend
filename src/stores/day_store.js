import { defineStore } from "pinia";
import axios from "../config/axios";

//Day store
export const useDayStore = defineStore("day", () => {
  //Methods

  /**
   * Function that assigns a day to a routine
   * @param {Object} data - Object with id_day and id_routine
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function assign_day_to_routine(data) {
    try {
      const result = await axios.post("/day/scheduled", data);

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that finds all days available
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_all_days() {
    try {
      const result = await axios.get("/day");

      return result.data.resource;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that finds all days assigned to a routine
   * @param {Number} id_routine - Id_routine of the searched routine
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_days_of_routine(id_routine) {
    try {
      const result = await axios.get(`/day/routine/${id_routine}`);

      return result.data.resource;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that unassigned a day from a routine
   * @param {Number} id_day - id_day of the day to unassigned
   * @param {Number} id_routine - Id_routine of the searched routine
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function unscheduled_day_from_routine(id_day, id_routine) {
    try {
      const result = await axios.delete(`/day/${id_day}/routine/${id_routine}`);

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  //Exports
  return {
    assign_day_to_routine,
    find_all_days,
    find_days_of_routine,
    unscheduled_day_from_routine,
  };
});
