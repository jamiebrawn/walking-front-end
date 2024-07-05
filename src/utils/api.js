import axios from 'axios'

const walksApi = axios.create ({ baseURL: "https://the-way-i-walk.onrender.com/api"});

export const addWalk = (walkObject) => {
    return walksApi.post("/walks", walkObject).then(({ data }) => data)
    .catch(error => {
        throw error;
    });
}

export const getWalks = async () => {
  const response = await walksApi.get(`/walks`);
  return response.data.walks;
};

export const getWalkLocationPoints = async (walkId) => {
  const response = await walksApi.get(
    `/walklocationpoints/${walkId}`
  );
  return response.data.locationPoints;
};
