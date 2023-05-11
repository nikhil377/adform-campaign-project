import axios from 'axios';

export const fetchUsers = (searchQuery="", startDate="", endDate="") => {
  return dispatch => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        dispatch({
          type: 'FETCH_USERS_SUCCESS',
          payload: response.data,
          searchData: searchQuery,
          startDate: startDate,
          endDate: endDate
        });
      })
      .catch(error => {
        dispatch({
          type: 'FETCH_USERS_FAILURE',
          payload: error.message,
          searchData: "",
          startDate: "",
          endDate: ""
        });
      });
  };
};
