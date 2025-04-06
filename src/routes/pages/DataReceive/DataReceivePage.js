// DataReceivePage.js (클라이언트 측)
import React, { useState, useEffect } from "react";
import axios from "axios";

const DataReceivePage = () => {
    const [receivedData, setReceivedData] = useState("");

    // 컴포넌트가 마운트될 때 서버에서 데이터 수신
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/receive");
                setReceivedData(response.data); // 서버에서 받은 데이터 설정
            } catch (error) {
                console.error("수신 실패: ", error);
                setReceivedData("수신 실패");
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>서버에서 받은 데이터</h2>
            <p>{receivedData}</p>
        </div>
    );
};

export default DataReceivePage;