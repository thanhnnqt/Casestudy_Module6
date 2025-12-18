import axios from "axios";

const URL_BE = "http://localhost:8080/api";

export async function getAllFlights() {
    try {
        const response = await axios.get(`${URL_BE}/flights`);
        return response.data.content || [];
    } catch (e) {
        return [];
    }
}

// Cập nhật search: thêm origin, destination
export async function searchFlight(airline, origin, destination, departureTime, maxPrice) {
    try {
        const params = {};
        if (airline) params.airline = airline;
        if (origin) params.origin = origin;            // Mới
        if (destination) params.destination = destination; // Mới
        if (departureTime) params.departureTime = departureTime;
        if (maxPrice) params.maxPrice = maxPrice;

        const response = await axios.get(`${URL_BE}/flights`, { params });
        return response.data.content || [];
    } catch (e) {
        return [];
    }
}

export async function getFlightById(id) {
    try {
        const response = await axios.get(`${URL_BE}/flights/${id}`);
        return response.data;
    } catch (e) {
        return null;
    }
}

export async function addNewFlight(flight) {
    try {
        const response = await axios.post(`${URL_BE}/flights`, flight);
        return response.status === 200 || response.status === 201;
    } catch (e) {
        return false;
    }
}

// Cập nhật: update cả status
export async function updateFlight(id, flightData) {
    try {
        const response = await axios.put(`${URL_BE}/flights/${id}`, flightData);
        return response.status === 200;
    } catch (e) {
        return false;
    }
}

export async function cancelFlight(id) {
    try {
        const response = await axios.delete(`${URL_BE}/flights/${id}`);
        return response.status === 200;
    } catch (e) {
        return false;
    }
}