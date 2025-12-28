import api from './api';

// Get all jobs with optional filters
export const getAllJobs = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.location && filters.location !== 'all') {
      params.append('location', filters.location);
    }
    if (filters.type && filters.type !== 'all') {
      params.append('type', filters.type);
    }
    if (filters.experience && filters.experience !== 'all') {
      params.append('experience', filters.experience);
    }
    if (filters.industry && filters.industry !== 'all') {
      params.append('industry', filters.industry);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }

    const queryString = params.toString();
    const url = queryString ? `/jobs?${queryString}` : '/jobs';
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// Get single job by ID
export const getJobById = async (id) => {
  try {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job ${id}:`, error);
    throw error;
  }
};

// Save a job
export const saveJob = async (jobId, jobData) => {
  try {
    const response = await api.post(`/jobs/${jobId}/save`, jobData);
    return response.data;
  } catch (error) {
    console.error('Error saving job:', error);
    throw error;
  }
};

// Unsave a job
export const unsaveJob = async (jobId) => {
  try {
    const response = await api.delete(`/jobs/${jobId}/save`);
    return response.data;
  } catch (error) {
    console.error('Error unsaving job:', error);
    throw error;
  }
};

// Check if job is saved
export const isJobSaved = async (jobId) => {
  try {
    const response = await api.get(`/jobs/${jobId}/saved`);
    return response.data.isSaved;
  } catch (error) {
    console.error('Error checking if job is saved:', error);
    return false;
  }
};

// Get all saved jobs
export const getSavedJobs = async () => {
  try {
    const response = await api.get('/jobs/saved');
    return response.data;
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    throw error;
  }
};

// Helper function to format salary
export const formatSalary = (salary) => {
  if (!salary) return 'Competitive';
  
  const formatAmount = (amount) => {
    if (amount >= 100000) {
      return `${(amount / 100000).toFixed(1)}L`;
    }
    return `${(amount / 1000).toFixed(0)}K`;
  };
  
  if (salary.min && salary.max) {
    return `${formatAmount(salary.min)} - ${formatAmount(salary.max)} ${salary.currency || 'PKR'}`;
  }
  
  return 'Competitive';
};

// Helper function to format date
export const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};
