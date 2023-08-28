import { defineStore } from "pinia";
import axios from "../config/axios";

//Photo exercise store
export const usePhotoExerciseStore = defineStore("photo_exercise", () => {
  //Methods

  /**
   * Function to upload a new photo of an exercise
   *
   * @param {Number} id_exercise - Id of the exercise to upload the image
   * @param {FormData} data - Form with the image to upload
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function create_new_photo(id_exercise, data) {
    try {
      const result = await axios.post(`/photo/exercise/${id_exercise}`, data);

      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that finds all photos of an exercise
   *
   * @param {Number} id_exercise - Id of the exercise to upload the image
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function find_all_photos_of_exercise(id_exercise) {
    try {
      const result = await axios.get(`/photo/exercise/${id_exercise}`);

      return result.data.resource;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function that deletes a specific photo of an exercise
   *
   * @param {Number} public_id - Public id of the image
   * @param {Number} id_exercise - Id of the exercise to upload the image
   * @returns {Object} A object with a message or the resource requested
   * @throws {Object} If something goes wrong returns an object with specifications
   * of the error
   */
  async function delete_photo_of_exercise(public_id, id_exercise) {
    try {
      const result = await axios.delete(
        `/photo/${public_id}/exercise/${id_exercise}`
      );
      
      return result.data.success;
    } catch (error) {
      throw error;
    }
  }

  //Exports
  return {
    create_new_photo,
    delete_photo_of_exercise,
    find_all_photos_of_exercise,
  };
});
