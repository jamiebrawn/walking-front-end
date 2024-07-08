import axios from "axios";

const walksApi = axios.create({
  baseURL: "https://the-way-i-walk.onrender.com/api",
});

export const addWalk = async (walkObject) => {
  try {
    const { data } = await walksApi.post("/walks", walkObject);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getWalks = async () => {
  const response = await walksApi.get(`/walks`);
  return response.data.walks;
};

export const getWalkLocationPoints = async (walkId) => {
  try {
    const response = await walksApi.get(`/walklocationpoints/${walkId}`);
    return response.data.locationPoints;
  } catch (error) {
    throw error;
  }
};

export const getWalksByUserId = async (userId) => {
  try {
    const { data } = await walksApi.get(`/walks/${userId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const logIn = async (username, password) => {
  try {
    const response = await walksApi.post(`/user/login`, {username, password} );
    return response.data.user;
  } catch (error) {
    throw error;
  }
};
