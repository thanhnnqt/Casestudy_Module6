import axios from "axios";
const URL_BE = "http://localhost:8080/api/master";

export const getAirports = async () => (await axios.get(`${URL_BE}/airports`)).data;
export const getAirlines = async () => (await axios.get(`${URL_BE}/airlines`)).data;
export const getAircraftsByAirline = async (airlineId) => (await axios.get(`${URL_BE}/aircrafts/${airlineId}`)).data;
export const getFlightNumberSuggestions = async () => (await axios.get(`${URL_BE}/flights/suggestions/numbers`)).data;