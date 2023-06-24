import axios from 'axios'
import Cookies from 'js-cookie'

const url = "http://localhost/simpeg/api"; //WEB APACHE
// const baseUrl = "http://localhost:8000/api"; // PHP LIVE SERVER

const token = Cookies.get('user') != undefined ? JSON.parse(Cookies.get('user')).token : ''

const http = axios.create({
  baseURL: url,
  headers: {
    Authorization: 'Bearer ' + token,
    Accept: 'application/json'
  },
  withCredentials: true,
})

export { http, url }
