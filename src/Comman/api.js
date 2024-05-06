import axios from "axios";

export const callAPI = (method = 'GET', url, data = {}) => {
    return new Promise((resolve, reject) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const request = {
            method,
            url,
            headers:myHeaders,
            data,
        };

        axios(request)
            .then(async (data) => {
                resolve(data?.data);
            })
            .catch(async (error) => {
                error.response.data.message = 'Please Try Later';
                reject(error?.response?.data);
            })
            .finally(() => {
            });
    });
};