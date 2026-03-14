// store/applicationStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import useAuthStore from './authStore';

// Types based on your Application model
export interface Application {
  _id: string;
  job: Job | string;
  user: User | string;
  resume: string;
  status: 'applied' | 'shortlisted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  _id: string;
  jobTitle: string;
  companyName: string;
  jobPlace: string;
  salary: number;
  jobType?: string;
  jobLevel: 'senior' | 'mid' | 'fresher';
  jobDescription?: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  requiredSkills: string[];
  recruiter: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
}

export interface PopulatedApplication extends Omit<Application, 'job' | 'user'> {
  job: Job;
  user: User;
}

export interface ApplicationFilters {
  status?: ('applied' | 'shortlisted' | 'rejected')[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  jobTitle?: string;
  companyName?: string;
}

export interface UpdateApplicationStatusData {
  status: 'applied' | 'shortlisted' | 'rejected';
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

interface ApplicationStore {
  // State
  userApplications: PopulatedApplication[];
  adminApplications: PopulatedApplication[];
  selectedApplication: PopulatedApplication | null;
  applicationCount: number;
  isLoading: boolean;
  error: string | null;
  filters: ApplicationFilters;

  // User Actions
  createApplication: (jobId: string, resume: File) => Promise<boolean>;
  fetchUserApplications: () => Promise<void>;
  
  // Admin Actions
  fetchAdminApplications: () => Promise<void>;
  fetchApplicationDetails: (applicationId: string) => Promise<PopulatedApplication | null>;
  updateApplicationStatus: (applicationId: string, status: 'applied' | 'shortlisted' | 'rejected') => Promise<boolean>;
  fetchApplicationCount: (jobId: string) => Promise<number>;
  
  // Filter Actions
  setFilters: (filters: Partial<ApplicationFilters>) => void;
  resetFilters: () => void;
  
  // Selection Actions
  setSelectedApplication: (application: PopulatedApplication | null) => void;
  clearError: () => void;
  
  // Helper Methods
  filterApplications: (applications: PopulatedApplication[]) => PopulatedApplication[];
}

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// Create axios instance WITHOUT credentials
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Create a separate instance for file uploads (multipart/form-data)
const axiosFileInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Add token interceptor to file instance as well
axiosFileInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set, get) => ({
      // Initial State
      userApplications: [],
      adminApplications: [],
      selectedApplication: null,
      applicationCount: 0,
      isLoading: false,
      error: null,
      filters: {},

      // Create application (user action)
      createApplication: async (jobId: string, resume: File) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = useAuthStore.getState();
          
          if (!user || user.role !== 'user') {
            throw new Error("Only users can apply for jobs");
          }
          
          // Create FormData for file upload
          const formData = new FormData();
          formData.append("resume", resume);

         for (let [key, value] of formData.entries()) {
  console.log(key, value);
}

          const response = await axiosFileInstance.post<ApiResponse<Application>>(
            `/applications/create-application/${jobId}`,
            formData
          );

          const data = response.data;

          if (data.success) {
            // Refresh user applications
            await get().fetchUserApplications();
            set({ isLoading: false });
            return true;
          }
          return false;
        } catch (error) {
          const errorMessage = axios.isAxiosError(error) 
            ? error.response?.data?.message || error.message
            : "Failed to submit application";
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      // Fetch all applications for current user
      fetchUserApplications: async () => {
        set({ isLoading: true, error: null });
        try {
          const { user } = useAuthStore.getState();
          
          if (!user || user.role !== 'user') {
            throw new Error("Unauthorized");
          }

          const response = await axiosInstance.get<ApiResponse<PopulatedApplication[]>>(
            `/applications/applied-jobs`
          );

          const data = response.data;

          if (data.success) {
            set({ 
              userApplications: data.data, 
              isLoading: false 
            });
          }
        } catch (error) {
          const errorMessage = axios.isAxiosError(error) 
            ? error.response?.data?.message || error.message
            : "Failed to fetch applications";
          set({ error: errorMessage, isLoading: false });
        }
      },

      // Fetch all applications for admin (jobs posted by admin)
      fetchAdminApplications: async () => {
        set({ isLoading: true, error: null });
        try {
          const { isAdmin } = useAuthStore.getState();
          
          if (!isAdmin()) {
            throw new Error("Unauthorized: Admin access required");
          }

          const response = await axiosInstance.get<ApiResponse<PopulatedApplication[]>>(
            `/applications/admin-applications`
          );

          const data = response.data;

          if (data.success) {
            set({ 
              adminApplications: data.data, 
              isLoading: false 
            });
          }
        } catch (error) {
          const errorMessage = axios.isAxiosError(error) 
            ? error.response?.data?.message || error.message
            : "Failed to fetch admin applications";
          set({ error: errorMessage, isLoading: false });
        }
      },

      // Fetch single application details
      fetchApplicationDetails: async (applicationId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get<ApiResponse<PopulatedApplication>>(
            `/applications/get-application/${applicationId}`
          );

          const data = response.data;

          if (data.success) {
            set({ 
              selectedApplication: data.data, 
              isLoading: false 
            });
            return data.data;
          }
          return null;
        } catch (error) {
          const errorMessage = axios.isAxiosError(error) 
            ? error.response?.data?.message || error.message
            : "Failed to fetch application details";
          set({ error: errorMessage, isLoading: false });
          return null;
        }
      },

      // Update application status (admin action)
      updateApplicationStatus: async (applicationId: string, status: 'applied' | 'shortlisted' | 'rejected') => {
        set({ isLoading: true, error: null });
        try {
          const { isAdmin } = useAuthStore.getState();
          
          if (!isAdmin()) {
            throw new Error("Unauthorized: Only admins can update application status");
          }

          const response = await axiosInstance.patch<ApiResponse<PopulatedApplication>>(
            `/applications/${applicationId}/status`,
            { status }
          );

          const data = response.data;

          if (data.success) {
            // Update in both lists
            set(state => ({
              adminApplications: state.adminApplications.map(app => 
                app._id === applicationId ? { ...app, status } : app
              ),
              userApplications: state.userApplications.map(app => 
                app._id === applicationId ? { ...app, status } : app
              ),
              selectedApplication: state.selectedApplication?._id === applicationId 
                ? { ...state.selectedApplication, status } 
                : state.selectedApplication,
              isLoading: false
            }));
            return true;
          }
          return false;
        } catch (error) {
          const errorMessage = axios.isAxiosError(error) 
            ? error.response?.data?.message || error.message
            : "Failed to update application status";
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      // Fetch application count for a specific job
      fetchApplicationCount: async (jobId: string) => {
        try {
          const response = await axiosInstance.get<ApiResponse<{ application: number }>>(
            `/applications/applications-count/${jobId}`
          );

          const data = response.data;

          if (data.success) {
            set({ applicationCount: data.data.application });
            return data.data.application;
          }
          return 0;
        } catch (error) {
          console.error("Failed to fetch application count:", error);
          return 0;
        }
      },

      // Set filters
      setFilters: (newFilters: Partial<ApplicationFilters>) => {
        set(state => ({
          filters: { ...state.filters, ...newFilters }
        }));
      },

      // Reset filters
      resetFilters: () => {
        set({ filters: {} });
      },

      // Set selected application
      setSelectedApplication: (application: PopulatedApplication | null) => {
        set({ selectedApplication: application });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Helper method to filter applications based on current filters
      filterApplications: (applications: PopulatedApplication[]) => {
        const { filters } = get();
        
        return applications.filter(app => {
          // Status filter
          if (filters.status && filters.status.length > 0 && 
              !filters.status.includes(app.status)) {
            return false;
          }

          // Date range filter
          if (filters.dateRange?.start) {
            const appDate = new Date(app.createdAt);
            const startDate = new Date(filters.dateRange.start);
            if (appDate < startDate) return false;
          }

          if (filters.dateRange?.end) {
            const appDate = new Date(app.createdAt);
            const endDate = new Date(filters.dateRange.end);
            if (appDate > endDate) return false;
          }

          // Job title filter (if job is populated)
          if (typeof app.job !== 'string' && filters.jobTitle) {
            if (!app.job.jobTitle.toLowerCase().includes(filters.jobTitle.toLowerCase())) {
              return false;
            }
          }

          // Company name filter (if job is populated)
          if (typeof app.job !== 'string' && filters.companyName) {
            if (!app.job.companyName.toLowerCase().includes(filters.companyName.toLowerCase())) {
              return false;
            }
          }

          return true;
        });
      },
    }),
    {
      name: "application-storage",
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
);

// Helper hook to get filtered applications
export const useFilteredUserApplications = () => {
  const { userApplications, filterApplications } = useApplicationStore();
  return filterApplications(userApplications);
};

export const useFilteredAdminApplications = () => {
  const { adminApplications, filterApplications } = useApplicationStore();
  return filterApplications(adminApplications);
};

export default useApplicationStore;