//Imports
import axios from "axios";

//Variables
const instance = axios.create({
  baseURL: `${import.meta.env.VITE_URL_SERVICE}/v1`,
  withCredentials: true,
});


//Exports
export default instance;
