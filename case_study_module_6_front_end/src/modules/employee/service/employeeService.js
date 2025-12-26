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

export async function getEmployeeListBySearch(fullName, phoneNumber, page = 0, size = 50) {
    try {
        const res = await axios.get(URL, {
            params: {
                fullName: fullName || "",
                phoneNumber: phoneNumber || "",
                page,
                size
            }
        });
        return res.data;
    } catch (e) {
        console.error("Search Employee Error:", e);
        return {content: []};
    }
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

export async function checkIdentificationExists(value) {
    const res = await axios.get(`${URL}/check-identification`, {
        params: {value}
    });
    return res.data;
}

export async function checkImageHashExists(hash) {
    try {
        const res = await axios.get(`${URL}/check-image-hash`, {
            params: {hash}
        });
        return res.data;
    } catch {
        return false;
    }
}

export async function checkEmailExists(value) {
    if (!value) return false;
    const res = await axios.get(`${URL}/check-email`, {params: {value}});
    return res.data;
}

export async function checkPhoneExists(value) {
    if (!value) return false;
    const res = await axios.get(`${URL}/check-phone`, {params: {value}});
    return res.data;
}

export async function checkImageHashExistsExceptSelf(hash, id) {
    const res = await axios.get(`${URL}/check-image-hash-except`, {
        params: { hash, id }
    });
    return res.data;
}



