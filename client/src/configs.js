import axios        from 'axios'

/*axios.defaults.transformResponse = [function (data, headers) {
    return Object.values(JSON.parse(data))[0]
  }]
  */
axios.defaults.withCredentials = true;

axios.defaults.baseURL = process.env.REACT_APP_SERVER_PORT

export default null