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
import ApplicationForm from "../pages/ApplicationForm/ApplicationForm.jsx";
import ManageUsers from "../pages/DashBoard/ManageUsers/ManageUsers.jsx";
import ManageApplications from "../pages/DashBoard/ManageApplications/ManageApplications.jsx";
import MyPolicies from "../pages/DashBoard/MyPolicies/MyPolicies.jsx";
import FAQ from "../pages/Home/faq/FAQ.jsx";

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
                path: 'all-policies',
                Component: AllPolicies,
            },
            {
                path: 'policies/:policyId',
                Component: PolicyDetails
            },
            {
                path: 'policies/:policyId/quote',
                Component: QuoteEstimator
            },
            {
                path: 'policies/:policyId/apply',
                Component: ApplicationForm
            },
            {
                path:'faq',
                Component:FAQ

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
        path: '/dashboard',
        Component: DashboardLayout,
        children:
            [
                {
                    path: 'manage-policies',
                    Component: ManagePolicies,
                },
                {
                    path: 'manage-users',
                    element: <ManageUsers/>,
                },
                {
                    path: 'manage-applications',
                    element: <ManageApplications/>,
                },
                    // user
            {
                path: 'my-policies',
                element: <MyPolicies/>,
            }

        ]
    }
])