import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout, signup, passwordReset, forgotPassword } from './login';
import { updateUserSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';
import { addReview } from './reviews';

//DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const forgotPasswordForm = document.querySelector('.form--forgotPassword');
const passwordResetForm = document.getElementById('resetPassword');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateUserForm = document.querySelector('.form-user-data');
const updateUserPassword = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const reviewBtn = document.querySelector('.review-btn');

//DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    forgotPassword(email);
  });
}
if (passwordResetForm) {
  passwordResetForm.addEventListener('click', (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    console.log(password, confirmPassword);
    passwordReset(password, confirmPassword);
  });
}
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let form = new FormData();

    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('password', document.getElementById('password').value);
    form.append(
      'confirmPassword',
      document.getElementById('confirm-password').value
    );
    document.getElementById('signup').textContent = 'Signing up...';
    signup(form);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (updateUserForm) {
  updateUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateUserSettings(form, 'data');
  });
}

if (updateUserPassword) {
  updateUserPassword.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;

    await updateUserSettings(
      { passwordCurrent, password, confirmPassword },
      'password'
    );

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.btn--save-password').textContent = 'Save Password';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (reviewBtn) {
  reviewBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const review = document.querySelector('.review__input').value;
    const tour = document.getElementById('data-tour').value;
    let rating = 0;
    if (document.getElementById('star1').checked) {
      rating = 1;
    } else if (document.getElementById('star2').checked) {
      rating = 2;
    } else if (document.getElementById('star3').checked) {
      rating = 3;
    } else if (document.getElementById('star4').checked) {
      rating = 4;
    } else if (document.getElementById('star5').checked) {
      rating = 5;
    }

    if (review && rating != 0) {
      const data = {
        review,
        rating,
        tour,
      };
      addReview(data);
    }
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
