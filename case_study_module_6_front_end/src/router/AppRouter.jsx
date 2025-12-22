import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";
import Profile from "../pages/Profile.jsx";
import FlightList from "../modules/flight/./components/FlightList.jsx";
import FlightForm from "../modules/flight/./components/FlightForm.jsx";
import React from "react";

function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>

                {/*Route trang chủ*/}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />


                {/*Route chuyến bay*/}
                <Route path="/flights" element={<FlightList />} />
                <Route path="/flights/create" element={<FlightForm />} />
                <Route path="flights/edit/:id" element={<FlightForm />} />


                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />
            </Route>
        </Routes>
    );
}

export default AppRouter;
