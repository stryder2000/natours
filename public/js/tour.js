import axios from 'axios';
import { showAlert } from './alerts';

export const deleteTour = async (tourId) => {
  try {
    const url = '/api/v1/tours/' + tourId;
    const res = await axios({
      method: 'DELETE',
      url,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} deleted successfully!`);

      window.setTimeout(() => {
        location.reload();
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
