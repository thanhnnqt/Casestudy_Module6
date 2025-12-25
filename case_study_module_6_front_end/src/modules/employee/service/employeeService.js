import axios from "axios";

const URL = "http://localhost:8080/v1/api/employees"

export async function getEmployeeList() {
    try {
        const res = await axios.get(`${URL}`);
        return res.data;

    } catch (e) {
        console.error(e.message);
    }
    return [];
}

export async function deleteEmployee(id) {
    try {
        const res = await axios.delete(`${URL}/${id}`);
        return res.status === 204;
    } catch (e) {
        console.error(e.message);
    }
    return false;
}

export async function findEmployeeById(id) {
    try {
        const res = await axios.get(`${URL}/${id}`);
        return res.data;
    } catch (e) {
        console.error(e.message);
    }
    return null;
}

export async function editEmployee(employee) {
    try {
        const res = await axios.patch(`${URL}/${employee.id}`, employee);
        return res.status === 204;
    } catch (e) {
        console.error(e.message);
    }
    return false;
}

export async function getEmployeeListBySearch(field, keyword) {
    try {
        const res = await axios.get(
            `${URL}/search?field=${field}&keyword=${keyword}`);
        return res.data;
    } catch (e) {
        console.error(e.message);
    }
    return []

}

export async function addEmployee(employee) {
    try {
        const res = await axios.post(`${URL}`, employee);
        return res.status === 201;
    } catch (e) {
        console.error(e.message)
    }
    return false;
}