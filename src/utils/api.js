import axios from 'axios';

const api = axios.create({
  baseURL: "",
});

export const getWalks = async () => {
  try {
    const response = await api.get(`/walks`);
    return response.data.walks;
  } catch (error) {
    console.error('Error retrieving walks:', error);
    throw error;
  }
};
