import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  FormHelperText,
  Table,
  TableContainer,
  TableHead,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';
import axios from 'axios';

export default function Job() {
  const [jobProfile, setJobProfile] = useState('');
  const [jobType, setJobType] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [location, setLocation] = useState('');
  const [noOfPositions, setNoOfPositions] = useState('');
  const [postedBy, setPostedBy] = useState('');
  const [postedAt, setPostedAt] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updatedJob, setUpdatedJob] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:1000/admin/getalljobs', {
        headers: {
          authorization: localStorage.getItem('authToken'),
        },
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setMessage('Failed to fetch jobs.');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!jobProfile) newErrors.jobProfile = 'Job profile is required';
    if (!jobType) newErrors.jobType = 'Job type is required';
    if (!jobDescription) newErrors.jobDescription = 'Job description is required';
    if (!location) newErrors.location = 'Location is required';
    if (!noOfPositions) newErrors.noOfPositions = 'Number of positions is required';
    if (!postedBy) newErrors.postedBy = 'Posted by is required';
    if (!postedAt) newErrors.postedAt = 'Posted at is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const formData = {
      job_profile: jobProfile,
      job_type: jobType,
      job_description: jobDescription,
      location,
      no_of_positions: noOfPositions,
      posted_by: postedBy,
      posted_at: postedAt,
    };

    try {
      const response = await axios.post('http://localhost:1000/admin/createjob', formData, {
        headers: {
          authorization: localStorage.getItem('authToken'),
        },
      });

      if (response.status === 201) {
        setMessage('Job added successfully.');
        setIsSuccess(true);
        fetchJobs();
      } else {
        setMessage('Failed to add job.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error adding job:', error);
      setMessage('Error: ' + (error.response?.data?.error || 'Unexpected error'));
      setIsSuccess(false);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      const response = await axios.delete(`http://localhost:1000/admin/deletejob/${jobId}`, {
        headers: {
          authorization: localStorage.getItem('authToken'),
        },
      });
      if (response.status === 200) {
        setMessage('Job deleted successfully.');
        setIsSuccess(true);
        const updatedJobs = jobs.filter((job) => job._id !== jobId);
        setJobs(updatedJobs);
      } else {
        setMessage('Failed to delete job.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      setMessage('Error: ' + (error.response?.data?.error || 'Unexpected error'));
      setIsSuccess(false);
    }
  };

  const handleUpdateOpen = (job) => {
    setUpdateOpen(true);
    setUpdatedJob(job);
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      job_profile: updatedJob.job_profile,
      job_type: updatedJob.job_type,
      job_description: updatedJob.job_description,
      location: updatedJob.location,
      no_of_positions: updatedJob.no_of_positions,
      posted_by: updatedJob.posted_by,
      posted_at: updatedJob.posted_at,
    };

    try {
      const response = await axios.put(`http://localhost:1000/admin/updatejob/${updatedJob._id}`, formData, {
        headers: {
          authorization: localStorage.getItem('authToken'),
        },
      });

      if (response.status === 200) {
        setMessage('Job updated successfully.');
        setIsSuccess(true);
        fetchJobs();
        handleUpdateClose();
      } else {
        setMessage('Failed to update job.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error updating job:', error);
      setMessage('Error: ' + (error.response?.data?.error || 'Unexpected error'));
      setIsSuccess(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>
            Add New Job
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" error={Boolean(errors.jobProfile)}>
              <TextField
                label="Job Profile"
                value={jobProfile}
                onChange={(e) => setJobProfile(e.target.value)}
                required
              />
              {errors.jobProfile && <FormHelperText>{errors.jobProfile}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.jobType)}>
              <TextField
                label="Job Type"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                required
              />
              {errors.jobType && <FormHelperText>{errors.jobType}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.jobDescription)}>
              <TextField
                label="Job Description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
              />
              {errors.jobDescription && <FormHelperText>{errors.jobDescription}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.location)}>
              <TextField
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              {errors.location && <FormHelperText>{errors.location}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.noOfPositions)}>
              <TextField
                label="Number of Positions"
                type="number"
                value={noOfPositions}
                onChange={(e) => setNoOfPositions(e.target.value)}
                required
              />
              {errors.noOfPositions && <FormHelperText>{errors.noOfPositions}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.postedBy)}>
              <TextField
                label="Posted By"
                value={postedBy}
                onChange={(e) => setPostedBy(e.target.value)}
                required
              />
              {errors.postedBy && <FormHelperText>{errors.postedBy}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.postedAt)}>
              <TextField
                label="Posted At"
                type="date"
                value={postedAt}
                onChange={(e) => setPostedAt(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
              {errors.postedAt && <FormHelperText>{errors.postedAt}</FormHelperText>}
            </FormControl>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
              Add Job
            </Button>
          </form>
          {message && (
            <Typography variant="body1" sx={{ mt: 2, color: isSuccess ? 'green' : 'red' }}>
              {message}
            </Typography>
          )}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>
            Jobs
          </Typography>
          {loading ? (
            <Typography variant="body1">Loading...</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table aria-label="jobs table">
                <TableHead>
                  <TableRow>
                    <TableCell>Job Profile</TableCell>
                    <TableCell>Job Type</TableCell>
                    <TableCell>Job Description</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>No of Positions</TableCell>
                    <TableCell>Posted By</TableCell>
                    <TableCell>Posted At</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs && Array.isArray(jobs) && jobs.map((job) => (
                    <TableRow key={job._id}>
                      <TableCell>{job.job_profile}</TableCell>
                      <TableCell>{job.job_type}</TableCell>
                      <TableCell>{job.job_description}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{job.no_of_positions}</TableCell>
                      <TableCell>{job.posted_by}</TableCell>
                      <TableCell>{new Date(job.posted_at).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <Button variant="contained" color="primary" onClick={() => handleUpdateOpen(job)}>
                          Update
                        </Button>
                        <Button variant="contained" color="error" onClick={() => handleDelete(job._id)} sx={{ ml: 1 }}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Grid>
      <Dialog open={updateOpen} onClose={handleUpdateClose}>
        <DialogTitle>Update Job</DialogTitle>
        <DialogContent>
          <form onSubmit={handleUpdateSubmit}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Job Profile"
                value={updatedJob.job_profile || ''}
                onChange={(e) => setUpdatedJob({ ...updatedJob, job_profile: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Job Type"
                value={updatedJob.job_type || ''}
                onChange={(e) => setUpdatedJob({ ...updatedJob, job_type: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Job Description"
                value={updatedJob.job_description || ''}
                onChange={(e) => setUpdatedJob({ ...updatedJob, job_description: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Location"
                value={updatedJob.location || ''}
                onChange={(e) => setUpdatedJob({ ...updatedJob, location: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Number of Positions"
                type="number"
                value={updatedJob.no_of_positions || ''}
                onChange={(e) => setUpdatedJob({ ...updatedJob, no_of_positions: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Posted By"
                value={updatedJob.posted_by || ''}
                onChange={(e) => setUpdatedJob({ ...updatedJob, posted_by: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Posted At"
                type="date"
                value={updatedJob.posted_at || ''}
                onChange={(e) => setUpdatedJob({ ...updatedJob, posted_at: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </FormControl>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
              Update Job
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
