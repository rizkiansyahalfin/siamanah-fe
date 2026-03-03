import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { LandingPage } from "@/features/landing/pages/LandingPage";
import { CampaignListPage } from "@/features/campaigns/pages/CampaignListPage";
import { CampaignDetailPage } from "@/features/campaigns/pages/CampaignDetailPage";
import { CreateCampaignPage } from "@/features/campaigns/pages/CreateCampaignPage";
import { CheckoutPage } from "@/features/donations/pages/CheckoutPage";
import { DonationSuccessPage } from "@/features/donations/pages/DonationSuccessPage";
import { PaymentStatusPage } from "@/features/donations/pages/PaymentStatusPage";
import { AdminReviewPage } from "@/features/admin/pages/AdminReviewPage";
import { AboutPage } from "@/features/about/pages/AboutPage";
import { HealthPage } from "@/features/health/pages/HealthPage";
import { ProfilePage } from "@/features/dashboard/pages/ProfilePage";

import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { VerifyOtpPage } from "@/features/auth/pages/VerifyOtpPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import FundraiserOnboardingPage from "@/features/auth/pages/FundraiserOnboardingPage";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { TestEditorPage } from "@/features/auth/pages/TestEditorPage";
import CampaignPage from "@/features/auth/pages/CampaignPage";

import { MyCampaignsPage } from "@/features/dashboard/pages/MyCampaignsPage";
import { DashboardOverviewPage } from "@/features/dashboard/pages/DashboardOverviewPage";
import { ReportsPage } from "@/features/dashboard/pages/ReportsPage";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export const router = createBrowserRouter([

    /*
    ========================
    PUBLIC ROUTES
    ========================
    */


    /*
    ========================
    PROTECTED ROUTES
    ========================
    */

    {
        element: <MainLayout />,

        children: [
            {
                path: "/login",
                element: (
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                ),
            },
            {
                path: "/register",
                element: (
                    <PublicRoute>
                        <RegisterPage />
                    </PublicRoute>
                ),
            },
            {
                path: "/forgot-password",
                element: (
                    <PublicRoute>
                        <ForgotPasswordPage />
                    </PublicRoute>
                ),
            },
            {
                path: "/verify-otp",
                element: (
                    <PublicRoute>
                        <VerifyOtpPage />
                    </PublicRoute>
                ),
            },
            {
                path: "/reset-password",
                element: (
                    <PublicRoute>
                        <ResetPasswordPage />
                    </PublicRoute>
                ),
            },
            {
                path: "/test-editor",
                element: (
                    <PublicRoute>
                        <TestEditorPage />
                    </PublicRoute>
                ),
            },

            {
                path: "/",
                element: <LandingPage />,
            },
            {
                path: "/about",
                element: <AboutPage />,
            },
            {
                path: "/explore",
                element: <CampaignListPage />,
            },
            {
                path: "/campaign/:id",
                element: <CampaignDetailPage />,
            },
            {
                path: "/create-campaign",
                element: (
                    <ProtectedRoute>
                        <CreateCampaignPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/fundraiser/onboarding",
                element: (
                    <ProtectedRoute>
                        <FundraiserOnboardingPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/donation/checkout/:campaignId",
                element: (
                    <ProtectedRoute requireAuth={false}>
                        <CheckoutPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/donation/success",
                element: <DonationSuccessPage />,
            },
            {
                path: "/donation/status/:orderId",
                element: <PaymentStatusPage />,
            },
            {
                path: "/admin/review",
                element: (
                    <ProtectedRoute>
                        <AdminReviewPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/health",
                element: (
                    <ProtectedRoute>
                        <HealthPage />
                    </ProtectedRoute>
                ),
            },

            /*
            ========================
            CAMPAIGN PAGE
            ========================
            */

            {
                path: "/campaign",
                element: (
                    <ProtectedRoute>
                        <CampaignPage />
                    </ProtectedRoute>
                ),
            },

        ],
    },

    /*
    ========================
    DASHBOARD ROUTES
    ========================
    */
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <DashboardOverviewPage />,
            },
            {
                path: "overview",
                element: <DashboardOverviewPage />,
            },
            {
                path: "campaigns",
                element: <MyCampaignsPage />,
            },
            {
                path: "profile",
                element: <ProfilePage />,
            },
            {
                path: "reports",
                element: <ReportsPage />,
            },
        ],
    },
]);
