import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Logged In successfully!');
            window.setTimeout(() => {
                location.assign('/');
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
            url: 'http://127.0.0.1:3000/api/v1/users/logout'
        });
        if (res.data.status == 'success') location.reload(true);
    } catch (err) {
        showAlert('error', 'Error Logging Out! Please try again later.');
    }
};

export const signup = async form => {
    try {
        const name = form.get('name');
        const email = form.get('email');
        const password = form.get('password');
        const confirmPassword =  form.get('confirmPassword');
        
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                confirmPassword
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', `Hello ${name.split(' ')[0].toUpperCase()}, Welcome to Natours Famiy!`);
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
