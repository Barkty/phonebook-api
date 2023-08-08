export const openRoutes = [
    { method: "GET", path: "/" },
    { method: "GET", path: "/api" },
    { method: "POST", path: "/auth/login" },
    { method: "POST", path: "/auth/signup" },
    { method: "POST", path: "/auth/request-otp" },
    { method: "POST", path: "/auth/verify-otp" },
    { method: "POST", path: "/auth/reset-password" },
    { method: "POST", path: "/auth/resend-otp/forgot" },
    { method: "POST", path: "/auth/logout" }
]