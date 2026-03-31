import axios from 'axios';

const API_URL = 'https://api.aman-city.com/v1';

export const getActivePowerData = async () => {
  const response = await axios.get(`${API_URL}/sensors/power`);
  return response.data; 
};