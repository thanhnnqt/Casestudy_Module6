import axios from "axios";

const URL_BE = "http://localhost:8080/api";

export async function getAllFlights() {
    try {
        const response = await axios.get(`${URL_BE}/flights`);

        return response.data.content || [];
    } catch (e) {
        console.log(e.message);
        return [];
    }
}


export async function searchFlight(airline, departureTime, maxPrice) {
    try {
        const params = {};
        if (airline) params.airline = airline;
        if (departureTime) params.departureTime = departureTime;
        if (maxPrice) params.maxPrice = maxPrice;

        const response = await axios.get(`${URL_BE}/flights`, { params });
        return response.data.content || [];
    } catch (e) {
        console.log(e.message);
        return [];
    }
}

export async function getFlightById(id) {
    try {
        const response = await axios.get(`${URL_BE}/flights/${id}`);
        return response.data;
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

export async function addNewFlight(flight) {
    try {
        const response = await axios.post(`${URL_BE}/flights`, flight);
        return response.status === 200 || response.status === 201;
    } catch (e) {
        console.log(e.message);
        return false;
    }
}


export async function updateFlightTime(id, flightData) {
    try {
        const response = await axios.put(`${URL_BE}/flights/${id}`, flightData);
        return response.status === 200;
    } catch (e) {
        console.log(e.message);
        return false;
    }
}

export async function cancelFlight(id) {
    try {
        const response = await axios.delete(`${URL_BE}/flights/${id}`);
        return response.status === 200;
    } catch (e) {
        console.log(e.message);
        return false;
    }
}