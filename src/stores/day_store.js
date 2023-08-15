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
      return (await axios.post("/day/scheduled", data)).data;
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
      return (await axios.get("/day")).data;
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
      return (await axios.get(`/day/routine/${id_routine}`)).data;
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
      return (await axios.delete(`/day/${id_day}/routine/${id_routine}`)).data;
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
