//Imports
import axios from "axios";

//Variables
const instance = axios.create({
  baseURL: "http://localhost:3000/v1",
  withCredentials: true
});

//Exports
export default instance;
