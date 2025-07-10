import React from 'react';
import {Outlet} from 'react-router';
import Header from "../pages/shared/Navbar/Header.jsx";

const AuthLayout = () => {
    return (
        <div>
<Header/>
            <div>
                <Outlet/>
            </div>
        </div>
    );
};

export default AuthLayout;
