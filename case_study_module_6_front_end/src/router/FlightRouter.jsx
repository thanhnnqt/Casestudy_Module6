import React from "react";
import { Route, Routes } from "react-router-dom";
<<<<<<< HEAD
import FlightList from "../modules/flight/components/FlightList.jsx";
import FlightForm from "../modules/flight/components/FlightForm.jsx";
=======
import FlightList from "../component/FlightList";
import FlightForm from "../component/FlightForm";
>>>>>>> c496dd975c49b654a8d2278762f2400c1f325294

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