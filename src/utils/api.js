import axios from "axios";

const api = axios.create({
  baseURL: "",
});

export const getWalks = async () => {
  const response = await api.get(`/walks`);
  return response.data.walks;
};

export const getWalkLocationPoints = async (walkId) => {
  const response = await api.get(
    `/walks/${walkId}/walk_location_points`
  );
  return response.data.walk_location_points;
};
