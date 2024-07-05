import axios from "axios";

const walksApi = axios.create({
  baseUrl: "https://the-way-i-walk.onrender.com/api",
});

export const addWalk = (walkObject) => {
  return walksApi
    .post("/walks", walkObject)
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });
};

export const getWalks = async () => {
  const response = await walksApi.get(`/walks`);
  return response.data.walks;
};

export const getWalkLocationPoints = async (walkId) => {
  const response = await walksApi.get(`/walks/${walkId}/walk_location_points`);
  return response.data.locationPoints;
};

export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/login`, {
    username,
    password,
  });
  return response.data;
};
