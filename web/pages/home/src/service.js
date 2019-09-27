import axios from 'axios';
const HOST = '//127.0.0.1:3000';

const getFileJSON = (fileName) => {
    let url = `${HOST}/getConfigJSON/${fileName}`
    return axios.get(url,{
        params: {}
    });
}

const createPage = (param) => {
    let url = `${HOST}/pageJson`
    return axios.post(url, param)
}
export {
    getFileJSON,
    createPage
}
