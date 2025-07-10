import {
    createBrowserRouter,
} from "react-router";
import MainLayout from "../layouts/MainLayout.jsx";
import Home from "../pages/Home/home/Home.jsx";
import SignIn from "../pages/signIn/SignIn.jsx";
import SignUp from "../pages/signUp/SignUp.jsx";
import AuthLayout from "../layouts/AuthLayouts.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import ManagePolicies from "../pages/DashBoard/ManagePolicies/ManagePolicies.jsx";
import AllPolicies from "../pages/all policies/AllPolicies.jsx";
import PolicyDetails from "../pages/policy details/PolicyDetails.jsx";
import QuoteEstimator from "../pages/qoute/QuoteEstimator.jsx";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path:'all-policies',
                Component:AllPolicies,
            },
            {
                path: 'policies/:policyId',
                Component:PolicyDetails
            },
            {
                path: 'quote',
                Component: QuoteEstimator
            }
        ],
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            {
                path: 'signin',
                Component: SignIn,
            },
            {
                path: 'signup',
                Component: SignUp,
            },
        ]
    },
    {
        path:'/dashboard',
        Component: DashboardLayout,
        children:
        [
            {
                path:'manage-policies',
                Component:ManagePolicies,
            }

        ]
    }
])