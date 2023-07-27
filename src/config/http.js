import axios from 'axios'
import Cookies from 'js-cookie'

/**
 * LOCAL ENV
 */
// const url = "http://192.168.3.24/simpeg/api"; //WEB APACHE
// const url_print = "http://192.168.3.24/simpeg"; //WEB APACHE
/**
 * PROD ENV
 */
const url = "https://assesment.gsrs.my.id/backend/api"; //WEB APACHE
const url_print = "https://assesment.gsrs.my.id/backend"; //WEB APACHE
// const url = "http://localhost/simpeg/api"; //WEB APACHE
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

export { http, url, url_print }
