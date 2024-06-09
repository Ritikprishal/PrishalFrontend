import React from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, Grid, Stack, TextField, Typography, FormHelperText } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

const OtpVerification = () => {
    const navigate=useNavigate()
    const formik = useFormik({
        initialValues: {
            otp: '',
            email: '', // Include email in initial values
        },
        validationSchema: Yup.object({
            otp: Yup.string().length(6, 'OTP must be exactly 6 digits').required('OTP is required'),
            email: Yup.string().required('Email is required'),
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                // Replace with your API call for OTP verification
                const response = await axios.post('https://prishalbackend.vercel.app/auth/otpverification', {
                    userId: values.email,
                    verificationcode: values.otp, // Use values.otp here
                });

                if (response.status === 200) {
                    // Handle successful OTP verification here
                    console.log('OTP verification successful', response.data);
                    localStorage.setItem('authToken',response.data.token)
                    // Redirect or further processing
                    navigate('/admin');

                } else {
                    // Handle unsuccessful OTP verification here
                    setErrors({ submit: response.data.message });
                }
            } catch (error) {
                setErrors({ submit: error.message });
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <form noValidate onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stack spacing={1}>
                        <Typography variant="h5">User ID</Typography>
                        <OutlinedInput
                            id="email-login"
                            type="email"
                            value={formik.values.email}
                            name="email"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            placeholder="Enter User ID"
                            fullWidth
                            error={Boolean(formik.touched.email && formik.errors.email)}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <FormHelperText error>{formik.errors.email}</FormHelperText>
                        )}
                        <Typography variant="h5">Enter OTP</Typography>
                        <TextField
                            id="otp"
                            name="otp"
                            type="text"
                            value={formik.values.otp}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(formik.touched.otp && formik.errors.otp)}
                            helperText={formik.touched.otp && formik.errors.otp}
                            placeholder="Enter OTP"
                            fullWidth
                        />
                    </Stack>
                </Grid>
                {formik.errors.submit && (
                    <Grid item xs={12}>
                        <FormHelperText error>{formik.errors.submit}</FormHelperText>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" disabled={formik.isSubmitting}>
                        Verify OTP
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default OtpVerification;
