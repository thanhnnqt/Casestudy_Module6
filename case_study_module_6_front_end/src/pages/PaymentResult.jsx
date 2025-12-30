import { useLocation } from "react-router-dom";

export default function PaymentResult() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const status = params.get("vnp_ResponseCode");

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            {status === "00" ? (
                <h2>Thanh toán thành công ✅</h2>
            ) : (
                <h2>Thanh toán thất bại ❌</h2>
            )}
        </div>
    );
}
