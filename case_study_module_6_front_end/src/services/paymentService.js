import axios from "../modules/login/service/axiosConfig";

export const createPayment = async (data) => {
    const res = await axios.post("/api/payment/create", data);
    return res.data; // URL VNPay
};


// const handlePay = async () => {
//     const url = await createPayment({
//         amount: 100000,
//         orderInfo: "Thanh toán vé bay"
//     });
//     window.location.href = url;
// };