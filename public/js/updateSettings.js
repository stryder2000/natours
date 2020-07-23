import axios from 'axios';
import { showAlert } from './alerts';

//type is either 'data' or 'password'
export const updateUserSettings = async (data, type) => {
    try {
        const url =
            type === 'data'
                ? 'http://127.0.0.1:3000/api/v1/users/updateMe'
                : 'http://127.0.0.1:3000/api/v1/users/updatePassword';
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });
        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully!`);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
