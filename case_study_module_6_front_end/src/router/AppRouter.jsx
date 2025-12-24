import {Routes, Route} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";
import Profile from "../pages/Profile.jsx";
import FlightList from "../modules/flight/./components/FlightList.jsx";
import FlightForm from "../modules/flight/./components/FlightForm.jsx";
import React from "react";
import FlightSearch from "../modules/booking/components/FlightSearch.jsx";
import FlightSelection from "../modules/booking/components/FlightSelection.jsx";
import BookingDetails from "../modules/booking/components/BookingDetails.jsx";
import BookingManagement from "../modules/booking/components/BookingManagement.jsx";
import NewTicketSale from "../modules/booking/components/NewTicketSale.jsx";
import EmployeeList from "../modules/employee/components/EmployeeList.jsx";
import EmployeeDetail from "../modules/employee/components/EmployeeDetail.jsx";
import AddEmployee from "../modules/employee/components/AddEmployee.jsx";


function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout/>}>

                {/*Route trang chủ*/}
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>


                {/*Route chuyến bay*/}
                <Route path="/flights" element={<FlightList/>}/>
                <Route path="/flights/create" element={<FlightForm/>}/>
                <Route path="flights/edit/:id" element={<FlightForm/>}/>

                {/*Route booking*/}
                <Route path="/search-flight" element={<FlightSearch />} />
                <Route path="/select-flight" element={<FlightSelection />} />
                <Route path="/booking-details" element={<BookingDetails />} />
                <Route path="/management" element={<BookingManagement />} />
                <Route path="/new-sale" element={<NewTicketSale />} />


                {/*Route nhân viên*/}
                <Route path="/employees" element={<EmployeeList/>}/>
                <Route path="/employees/edit/:id" element={<EmployeeDetail/>}/>
                <Route path="/employees/add" element={<AddEmployee/>}/>

                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile/>
                        </PrivateRoute>
                    }
                />
            </Route>
        </Routes>
    );
}

export default AppRouter;
