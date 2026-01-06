import axios from "../../login/service/axiosConfig";

const URL = "/v1/api/employees"

export async function getEmployeeList() {
    console.log("TOKEN SENT =", localStorage.getItem("token"));
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

export const addEmployee = async (data) => {
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/v1/api/employees`,
            data
        );
        return res.data;
    } catch (err) {
        // ✅ ƯU TIÊN LỖI NGHIỆP VỤ
        if (err.response?.data) {

            // backend trả: { username: "Tài khoản đã tồn tại" }
            if (typeof err.response.data === "object") {
                throw err.response.data;
            }

            // backend trả: "Tài khoản đã tồn tại"
            if (typeof err.response.data === "string") {
                throw {username: err.response.data};
            }
        }

        // fallback
        throw {username: "Tài khoản đã tồn tại"};
    }
};


export async function checkIdentificationExists(value) {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${URL}/check-identification`, {
        params: {value},
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

export async function checkImageHashExists(hash) {
    const token = localStorage.getItem("token");
    try {
        const res = await axios.get(`${URL}/check-image-hash`, {
            params: {hash},
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch {
        return false;
    }
}

export async function checkEmailExists(value) {
    const token = localStorage.getItem("token");
    if (!value) return false;
    const res = await axios.get(`${URL}/check-email`, {
        params: {value},
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

export async function checkPhoneExists(value) {
    const token = localStorage.getItem("token");
    if (!value) return false;
    const res = await axios.get(`${URL}/check-phone`, {
        params: {value},
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

export async function checkImageHashExistsExceptSelf(hash, id) {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${URL}/check-image-hash-except`, {
        params: {hash, id},
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

export const updateEmployeeImage = async (id, imgURL, imgHash) => {
    const token = localStorage.getItem("token");
    return await axios.patch(`${URL}/${id}/update-image`, null, {
        params: {imageUrl: imgURL, imageHash: imgHash},
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export async function checkUsernameExists(username) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
            `${URL}/exists-username?username=${username}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data;
    } catch {
        return false;
    }
}

const token = localStorage.getItem("token");
const config = {
    headers: {Authorization: `Bearer ${token}`}
};

export const getCompareReport = async (type, view, start, end, compareStart, compareEnd) => {
    const res = await axios.get(`/api/reports/compare`, {
        params: {type, view, start, end, compareStart, compareEnd}, ...config
    });
    return res.data;
}

export const getEmployeePerformance = async (
    view,          // MONTH | QUARTER | YEAR
    start,
    end,
    year
) => {
    const res = await axios.get("/api/reports/employee-performance", {
        params: {
            view,
            start,
            end,
            year
        },
        ...config
    });
    return res.data;
};

export const getAirlineRevenue = async (
    view,     // MONTH | QUARTER | YEAR
    start,
    end,
    year
) => {
    const res = await axios.get("/api/reports/airline-performance", {
        params: {
            view,
            start,
            end,
            year
        },
        ...config
    });
    return res.data;
};








