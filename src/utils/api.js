import axios from 'axios'

const walksApi = axios.create ({ baseUrl: "/api"});

export const addWalk = (walkObject) => {
    return walksApi.post("/walks", walkObject).then(({ data }) => data)
    .catch(error => {
        throw error;
    });
}