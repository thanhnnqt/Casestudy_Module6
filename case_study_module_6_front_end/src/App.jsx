import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

function App() {
    return (
            <div className="App">
                <AppRouter />
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
    );

}

export default App;