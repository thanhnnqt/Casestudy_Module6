import axios from "axios";
const URL_BE = "http://localhost:8080/api/master";
const URL_BE2 = "http://localhost:8080/api";

export const getAirports = async () => (await axios.get(`${URL_BE}/airports`)).data;
export const getAirlines = async () => (await axios.get(`${URL_BE}/airlines`)).data;
export const getAircraftsByAirline = async (airlineId) => (await axios.get(`${URL_BE}/aircrafts/${airlineId}`)).data;
export const getFlightNumberSuggestions = async () => (await axios.get(`${URL_BE2}/flights/suggestions/numbers`)).data;