import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged In successfully!');
      window.setTimeout(() => {
        location.assign('/overview');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status == 'success') location.assign('/login');
  } catch (err) {
    showAlert('error', 'Error Logging Out! Please try again later.');
  }
};

export const signup = async (form) => {
  try {
    const name = form.get('name');
    const email = form.get('email');
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        confirmPassword,
      },
    });
    if (res.data.status === 'success') {
      showAlert(
        'success',
        `Hello ${name.split(' ')[0].toUpperCase()}, Welcome to Natours Famiy!`
      );
      window.setTimeout(() => {
        location.assign('/overview');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', res.data.message);
      const token = res.data.resetURL.split('resetPassword/')[1];
      // window.setTimeout(() => {
      //   location.assign(`/password-reset/${token}`);
      // }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const passwordReset = async (password, confirmPassword) => {
  try {
    const token = document.querySelector('body').dataset.token;
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        confirmPassword,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password Reset Successful!');
      window.setTimeout(() => {
        location.assign(`/login`);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
