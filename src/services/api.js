import axios from "axios";

const API_URL = "http://127.0.0.1:3003/api/data/send";

export const sendData = async (data) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error("데이터 전송 실패", error);
        throw error;
    }
};