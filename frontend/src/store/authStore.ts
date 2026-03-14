import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  username: string;
  email: string;
  role: "user";
  avatar: string;
  applications?: string[];
  createdAt: string;
  updatedAt: string;
  adminName?: string;
}

export interface Admin {
  _id: string;
  adminName: string;
  email: string;
  role: "admin";
  jobsPosted?: string[];
  createdAt: string;
  updatedAt: string;
}

export type AuthUser = User | Admin;

export interface LoginCredentials {
  email: string;
  password: string;
  role: "user" | "admin";
}

export interface UserSignupData {
  username: string;
  email: string;
  password: string;
  role?: "user";
  avatar?: File | string;
}

export interface AdminSignupData {
  adminName: string;
  email: string;
  password: string;
  role: "admin";
}

export type SignupData = UserSignupData | AdminSignupData;

export interface LoginResponse {
  statusCode: number;
  data: {
    user?: User;
    admin?: Admin;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

export interface SignupResponse {
  statusCode: number;
  data: {
    user?: User;
    admin?: Admin;
    accessToken?: string;
    refreshToken?: string;
  };
  message: string;
  success: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

// ─── State & Actions ──────────────────────────────────────────────────────────

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthActions {
  login: (email: string, password: string, role: "user" | "admin") => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  signup: (signupData: SignupData) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
  isAdmin: () => boolean;
  isUser: () => boolean;
  getUserRole: () => "user" | "admin" | null;
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<boolean>;
  getCurrentUser: () => Promise<AuthUser | null>;
  updateProfile: (data: Partial<User | Admin>) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

type AuthStore = AuthState & AuthActions;

// ─── Axios Instance ───────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Store ────────────────────────────────────────────────────────────────────

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // ── Initial State ──
      user: null,
      isAuthenticated: false,
      isLoggedIn: false,
      isLoading: false,
      error: null,
      accessToken: null,
      refreshToken: null,

      // ── Login ──
      login: async (email, password, role) => {
        set({ isLoading: true, error: null });

        try {
          const endpoint = role === "admin"
            ? "/admin/login-admin"
            : "/users/login";

          const response = await axiosInstance.post<LoginResponse>(endpoint, {
            email,
            password,
          });

          const data = response.data;

          if (data.success) {
            const { accessToken, refreshToken } = data.data;
            const rawUser = role === "admin" ? data.data.admin : data.data.user;

            if (!rawUser) {
              throw new Error("User data not found in response");
            }

            const userWithRole: AuthUser = { ...rawUser, role };

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("userRole", role);

            set({
              user: userWithRole,
              accessToken,
              refreshToken,
              isAuthenticated: true,
              isLoggedIn : true,
              isLoading: false,
              error: null,
            });

            return { success: true, user: userWithRole };
          }

          throw new Error(data.message || "Login failed");

        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.message || error.message
            : error instanceof Error
              ? error.message
              : "An error occurred during login";

          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // ── Signup ──
      signup: async (signupData) => {
        set({ isLoading: true, error: null });

        try {
          let endpoint: string;
          const formData = new FormData();

          if ("adminName" in signupData) {
            endpoint = "/admin/register-admin";
            formData.append("adminName", signupData.adminName);
            formData.append("email", signupData.email);
            formData.append("password", signupData.password);
          } else {
            endpoint = "/users/register";
            formData.append("username", signupData.username);
            formData.append("email", signupData.email);
            formData.append("password", signupData.password);
            if (signupData.avatar instanceof File) {
              formData.append("avatar", signupData.avatar);
            }
          }

          const response = await axiosInstance.post(endpoint, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          const data = response.data as SignupResponse;

          if (data.success) {
            const { accessToken, refreshToken } = data.data;

            const rawUser = data.data.user ?? data.data.admin;

            const role: "user" | "admin" = data.data.admin ? "admin" : "user";

            if (accessToken && refreshToken && rawUser) {
              const userWithRole: AuthUser = { ...rawUser, role };

              localStorage.setItem("accessToken", accessToken);
              localStorage.setItem("refreshToken", refreshToken);
              localStorage.setItem("userRole", role);

              set({
                user: userWithRole,
                accessToken,
                refreshToken,
                isAuthenticated: true,
                isLoggedIn : true,
                isLoading: false,
                error: null,
              });

              return { success: true, user: userWithRole };
            }

            // Signup succeeded but no tokens (backend didn't return them)
            // Fall back to auto-login
            const loginResult = await get().login(
              signupData.email,
              signupData.password,
              "adminName" in signupData ? "admin" : "user"
            );

            return loginResult;
          }

          throw new Error(data.message || "Signup failed");

        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.message || error.message
            : error instanceof Error
              ? error.message
              : "Signup failed";

          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // ── Logout ──
      logout: async () => {
        set({ isLoading: true });

        try {
          const { user } = get();
          const endpoint = user?.role === "admin"
            ? "/admin/logout-admin"
            : "/users/logout";

          await axiosInstance.post(endpoint);
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userRole");

          set({
            user: null,
            isAuthenticated: false,
            isLoggedIn : false,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,
          });
        }
      },

      // ── Helpers ──
      clearError: () => set({ error: null }),

      isAdmin: () => get().user?.role === "admin",

      isUser: () => get().user?.role === "user",

      getUserRole: () => get().user?.role ?? null,

      getAccessToken: () => get().accessToken || localStorage.getItem("accessToken"),

      // ── Refresh Token ──
      refreshAccessToken: async () => {
        try {
          const { refreshToken, user } = get();
          const endpoint = user?.role === "admin"
            ? "/admin/refresh-token"
            : "/users/refresh-token";

          const response = await axiosInstance.post(endpoint, {
            refreshToken: refreshToken || localStorage.getItem("refreshToken"),
          });

          const data = response.data;

          if (data.success) {
            const newAccessToken: string = data.data.accessToken;
            const newRefreshToken: string = data.data.refreshToken || refreshToken || "";

            localStorage.setItem("accessToken", newAccessToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            set({ accessToken: newAccessToken, refreshToken: newRefreshToken });
            return true;
          }

          return false;
        } catch (error) {
          console.error("Token refresh failed:", error);
          return false;
        }
      },

      // ── Get Current User ──
      getCurrentUser: async () => {
        try {
          const { user } = get();
          const endpoint = user?.role === "admin"
            ? "/admin/current-admin"
            : "/users/current-user";

          const response = await axiosInstance.get<ApiResponse<AuthUser>>(endpoint);

          if (response.data.success) {
            const fetchedUser = response.data.data;
            set({ user: fetchedUser });
            return fetchedUser;
          }

          return null;
        } catch (error) {
          console.error("Failed to fetch current user:", error);
          return null;
        }
      },

      // ── Update Profile ──
      updateProfile: async (data) => {
        try {
          const { user } = get();
          const endpoint = user?.role === "admin"
            ? "/admin/update-details"
            : "/users/update-details";

          const response = await axiosInstance.patch<ApiResponse<AuthUser>>(endpoint, data);

          if (response.data.success) {
            set({ user: { ...user, ...data } as AuthUser });
            return true;
          }

          return false;
        } catch (error) {
          console.error("Profile update failed:", error);
          return false;
        }
      },

      // ── Change Password ──
      changePassword: async (oldPassword, newPassword) => {
        try {
          const { user } = get();
          const endpoint = user?.role === "admin"
            ? "/admin/change-password"
            : "/users/change-password";

          const response = await axiosInstance.post(endpoint, {
            oldPassword,
            newPassword,
          });

          return response.data.success;
        } catch (error) {
          console.error("Password change failed:", error);
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoggedIn : state.isLoggedIn,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

export default useAuthStore;