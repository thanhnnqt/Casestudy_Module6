import axios from "../../login/service/axiosConfig";
const URL_BE = `${import.meta.env.VITE_API_BASE_URL}/api/master`;
const URL_BE2 = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const getAirports = async () => (await axios.get(`${URL_BE}/airports`)).data;
export const getAirlines = async () => (await axios.get(`${URL_BE}/airlines`)).data;
export const getAircraftsByAirline = async (airlineId) => (await axios.get(`${URL_BE}/aircrafts/${airlineId}`)).data;
export const getFlightNumberSuggestions = async () => (await axios.get(`${URL_BE2}/flights/suggestions/numbers`)).data;

