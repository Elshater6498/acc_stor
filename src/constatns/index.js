import axios from 'axios'

export const BASE_URL = 'https://api.alefmenu.com'
export const FETCHER = (url) => axios.get(url).then((res) => res.data)
export const options = {
  IN_RESTAURANT: 'in_restaurant',
  DELIVER_HOME: 'deliver_home',
  FROM_STORE: 'from_store',
}
export const optionsArr = ['in_restaurant', 'deliver_home', 'from_store']
