import axios from 'axios';
import { showAlert } from './alerts';

//type is either 'data' or 'password'
export const updateUserSettings = async (data, type) => {
  try {
    const url =
      type === 'data'
        ? '/api/v1/users/updateMe'
        : '/api/v1/users/updatePassword';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);

      window.setTimeout(() => {
        location.reload();
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteAccount = async () => {
  try {
    const url = '/api/v1/users/deleteMe/';
    const res = await axios({
      method: 'DELETE',
      url,
    });

    if (res.status === 204) {
      showAlert(
        'success',
        `Your Natours Account has been deleted Permanently! We hope to see you back soon.😊`
      );

      window.setTimeout(() => {
        location.assign('/');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
