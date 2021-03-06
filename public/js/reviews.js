import axios from 'axios';
import { showAlert } from './alerts';

export const addReview = async (data) => {
  try {
    const url = '/api/v1/reviews/';

    const res = await axios({
      method: 'POST',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `Thank you for your feedback!`);

      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const url = '/api/v1/reviews/' + reviewId;

    const res = await axios({
      method: 'DELETE',
      url,
    });
    if (res.status === 204) {
      showAlert('success', `Comment deleted Successfully!`);

      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
