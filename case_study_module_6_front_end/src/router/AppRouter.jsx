import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import FlightRouter from "./FlightRouter.jsx";

const AppRouter = () => {
    return (
        <Routes>

            <Route path="/" element={<Navigate to="/flights"/>}/>


            <Route path="/flights/*" element={<FlightRouter/>}/>
        </Routes>
    );
};

export default AppRouter;