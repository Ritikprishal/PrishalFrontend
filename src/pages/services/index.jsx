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

export default function Service() {
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceImg, setServiceImg] = useState(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updatedService, setUpdatedService] = useState({});
  const [updatedServiceImg, setUpdatedServiceImg] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://prishalbackend.vercel.app/admin/getallservice', {
        headers: {
          authorization: localStorage.getItem('authToken'),
        },
      });
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      setMessage('Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setServiceImg(e.target.files[0]);
  };

  const validate = () => {
    const newErrors = {};
    if (!serviceTitle) newErrors.serviceTitle = 'Service title is required';
    if (!serviceDescription) newErrors.serviceDescription = 'Service description is required';
    if (!serviceImg) newErrors.serviceImg = 'Service image is required';
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
    formData.append('service_title', serviceTitle);
    formData.append('service_description', serviceDescription);
    formData.append('service_img', serviceImg);

    try {
      const response = await axios.post('https://prishalbackend.vercel.app/admin/createservice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: localStorage.getItem('authToken'),
        },
      });

      if (response.status === 201) {
        setMessage('Service added successfully.');
        setIsSuccess(true);
        fetchServices();
      } else {
        setMessage('Failed to add service.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error adding service:', error);
      setMessage('Error: ' + (error.response?.data?.error || 'Unexpected error'));
      setIsSuccess(false);
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      const response = await axios.delete(`https://prishalbackend.vercel.app/admin/deleteservice/${serviceId}`, {
        headers: {
          authorization: localStorage.getItem('authToken'),
        },
      });
      if (response.status === 200) {
        setMessage('Service deleted successfully.');
        setIsSuccess(true);
        const updatedServices = services.filter((service) => service._id !== serviceId);
        setServices(updatedServices);
      } else {
        setMessage('Failed to delete service.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
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
    formData.append('service_title', updatedService.service_title);
    formData.append('service_description', updatedService.service_description);
    if (updatedServiceImg) {
      formData.append('service_img', updatedServiceImg);
    }

    console.log('Updated Service:', updatedService);
    console.log('Updated Service Image:', updatedServiceImg);

    try {
      const response = await axios.put(`https://prishalbackend.vercel.app/admin/updateservice/${updatedService._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: localStorage.getItem('authToken'),
        },
      });

      if (response.status === 200) {
        setMessage('Service updated successfully.');
        setIsSuccess(true);
        fetchServices();
        handleUpdateClose();
      } else {
        setMessage('Failed to update service.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error updating service:', error);
      setMessage('Error: ' + (error.response?.data?.error || 'Unexpected error'));
      setIsSuccess(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>
            Add New Service
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" error={Boolean(errors.serviceTitle)}>
              <TextField
                label="Service Title"
                value={serviceTitle}
                onChange={(e) => setServiceTitle(e.target.value)}
                required
              />
              {errors.serviceTitle && <FormHelperText>{errors.serviceTitle}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.serviceDescription)}>
              <TextField
                label="Service Description"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                required
              />
              {errors.serviceDescription && <FormHelperText>{errors.serviceDescription}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.serviceImg)}>
              <Typography variant="body1" gutterBottom>
                Upload service image
              </Typography>
              <Button variant="contained" component="label">
                Choose File
                <input type="file" accept="image/*" hidden onChange={handleFileChange} required />
              </Button>
              {serviceImg && <Typography variant="body2" sx={{ mt: 1 }}>{serviceImg.name}</Typography>}
              {errors.serviceImg && <FormHelperText>{errors.serviceImg}</FormHelperText>}
            </FormControl>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
              Add Service
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
            Services
          </Typography>
          {loading ? (
            <Typography variant="body1">Loading...</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table aria-label="services table">
                <TableHead>
                  <TableRow>
                    <TableCell>Service Title</TableCell>
                    <TableCell>Service Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services && Array.isArray(services) && services.map((service) => (
                    <TableRow key={service._id}>
                      <TableCell>{service.service_title}</TableCell>
                      <TableCell>{service.service_description}</TableCell>
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
        <DialogTitle>Update Service</DialogTitle>
        <DialogContent>
          <form onSubmit={handleUpdateSubmit}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Service Title"
                value={updatedService.service_title || ''}
                onChange={(e) => setUpdatedService({ ...updatedService, service_title: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Service Description"
                value={updatedService.service_description || ''}
                onChange={(e) => setUpdatedService({ ...updatedService, service_description: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Typography variant="body1" gutterBottom>
                Update service image
              </Typography>
              <Button variant="contained" component="label">
                Choose File
                <input type="file" accept="image/*" hidden onChange={(e) => { setUpdatedServiceImg(e.target.files[0]); setUpdatedService({ ...updatedService, service_img: e.target.files[0] }); }} />
              </Button>
              {updatedServiceImg && <Typography variant="body2" sx={{ mt: 1 }}>{updatedServiceImg.name}</Typography>}
            </FormControl>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }} >
              Update Service
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
