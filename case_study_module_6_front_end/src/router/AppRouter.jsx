import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";
import Profile from "../pages/Profile.jsx";
import FlightList from "../modules/flight/./components/FlightList.jsx";
import FlightForm from "../modules/flight/./components/FlightForm.jsx";
import CustomerList from "../components/CustomerList";
import CustomerForm from "../components/CustomerForm";
import EmployeeInfo from "../components/EmployeeInfo";
import React from "react";
import FlightSelection from "../modules/booking/components/FlightSelection.jsx";
import BookingDetails from "../modules/booking/components/BookingDetails.jsx";
import BookingManagement from "../modules/booking/components/BookingManagement.jsx";
import NewTicketSale from "../modules/booking/components/NewTicketSale.jsx";
import FlightSearch from "../modules/booking/components/FlightSearch.jsx";

function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>

                {/*Route trang chủ*/}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />


                <Route path="/detailemployee" element={<EmployeeInfo />} />
                {/*Route chuyến bay*/}
                <Route path="/flights" element={<FlightList />} />
                <Route path="/flights/create" element={<FlightForm />} />
                <Route path="flights/edit/:id" element={<FlightForm />} />

                {/* --- MỚI THÊM: Route Quản lý khách hàng --- */}
                <Route path="/customers" element={<CustomerList />} />
                <Route path="/customers/create" element={<CustomerForm />} />
                <Route path="/customers/edit/:id" element={<CustomerForm />} />

                {/*Route booking*/}
                <Route path="/search-flight" element={<FlightSearch />} />
                <Route path="/select-flight" element={<FlightSelection />} />
                <Route path="/booking-details" element={<BookingDetails />} />
                <Route path="/management" element={<BookingManagement />} />
                <Route path="/new-sale" element={<NewTicketSale />} />


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
