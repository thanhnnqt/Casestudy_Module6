import React from "react";
import { Route, Routes } from "react-router-dom";
import FlightList from "../component/FlightList";
import FlightForm from "../component/FlightForm";

const FlightRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<FlightList />} />
            <Route path="/create" element={<FlightForm />} />
            <Route path="/edit/:id" element={<FlightForm />} />
        </Routes>
    );
};

export default FlightRouter;