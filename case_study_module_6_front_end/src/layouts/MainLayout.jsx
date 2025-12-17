import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <>
            <div className="app-layout">
                <Header />
                <main className="app-content">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </>
    );
}

export default MainLayout;
