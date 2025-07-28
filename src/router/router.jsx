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
import FAQ from "../pages/Home/faq/FAQ.jsx";
import ManageBlogs from "../pages/DashBoard/manage blogs/ManageBlogs.jsx";
import CreateBlog from "../pages/DashBoard/create blog/CreateBlog.jsx";
import AllBlogs from "../pages/Home/blogs/AllBlogs.jsx";
import BlogDetails from "../pages/Home/blogs/BlogDetails.jsx";
import BecomeAnAgent from "../pages/become agent/BecomeAnAgent.jsx";
import ManageAgent from "../pages/DashBoard/ManageAgent/ManageAgent.jsx";
import PaymentStatus from "../pages/DashBoard/payment status/PaymentStatus.jsx";
import MakePayment from "../pages/DashBoard/make payment/MakePayment.jsx";
import Payment from "../pages/DashBoard/Payment/Payment.jsx";
import ManageTransactions from "../pages/DashBoard/ManageTransactions/ManageTransactions.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import ClaimRequest from "../pages/DashBoard/claim request/ClaimRequest.jsx";
import AssignedCustomers from "../pages/DashBoard/AssignedCustomers/AssignedCustomers.jsx";
import Forbidden from "../pages/forbidden/Forbidden.jsx";
import PrivateRoute from "../routes/PrivateRoute.jsx";
import AdminRoute from "../routes/AdminRoute.jsx";
import MyPolicies from "../pages/DashBoard/MyPolicies/MyPolicies.jsx";
import AgentRoute from "../routes/AgentRoute.jsx";
import DashboardWelcome from "../pages/DashBoard/DashboardWelcome.jsx";
import Quote from "../pages/Home/quote/Quote.jsx";

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
                element: <PrivateRoute>
                    <ApplicationForm>

                    </ApplicationForm>
                </PrivateRoute>
            },
            {
                path: 'faq',
                Component: FAQ

            },
            {
                path: 'blogs',
                Component: AllBlogs,
            },
            {
                path: 'blogs/:id',
                Component: BlogDetails,
            },
            {
                path: 'forbidden',
                Component: Forbidden,
            },
            {
                path:'quote',
                element: <Quote></Quote>
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
            {
                path: 'become-agent',
                element: <PrivateRoute>
                    <BecomeAnAgent/>,
                </PrivateRoute>

            },
            {
                path: 'profile',
                element: <Profile/>,
            }
        ]
    },

    {
        path: '/dashboard',
        element: <PrivateRoute>
            <DashboardLayout/>
        </PrivateRoute>,
        children:
            [
                {
                    index: true,
                    element: <DashboardWelcome />
                  },
                {
                    path: 'manage-policies',
                    element:
                        <AdminRoute>
                            <ManagePolicies/>
                        </AdminRoute>
                },
                {
                    path: 'manage-users',
                    element:
                        <AdminRoute>
                            <ManageUsers/>
                        </AdminRoute>,
                },
                {
                    path: 'manage-applications',
                    element:
                        <AdminRoute>
                            <ManageApplications/>
                        </AdminRoute>,


                },
                {
                    path: 'manage-agents',
                    element:
                        <AdminRoute>
                            <ManageAgent/>
                        </AdminRoute>


                },
                {
                    path: 'transactions',
                    element:
                        <AdminRoute>
                            <ManageTransactions/>
                        </AdminRoute>
                },

                // user
                {
                    path: 'my-policies',
                    element:
                        <PrivateRoute>
                            <MyPolicies/>
                        </PrivateRoute>,
                },
                {
                    path: 'payment-status',
                    element:
                        <PrivateRoute>
                            <PaymentStatus/>
                        </PrivateRoute>

                },
                {
                    path: "make-payment/:id",
                    element:
                        <PrivateRoute>
                            <MakePayment/>
                        </PrivateRoute>
                },
                {
                    path: 'stripe-payment/:id',
                    element:
                        <PrivateRoute>
                            <Payment/>
                        </PrivateRoute>
                },
                {
                    path: 'claim-request',
                    element:
                        <PrivateRoute>
                            <ClaimRequest/>
                        </PrivateRoute>,
                },


                // agent
                {
                    path: 'manage-blogs',
                    element:
                        <PrivateRoute>
                            <AgentRoute>
                                <ManageBlogs/>
                            </AgentRoute>
                        </PrivateRoute>,
                },
                {
                    path: 'manage-blogs/create',
                    element:
                        <PrivateRoute>
                            <AgentRoute>
                                <CreateBlog/>
                            </AgentRoute>

                        </PrivateRoute>,
                },

                {
                    path: "assigned-customers",
                    element:
                        <PrivateRoute>
                          <AgentRoute>
                              <AssignedCustomers/>
                          </AgentRoute>
                        </PrivateRoute>
                }


            ]
    }
])