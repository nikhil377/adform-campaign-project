import axios from 'axios';

export const fetchUsers = () => {
  return dispatch => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        dispatch({
          type: 'FETCH_USERS_SUCCESS',
          payload: response.data
        });
      })
      .catch(error => {
        dispatch({
          type: 'FETCH_USERS_FAILURE',
          payload: error.message
        });
      });
  };
};
