import {Routes, Route} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";
import Profile from "../pages/Profile.jsx";
import FlightList from "../modules/flight/components/FlightList.jsx";
import FlightForm from "../modules/flight/components/FlightForm.jsx";
import BookingPage from "../modules/flight/pages/BookingPage.jsx";
import PassengerForm from "../modules/flight/pages/PassengerForm.jsx";
import CustomerList from "../components/CustomerList";
import CustomerForm from "../components/CustomerForm";
import EmployeeInfo from "../components/EmployeeInfo";
import React from "react";
import FlightSearch from "../modules/booking/components/FlightSearch.jsx";
import FlightSelection from "../modules/booking/components/FlightSelection.jsx";
import BookingDetails from "../modules/booking/components/BookingDetails.jsx";
import BookingManagement from "../modules/booking/components/BookingManagement.jsx";
import NewTicketSale from "../modules/booking/components/NewTicketSale.jsx";
import EmployeeList from "../modules/employee/components/EmployeeList.jsx";
import EmployeeDetail from "../modules/employee/components/EmployeeDetail.jsx";
import AddEmployee from "../modules/employee/components/AddEmployee.jsx";
import VerifyEmail from "../pages/VerifyEmail.jsx";

function AppRouter() {
    return (
        <Routes>

            {/* ==============================================
               NHÓM 1: CHỈ CÓ HEADER/FOOTER - KHÔNG CÓ SIDEBAR
               (Truyền showSidebar={false})
               ============================================== */}
            <Route element={<MainLayout showSidebar={false} />}>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/verify-email" element={<VerifyEmail />} />



                {/* Route quản lý chuyến bay */}
                <Route path="/flights" element={<FlightList/>}/>
                <Route path="/flights/create" element={<FlightForm/>}/>
                <Route path="flights/edit/:id" element={<FlightForm/>}/>

                <Route path="/flights/booking" element={<BookingPage/>}/>
                <Route path="/flights/passenger" element={<PassengerForm/>}/>

                {/* Route nhân viên */}
                <Route path="/employees" element={<EmployeeList/>}/>
                <Route path="/employees/edit/:id" element={<EmployeeDetail/>}/>
                <Route path="/employees/add" element={<AddEmployee/>}/>

                <Route path="/profile" element={
                    <PrivateRoute>
                        <Profile/>
                    </PrivateRoute>
                }/>
            </Route>


            {/* ==============================================
               NHÓM 2: CÓ ĐỦ HEADER/FOOTER VÀ SIDEBAR
               (Truyền showSidebar={true})
               ============================================== */}
            <Route element={<MainLayout showSidebar={true} />}>
                <Route path="/detailemployee" element={<EmployeeInfo />} />
                {/* --- Route Quản lý khách hàng --- */}
                <Route path="/customers" element={<CustomerList />} />
                <Route path="/customers/create" element={<CustomerForm />} />
                <Route path="/customers/edit/:id" element={<CustomerForm />} />

                {/* --- Route Booking/Quản lý vé --- */}
                <Route path="/search-flight" element={<FlightSearch />} />
                <Route path="/select-flight" element={<FlightSelection />} />
                <Route path="/booking-details" element={<BookingDetails />} />
                <Route path="/management" element={<BookingManagement />} />
                <Route path="/new-sale" element={<NewTicketSale />} />

            </Route>

        </Routes>
    );
}

export default AppRouter;