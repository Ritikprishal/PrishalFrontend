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

export default function Team() {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [facebookProfile, setFacebookProfile] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updatedService, setUpdatedService] = useState({});
  const [updatedProfilePic, setUpdatedProfilePic] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://prishalbackend.vercel.app/admin/getallteam', {
        headers: {
          authorization: localStorage.getItem('authToken'),
        },
      });
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching Teams:', error);
      setMessage('Failed to fetch Teams.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!designation) newErrors.designation = 'Designation is required';
    if (!facebookProfile) newErrors.facebookProfile = 'Facebook profile is required';
    if (!twitter) newErrors.twitter = 'Twitter profile is required';
    if (!linkedIn) newErrors.linkedIn = 'LinkedIn profile is required';
    if (!profilePic) newErrors.profilePic = 'Profile picture is required';
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

    const formData = new FormData();
    formData.append('name', name);
    formData.append('designation', designation);
    formData.append('facebook_profile', facebookProfile);
    formData.append('Twitter', twitter);
    formData.append('LinkedIn', linkedIn);
    formData.append('profile_img', profilePic);

    try {
      const response = await axios.post('https://prishalbackend.vercel.app/admin/createteam', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: localStorage.getItem('authToken'),
        },
      });

      if (response.status === 201) {
        setMessage('Team added successfully.');
        setIsSuccess(true);
        fetchServices();
      } else {
        setMessage('Failed to add Team.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error adding team:', error);
      setMessage('Error: ' + (error.response?.data?.error || 'Unexpected error'));
      setIsSuccess(false);
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      const response = await axios.delete(`https://prishalbackend.vercel.app/admin/deleteteam/${serviceId}`, {
        headers: {
          authorization: localStorage.getItem('authToken'),
        },
      });
      if (response.status === 200) {
        setMessage('Team deleted successfully.');
        setIsSuccess(true);
        const updatedServices = services.filter((service) => service._id !== serviceId);
        setServices(updatedServices);
      } else {
        setMessage('Failed to delete Team.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error deleting Team:', error);
      setMessage('Error: ' + (error.response?.data?.error || 'Unexpected error'));
      setIsSuccess(false);
    }
  };

  const handleUpdateOpen = (service) => {
    setUpdateOpen(true);
    setUpdatedService(service);
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', updatedService.name);
    formData.append('designation', updatedService.designation);
    formData.append('facebook_profile', updatedService.facebook_profile);
    formData.append('Twitter', updatedService.Twitter);
    formData.append('LinkedIn', updatedService.LinkedIn);
    if (updatedProfilePic) {
      formData.append('profile_img', updatedProfilePic);
    }

    console.log('Updated Service:', updatedService);
    console.log('Updated Profile Pic:', updatedProfilePic);

    try {
      const response = await axios.put(`https://prishalbackend.vercel.app/admin/updateteam/${updatedService._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: localStorage.getItem('authToken'),
        },
      });

      if (response.status === 200) {
        setMessage('Team updated successfully.');
        setIsSuccess(true);
        fetchServices();
        handleUpdateClose();
      } else {
        setMessage('Failed to update team.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error updating team:', error);
      setMessage('Error: ' + (error.response?.data?.error || 'Unexpected error'));
      setIsSuccess(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>
            Add New Team Member
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" error={Boolean(errors.name)}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {errors.name && <FormHelperText>{errors.name}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.designation)}>
              <TextField
                label="Designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              />
              {errors.designation && <FormHelperText>{errors.designation}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.facebookProfile)}>
              <TextField
                label="Facebook Profile"
                value={facebookProfile}
                onChange={(e) => setFacebookProfile(e.target.value)}
                required
              />
              {errors.facebookProfile && <FormHelperText>{errors.facebookProfile}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.twitter)}>
              <TextField
                label="Twitter"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                required
              />
              {errors.twitter && <FormHelperText>{errors.twitter}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.linkedIn)}>
              <TextField
                label="LinkedIn"
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
                required
              />
              {errors.linkedIn && <FormHelperText>{errors.linkedIn}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.profilePic)}>
              <Typography variant="body1" gutterBottom>
                Upload Profile Picture
              </Typography>
              <Button variant="contained" component="label">
                Choose File
                <input type="file" accept="image/*" hidden onChange={handleFileChange} required />
              </Button>
              {profilePic && <Typography variant="body2" sx={{ mt: 1 }}>{profilePic.name}</Typography>}
              {errors.profilePic && <FormHelperText>{errors.profilePic}</FormHelperText>}
            </FormControl>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
              Add Team Member
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
            Team Members
          </Typography>
          {loading ? (
            <Typography variant="body1">Loading...</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table aria-label="services table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Designation</TableCell>
                    <TableCell>Facebook</TableCell>
                    <TableCell>Twitter</TableCell>
                    <TableCell>LinkedIn</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services && Array.isArray(services) && services.map((service) => (
                    <TableRow key={service._id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{service.designation}</TableCell>
                      <TableCell>{service.facebook_profile}</TableCell>
                      <TableCell>{service.Twitter}</TableCell>
                      <TableCell>{service.LinkedIn}</TableCell>
                      <TableCell align="right">
                        <Button variant="contained" color="primary" onClick={() => handleUpdateOpen(service)}>
                          Update
                        </Button>
                        <Button variant="contained" color="error" onClick={() => handleDelete(service._id)} sx={{ ml: 1 }}>
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
        <DialogTitle>Update Team Member</DialogTitle>
        <DialogContent>
          <form onSubmit={handleUpdateSubmit}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Name"
                value={updatedService.name || ''}
                onChange={(e) => setUpdatedService({ ...updatedService, name: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Designation"
                value={updatedService.designation || ''}
                onChange={(e) => setUpdatedService({ ...updatedService, designation: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Facebook Profile"
                value={updatedService.facebook_profile || ''}
                onChange={(e) => setUpdatedService({ ...updatedService, facebook_profile: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Twitter"
                value={updatedService.Twitter || ''}
                onChange={(e) => setUpdatedService({ ...updatedService, Twitter: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="LinkedIn"
                value={updatedService.LinkedIn || ''}
                onChange={(e) => setUpdatedService({ ...updatedService, LinkedIn: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Typography variant="body1" gutterBottom>
                Update Profile Picture
              </Typography>
              <Button variant="contained" component="label">
                Choose File
                <input type="file" accept="image/*" hidden onChange={(e) => { setUpdatedProfilePic(e.target.files[0]); setUpdatedService({ ...updatedService, profile_img: e.target.files[0] }); }} />
              </Button>
              {updatedProfilePic && <Typography variant="body2" sx={{ mt: 1 }}>{updatedProfilePic.name}</Typography>}
            </FormControl>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }} >
              Update Team Member
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
