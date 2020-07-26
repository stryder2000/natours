import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout, signup } from './login';
import { updateUserSettings } from './updateSettings';
import { bookTour } from './stripe';

//DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateUserForm = document.querySelector('.form-user-data');
const updateUserPassword = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

//DELEGATION
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        let form = new FormData();

        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('password', document.getElementById('password').value);
        form.append(
            'confirmPassword',
            document.getElementById('confirm-password').value
        );
        document.getElementById('signup').textContent = 'Signing up...'
        signup(form);
    });
}

if (logOutBtn) {
    logOutBtn.addEventListener('click', logout);
}

if (updateUserForm) {
    updateUserForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);

        updateUserSettings(form, 'data');
    });
}

if (updateUserPassword) {
    updateUserPassword.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent =
            'Updating...';
        const passwordCurrent = document.getElementById('password-current')
            .value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('password-confirm')
            .value;

        await updateUserSettings(
            { passwordCurrent, password, confirmPassword },
            'password'
        );

        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
        document.querySelector('.btn--save-password').textContent =
            'Save Password';
    });
}

if (bookBtn)
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    });