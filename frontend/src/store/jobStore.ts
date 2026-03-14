// store/jobStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import useAuthStore from './authStore';

// Types based on your Job model
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
  recruiter: {
    _id: string;
    adminName: string;
    email: string;
  } | string;
  applicants: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  search?: string;
  location?: string;
  jobType?: string[];
  jobLevel?: ('senior' | 'mid' | 'fresher')[];
  salary?: {
    min?: number;
    max?: number;
  };
  requiredSkills?: string[];
  sortBy?: 'recent' | 'salary' | 'relevance';
}

export interface JobApplication {
  _id: string;
  jobId: string;
  userId: string;
  userName: string;
  userEmail: string;
  resume: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: string;
}

export interface CreateJobData {
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
}

export interface UpdateJobData extends Partial<CreateJobData> {}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

interface JobStore {
  // State
  jobs: Job[];
  filteredJobs: Job[];
  selectedJob: Job | null;
  adminJobs: Job[];
  isLoading: boolean;
  error: string | null;
  filters: JobFilters;
  applications: JobApplication[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;

  // User Actions
  fetchAllJobs: (page?: number, limit?: number) => Promise<void>;
  fetchJobById: (id: string) => Promise<Job | null>;
  searchJobs: (query: string) => Promise<void>;
  
  // Admin Actions
  fetchAdminJobs: () => Promise<void>;
  createJob: (jobData: CreateJobData) => Promise<boolean>;
  updateJob: (jobId: string, jobData: UpdateJobData) => Promise<boolean>;
  deleteJob: (jobId: string) => Promise<boolean>;
  
  // Filter Actions
  updateFilters: (filters: Partial<JobFilters>) => void;
  resetFilters: () => void;
  sortJobs: (sortBy: 'recent' | 'salary' | 'relevance') => void;
  
  // Selection Actions
  setSelectedJob: (job: Job | null) => void;
  clearError: () => void;
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

const useJobStore = create<JobStore>()(
  persist(
    (set, _get) => ({
      // Initial State
      jobs: [],
      filteredJobs: [],
      selectedJob: null,
      adminJobs: [],
      isLoading: false,
      error: null,
      filters: {
        sortBy: 'recent'
      },
      applications: [],
      totalJobs: 0,
      currentPage: 1,
      totalPages: 1,

      // Fetch all jobs (for users)
      fetchAllJobs: async (page = 1, limit = 10) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get<ApiResponse<Job[]>>(
            `/job/jobs?page=${page}&limit=${limit}`
          );

          const data = response.data;

          if (data.success) {
            set({ 
              jobs: data.data, 
              filteredJobs: data.data,
              totalJobs: data.data.length,
              currentPage: page,
              isLoading: false 
            });
          }
        } catch (error) {
          const errorMessage = axios.isAxiosError(error) 
            ? error.response?.data?.message || error.message
            : "Failed to fetch jobs";
          set({ error: errorMessage, isLoading: false });
        }
      },

      // Fetch job by ID
      fetchJobById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get<ApiResponse<Job>>(`/job/jobs/${id}`);

          const data = response.data;

          if (data.success) {
            set({ selectedJob: data.data, isLoading: false });
            return data.data;
          }
          return null;
        } catch (error) {
          const errorMessage = axios.isAxiosError(error) 
            ? error.response?.data?.message || error.message
            : "Failed to fetch job details";
          set({ error: errorMessage, isLoading: false });
          return null;
        }
      },

      // Search jobs
      searchJobs: async (query: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get<ApiResponse<Job[]>>(
            `/jobs/search?q=${encodeURIComponent(query)}`
          );

          const data = response.data;

          if (data.success) {
            set({ filteredJobs: data.data, isLoading: false });
          }
        } catch (error) {
          const errorMessage = axios.isAxiosError(error) 
            ? error.response?.data?.message || error.message
            : "Search failed";
          set({ error: errorMessage, isLoading: false });
        }
      },

      // Fetch jobs posted by admin
      fetchAdminJobs: async () => {
        set({ isLoading: true, error: null });
        try {
          const { isAdmin } = useAuthStore.getState();
          
          if (!isAdmin()) {
            throw new Error("Unauthorized: Admin access required");
          }

          const response = await axiosInstance.get<ApiResponse<Job[]>>(`/job/admin`);

          const data = response.data;

          if (data.success) {
            set({ adminJobs: data.data, isLoading: false });
          }
        } catch (error) {
          const errorMessage = axios.isAxiosError(error) 
            ? error.response?.data?.message || error.message
            : "Failed to fetch admin jobs";
          set({ error: errorMessage, isLoading: false });
        }
      },

      // Create a new job (admin action)
      createJob: async (jobData: CreateJobData) => {
        set({ isLoading: true, error: null });
        try {
          const { isAdmin } = useAuthStore.getState();
          
          if (!isAdmin()) {
            throw new Error("Unauthorized: Only admins can create jobs");
          }
          const response = await axiosInstance.post<ApiResponse<Job>>('/job/post-job', jobData);
          const data = response.data;

          if (data.success) {
  // Optimistically add the new job to the list instead of refetching
  set(state => ({
    adminJobs: [data.data, ...state.adminJobs],
    jobs: [data.data, ...state.jobs],
    filteredJobs: [data.data, ...state.filteredJobs],
    isLoading: false
  }));
  return true;
}
          return false;
        } catch (error) {
          const errorMessage = axios.isAxiosError(error) 
            ? error.response?.data?.message || error.message
            : "Failed to create job";
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      // Update job details (admin action)
      updateJob: async (jobId: string, jobData: UpdateJobData) => {
        set({ isLoading: true, error: null });
        try {
          const { isAdmin } = useAuthStore.getState();
          
          if (!isAdmin()) {
            throw new Error("Unauthorized: Only admins can update jobs");
          }

          const response = await axiosInstance.put<ApiResponse<Job>>(`/job/update-job/${jobId}`, jobData);

          const data = response.data;

          if (data.success) {
            // Update the job in the current lists
            set(state => ({
              jobs: state.jobs.map(job => 
                job._id === jobId ? data.data : job
              ),
              adminJobs: state.adminJobs.map(job => 
                job._id === jobId ? data.data : job
              ),
              selectedJob: state.selectedJob?._id === jobId ? data.data : state.selectedJob,
              isLoading: false
            }));
            return true;
          }
          return false;
        } catch (error) {
          const errorMessage = axios.isAxiosError(error) 
            ? error.response?.data?.message || error.message
            : "Failed to update job";
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      // Delete job (admin action)
      deleteJob: async (jobId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { isAdmin } = useAuthStore.getState();
          
          if (!isAdmin()) {
            throw new Error("Unauthorized: Only admins can delete jobs");
          }

          const response = await axiosInstance.delete<ApiResponse<null>>(`/job/delete-job/${jobId}`);

          const data = response.data;

          if (data.success) {
            // Remove job from all lists
            set(state => ({
              jobs: state.jobs.filter(job => job._id !== jobId),
              filteredJobs: state.filteredJobs.filter(job => job._id !== jobId),
              adminJobs: state.adminJobs.filter(job => job._id !== jobId),
              selectedJob: state.selectedJob?._id === jobId ? null : state.selectedJob,
              isLoading: false
            }));
            return true;
          }
          return false;
        } catch (error) {
          const errorMessage = axios.isAxiosError(error) 
            ? error.response?.data?.message || error.message
            : "Failed to delete job";
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      // Update filters
      updateFilters: (newFilters: Partial<JobFilters>) => {
        set(state => {
          const updatedFilters = { ...state.filters, ...newFilters };
          const filtered = applyFilters(state.jobs, updatedFilters);
          return { filters: updatedFilters, filteredJobs: filtered };
        });
      },

      // Reset filters
      resetFilters: () => {
        set(state => ({
          filters: { sortBy: 'recent' },
          filteredJobs: state.jobs
        }));
      },

      // Sort jobs
      sortJobs: (sortBy: 'recent' | 'salary' | 'relevance') => {
        set(state => {
          const sorted = [...state.filteredJobs].sort((a, b) => {
            if (sortBy === 'recent') {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            if (sortBy === 'salary') {
              return b.salary - a.salary;
            }
            // Relevance sorting could be implemented based on search query
            return 0;
          });
          return { filteredJobs: sorted, filters: { ...state.filters, sortBy } };
        });
      },

      // Set selected job
      setSelectedJob: (job: Job | null) => {
        set({ selectedJob: job });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "job-storage",
      partialize: (state) => ({
        filters: state.filters,
        currentPage: state.currentPage,
      }),
    }
  )
);

// Helper function to apply filters
const applyFilters = (jobs: Job[], filters: JobFilters): Job[] => {
  return jobs.filter(job => {
    // Search filter
    if (filters.search && 
        !job.jobTitle.toLowerCase().includes(filters.search.toLowerCase()) && 
        !job.companyName.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Location filter
    if (filters.location && 
        !job.jobPlace.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Job type filter
    if (filters.jobType && filters.jobType.length > 0 && 
        job.jobType && !filters.jobType.includes(job.jobType)) {
      return false;
    }
    
    // Job level filter
    if (filters.jobLevel && filters.jobLevel.length > 0 && 
        !filters.jobLevel.includes(job.jobLevel)) {
      return false;
    }
    
    // Salary range filter
    if (filters.salary?.min && job.salary < filters.salary.min) {
      return false;
    }
    
    if (filters.salary?.max && job.salary > filters.salary.max) {
      return false;
    }
    
    // Skills filter
    if (filters.requiredSkills && filters.requiredSkills.length > 0) {
      const hasAllSkills = filters.requiredSkills.every(skill =>
        job.requiredSkills.some(jobSkill => 
          jobSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      if (!hasAllSkills) return false;
    }
    
    return true;
  });
};

export default useJobStore;