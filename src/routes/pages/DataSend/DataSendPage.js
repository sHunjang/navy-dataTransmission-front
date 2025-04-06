import React, { useState, useEffect } from "react";
import axios from "axios";

const DataSendPage = () => {
    const [files, setFiles] = useState([]);  // 여러 파일 상태
    const [status, setStatus] = useState("");
    const [time, setTime] = useState("");  // 처리 시간 상태
    const [serverUrl, setServerUrl] = useState("localhost:8080");  // 서버 URL 상태
    const [socket, setSocket] = useState(null); // WebSocket 상태

    // 파일 선택 시 처리
    const handleFileChange = (e) => {
        setFiles(e.target.files);  // 여러 파일 저장
    };

    // 서버 주소 입력 처리
    const handleServerUrlChange = (e) => {
        setServerUrl(e.target.value);  // 서버 URL 업데이트
    };

    // WebSocket 연결
    const connectWebSocket = () => {
        // WebSocket URL 수정
        const ws = new WebSocket(`ws://${serverUrl}/ws`);  // 'ws://'로 수정
        // 위 코드에서 서버 URL을 그대로 사용하면서 'ws://'를 붙여서 WebSocket 연결을 시도합니다.

        ws.onopen = () => {
            console.log("WebSocket 연결됨");
        };

        ws.onmessage = (event) => {
            const serverMessage = event.data;
            setStatus(serverMessage);  // 서버에서 받은 메시지 처리
        };

        ws.onerror = (error) => {
            console.error("WebSocket 에러:", error);
        };

        setSocket(ws);  // WebSocket 객체 저장
    };

    // 단일 스레드로 파일 전송
    const sendDataSingleThread = async () => {
        if (files.length === 0) {
            setStatus("파일을 선택하세요");
            return;
        }

        const fileNames = Array.from(files).map(file => file.name);  // 파일 이름만 추출

        try {
            const startTime = Date.now();
            const response = await axios.post(`http://${serverUrl}/api/transmission/send-single`, fileNames, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const endTime = Date.now();
            setTime(endTime - startTime);
            setStatus(response.data);

            // WebSocket을 통해 처리 완료 후 서버에 알림 보내기
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send("단일 스레드 전송 완료");
            }
        } catch (error) {
            setStatus("전송 실패: " + error.message);
        }
    };

    // 멀티 스레드로 파일 전송
    const sendDataMultiThread = async () => {
        if (files.length === 0) {
            setStatus("파일을 선택하세요");
            return;
        }

        const fileNames = Array.from(files).map(file => file.name);  // 파일 이름만 추출

        try {
            const startTime = Date.now();
            const response = await axios.post(`http://${serverUrl}/api/transmission/send-multiple`, fileNames, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const endTime = Date.now();
            setTime(endTime - startTime);
            setStatus(response.data);

            // WebSocket을 통해 처리 완료 후 서버에 알림 보내기
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send("멀티 스레드 전송 완료");
            }
        } catch (error) {
            setStatus("전송 실패: " + error.message);
        }
    };

    useEffect(() => {
        connectWebSocket();  // 컴포넌트가 마운트 될 때 WebSocket 연결
        return () => {
            if (socket) {
                socket.close();  // 컴포넌트가 언마운트 될 때 WebSocket 연결 종료
            }
        };
    }, [serverUrl]);  // serverUrl이 바뀔 때마다 WebSocket 연결 새로 설정

    return (
        <div>
            <h2>파일 전송</h2>
            <div>
                <label>서버 주소: </label>
                <input
                    type="text"
                    value={serverUrl}
                    onChange={handleServerUrlChange}
                    placeholder="서버 주소를 입력하세요 (예: localhost:8080)"
                />
            </div>
            <div>
                <input type="file" multiple onChange={handleFileChange} />
            </div>
            <div>
                <button onClick={sendDataSingleThread}>단일 스레드로 전송</button>
                <button onClick={sendDataMultiThread}>멀티 스레드로 전송</button>
            </div>
            <p>{status}</p>
            <p>처리 시간: {time} ms</p>
        </div>
    );
};

export default DataSendPage;