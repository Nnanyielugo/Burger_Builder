import axios from 'axios';

const instance = axios.create({
  // set baseUrl to firebase api base enspoint
  baseURL: 'https://react-burger-96363.firebaseio.com/'
});

export default instance;