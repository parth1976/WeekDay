import axios from "axios";

export const callAPI = (method = 'GET', url, data = {}, header = {}, loader = true, abortSignal) => {
    return new Promise((resolve, reject) => {
        // loader && loaderActivityFn(true);
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
                error.response.data.message = 'Please contact admin.';
                reject(error?.response?.data);
            })
            .finally(() => {
                // loader && loaderActivityFn(false);
            });
    });
};