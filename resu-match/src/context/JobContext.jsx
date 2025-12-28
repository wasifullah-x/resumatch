import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchSavedJobs();
        fetchApplications();
    }, []);

    const fetchSavedJobs = async () => {
        try {
            const response = await api.get('/jobs/saved');
            setSavedJobs(response.data);
        } catch (error) {
            console.error('Error fetching saved jobs:', error);
        }
    };

    const fetchApplications = async () => {
        try {
            const response = await api.get('/applications');
            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const saveJob = async (job) => {
        try {
            await api.post(`/jobs/${job.id}/save`, job);
            setSavedJobs([...savedJobs, job]);
        } catch (error) {
            console.error('Error saving job:', error);
            throw error;
        }
    };

    const unsaveJob = async (jobId) => {
        try {
            await api.delete(`/jobs/${jobId}/save`);
            setSavedJobs(savedJobs.filter(job => job.id !== jobId));
        } catch (error) {
            console.error('Error unsaving job:', error);
            throw error;
        }
    };

    const applyToJob = async (applicationData) => {
        try {
            const response = await api.post('/applications', applicationData);
            setApplications([...applications, response.data]);
            return response.data;
        } catch (error) {
            console.error('Error applying to job:', error);
            throw error;
        }
    };

    const value = {
        savedJobs,
        applications,
        saveJob,
        unsaveJob,
        applyToJob,
        refreshSavedJobs: fetchSavedJobs,
        refreshApplications: fetchApplications
    };

    return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};
