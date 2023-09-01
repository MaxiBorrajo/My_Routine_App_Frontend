//Imports
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "../config/axios";

//User store
export const useUserStore = defineStore("user", () => {
  //Variables
  const not_logged_user_error = ref(false);

  const volume_on = ref(true);

  //Methods
  /**
   * Function that allows user to login
   * @param {Object} data - Object with:
   * {String} email - Is required and must be a valid email
   * {String} password - Is required and must have
   * at least one lowercase letter, one uppercase letter,
   * one digit, one special character, and be 8 characters or longer
   *
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function login(data) {
    try {
      const result = await axios.post("/user/credentials", data);
      
      return result.data.resource;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that allows user to create a new account
   * @param {Object} data - Object with:
   * {String} email - Is required and must be a valid email
   * {String} password - Is required and must have
   * at least one lowercase letter, one uppercase letter,
   * one digit, one special character, and be 8 characters or longer
   * {String} name - Is required
   * {String} last_name - Is required
   *
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function register(data) {
    try {
      const result = await axios.post("/user", data);

      return result.data.resource;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that gets the current user
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function get_current_user() {
    try {
      const result = await axios.get("/user");

      return result.data.resource;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that sign out the current user
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function logout() {
    try {
      const result = await axios.delete("/user/credentials");

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that sends an email to allows to change the user's password
   * @param {Object} data - Object with:
   * {String} email - Is required and must be a valid email
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function forgot_password(data) {
    try {
      const result = await axios.post("/user/forgot_password", data);

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that changes the user's password with the new one
   * @param {String} token - Security token given by the email
   * @param {Object} data - Object with:
   * {String} password - Is required and must have
   * at least one lowercase letter, one uppercase letter,
   * one digit, one special character, and be 8 characters or longer
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function reset_password(token, data) {
    try {
      const result = await axios.put(`/user/reset_password/${token}`, data);

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that updates user's information
   * @param {FormData} data - Form data with:
   * Attributes allow to change:
   * {String} email. Must be valid and not be stored in database
   * {String} last_name
   * {String} username
   * {Date} date_birth
   * {String} theme. Must be 'light', 'dark' or 'myroutine'
   * {String} experience. Must be 'beginner', 'intermediate' or 'experienced'
   * {String} weight. Must be 'KG' or 'LBS'
   * {String} goal
   * {number} rating. Must be a number between 0 and 5
   * {File} image. This will be interpreted as wanting to change the profile picture
   *
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function update_current_user(data) {
    try {
      const result = await axios.put("/user", data);

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that deletes the current user's account
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function delete_user() {
    try {
      const result = await axios.delete("/user");

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that send feedback
   * @param {Object} data - Object with:
   * {String} comment - Is required
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function send_feedback(data) {
    try {
      const result = await axios.post("/user/feedback", data);

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  //Exports
  return {
    delete_user,
    forgot_password,
    get_current_user,
    login,
    logout,
    register,
    reset_password,
    send_feedback,
    update_current_user,
    not_logged_user_error,
    volume_on,
  };
});
