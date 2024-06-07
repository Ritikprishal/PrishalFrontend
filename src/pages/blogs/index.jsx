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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Blog() {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogDescription, setBlogDescription] = useState('');
  const [blogText, setBlogText] = useState('');
  const [blogDate, setBlogDate] = useState('');
  const [blogImg, setBlogImg] = useState(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updatedBlog, setUpdatedBlog] = useState({});
  const [updatedBlogImg, setUpdatedBlogImg] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:1000/admin/getallblog', {
        headers: {
          authorization: localStorage.getItem('authToken'),
        },
      });
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setMessage('Failed to fetch blogs.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setBlogImg(e.target.files[0]);
  };

  const validate = () => {
    const newErrors = {};
    if (!blogTitle) newErrors.blogTitle = 'Blog title is required';
    if (!blogDescription) newErrors.blogDescription = 'Blog description is required';
    if (!blogText) newErrors.blogText = 'Blog posted by  is required';
    if (!blogDate) newErrors.blogDate = 'Blog date is required';
    if (!blogImg) newErrors.blogImg = 'Blog image is required';
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
    formData.append('blog_title', blogTitle);
    formData.append('blog_description', blogDescription);
    formData.append('posted_by', blogText);
    formData.append('posted_at', blogDate);
    formData.append('blog_img', blogImg);

    try {
      const response = await axios.post('http://localhost:1000/admin/createblog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: localStorage.getItem('authToken'),
        },
      });

      if (response.status === 201) {
        setMessage('Blog added successfully.');
        setIsSuccess(true);
        fetchBlogs();
      } else {
        setMessage('Failed to add blog.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error adding blog:', error);
      setMessage('Error: ' + (error.response?.data?.error || 'Unexpected error'));
      setIsSuccess(false);
    }
  };

  const handleDelete = async (blogId) => {
    try {
      const response = await axios.delete(`http://localhost:1000/admin/deleteblog/${blogId}`, {
        headers: {
          authorization: localStorage.getItem('authToken'),
        },
      });
      if (response.status === 200) {
        setMessage('Blog deleted successfully.');
        setIsSuccess(true);
        const updatedBlog = blog.filter((blog) => blog._id !== blogId);
        setBlog(updatedBlog);
      } else {
        setMessage('Failed to delete blog.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      setMessage('Error: ' + (error.response?.data?.error || 'Unexpected error'));
      setIsSuccess(false);
    }
  };

  const handleUpdateOpen = (blog) => {
    setUpdateOpen(true);
    setUpdatedBlog(blog);
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('blog_title', updatedBlog.blog_title);
    formData.append('blog_description', updatedBlog.blog_description);
    formData.append('posted_by', updatedBlog.blog_text);
    formData.append('posted_at', updatedBlog.blog_date);
    if (updatedBlogImg) {
      formData.append('blog_img', updatedBlogImg);
    }

    try {
      const response = await axios.put(`http://localhost:1000/admin/updateblog/${updatedBlog._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: localStorage.getItem('authToken'),
        },
      });

      if (response.status === 200) {
        setMessage('Blog updated successfully.');
        setIsSuccess(true);
        fetchBlogs();
        handleUpdateClose();
      } else {
        setMessage('Failed to update blog.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      setMessage('Error: ' + (error.response?.data?.error || 'Unexpected error'));
      setIsSuccess(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>
            Add New Blog
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" error={Boolean(errors.blogTitle)}>
              <TextField
                label="Blog Title"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                required
              />
              {errors.blogTitle && <FormHelperText>{errors.blogTitle}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.blogDescription)}>
              <Typography variant="body1" gutterBottom>
                Blog Description
              </Typography>
              <ReactQuill
                value={blogDescription}
                onChange={setBlogDescription}
                theme="snow"
              />
              {errors.blogDescription && <FormHelperText>{errors.blogDescription}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.blogText)}>
              <TextField
                label="Posted By"
                value={blogText}
                onChange={(e) => setBlogText(e.target.value)}
                required
              />
              {errors.blogText && <FormHelperText>{errors.blogText}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.blogDate)}>
              <TextField
                label="Blog Date"
                type="date"
                value={blogDate}
                onChange={(e) => setBlogDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
              {errors.blogDate && <FormHelperText>{errors.blogDate}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.blogImg)}>
              <Typography variant="body1" gutterBottom>
                Upload blog image
              </Typography>
              <Button variant="contained" component="label">
                Choose File
                <input type="file" accept="image/*" hidden onChange={handleFileChange} required />
              </Button>
              {blogImg && <Typography variant="body2" sx={{ mt: 1 }}>{blogImg.name}</Typography>}
              {errors.blogImg && <FormHelperText>{errors.blogImg}</FormHelperText>}
            </FormControl>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
              Add Blog
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
            Blogs
          </Typography>
          {loading ? (
            <Typography variant="body1">Loading...</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table aria-label="blogs table">
                <TableHead>
                  <TableRow>
                    <TableCell>Blog Title</TableCell>
                    <TableCell>Blog Description</TableCell>
                    <TableCell>Posted By</TableCell>
                    <TableCell>Posted On</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blog && blog.length > 0 ? blog.map((blog) => (
                    <TableRow key={blog._id}>
                      <TableCell>{blog.blog_title}</TableCell>
                      <TableCell>
                        <div dangerouslySetInnerHTML={{ __html: blog.blog_description }} />
                      </TableCell>
                      <TableCell>{blog.posted_by}</TableCell>
                      <TableCell>{new Date(blog.posted_at).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <Button variant="contained" color="primary" onClick={() => handleUpdateOpen(blog)}>
                          Update
                        </Button>
                        <Button variant="contained" color="error" onClick={() => handleDelete(blog._id)} sx={{ ml: 1 }}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No blogs available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Grid>
      <Dialog open={updateOpen} onClose={handleUpdateClose}>
        <DialogTitle>Update Blog</DialogTitle>
        <DialogContent>
          <form onSubmit={handleUpdateSubmit}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Blog Title"
                value={updatedBlog.blog_title || ''}
                onChange={(e) => setUpdatedBlog({ ...updatedBlog, blog_title: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Typography variant="body1" gutterBottom>
                Blog Description
              </Typography>
              <ReactQuill
                value={updatedBlog.blog_description || ''}
                onChange={(value) => setUpdatedBlog({ ...updatedBlog, blog_description: value })}
                theme="snow"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Posted By"
                value={updatedBlog.blog_text || ''}
                onChange={(e) => setUpdatedBlog({ ...updatedBlog, blog_text: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Blog Date"
                type="date"
                value={updatedBlog.blog_date ? updatedBlog.blog_date.substring(0, 10) : ''}
                onChange={(e) => setUpdatedBlog({ ...updatedBlog, blog_date: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Typography variant="body1" gutterBottom>
                Update blog image
              </Typography>
              <Button variant="contained" component="label">
                Choose File
                <input type="file" accept="image/*" hidden onChange={(e) => { setUpdatedBlogImg(e.target.files[0]); setUpdatedBlog({ ...updatedBlog, blog_img: e.target.files[0] }); }} />
              </Button>
              {updatedBlogImg && <Typography variant="body2" sx={{ mt: 1 }}>{updatedBlogImg.name}</Typography>}
            </FormControl>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
              Update Blog
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
