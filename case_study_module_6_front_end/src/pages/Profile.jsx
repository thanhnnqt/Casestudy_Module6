import { useAuth } from "../context/AuthContext";

function Profile() {
    const { user } = useAuth();

    return (
        <div className="container my-5 pt-5">
            <h3 className="fw-bold">Thông tin tài khoản</h3>

            {user ? (
                <div className="card mt-4 p-4">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
            ) : (
                <p>Không có thông tin người dùng</p>
            )}
        </div>
    );
}

export default Profile;
