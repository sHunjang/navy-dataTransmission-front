import React, { useState } from "react";
import axios from "axios";

const DataSendPage = () => {
    const [files, setFiles] = useState([]);  // 선택된 파일들
    const [status, setStatus] = useState("");
    const [time, setTime] = useState("");      // 처리 시간
    const [serverUrl, setServerUrl] = useState("localhost:8080");  // 서버 주소
    const [threads, setThreads] = useState(10); // 기본 스레드 수

    // 파일 선택 처리
    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    // 서버 주소 입력 처리
    const handleServerUrlChange = (e) => {
        setServerUrl(e.target.value);
    };

    // 스레드 수 변경 처리
    const handleThreadsChange = (e) => {
        setThreads(e.target.value);
    };

    // 단일 스레드 파일 전송
    const sendDataSingleThread = async () => {
        if (files.length === 0) {
            setStatus("파일을 선택하세요");
            return;
        }
        const fileNames = Array.from(files).map(file => file.name);
        try {
            const startTime = Date.now();
            const response = await axios.post(`http://${serverUrl}/send-single`, { fileNames }, {
                headers: { "Content-Type": "application/json" },
            });
            const endTime = Date.now();
            setTime(endTime - startTime);
            setStatus(response.data.message || "단일 스레드 전송 완료");
        } catch (error) {
            setStatus("전송 실패: " + error.message);
        }
    };

    // 멀티 스레드 파일 전송
    const sendDataMultiThread = async () => {
        if (files.length === 0) {
            setStatus("파일을 선택하세요");
            return;
        }
        const fileNames = Array.from(files).map(file => file.name);
        try {
            const startTime = Date.now();
            const response = await axios.post(`http://${serverUrl}/send-multiple`, { fileNames, threads }, {
                headers: { "Content-Type": "application/json" },
            });
            const endTime = Date.now();
            setTime(endTime - startTime);
            setStatus(response.data.message || "멀티 스레드 전송 완료");
        } catch (error) {
            setStatus("전송 실패: " + error.message);
        }
    };

    // 실험 결과 자동 저장 함수 (예시 데이터 사용)
    const saveResult = async () => {
        const resultData = {
            experiment_datetime: new Date().toLocaleString(),
            file_count: files ? files.length : 0,  // files가 undefined이면 0으로 설정
            single_thread_time: 512, // 예시값
            multi_thread_results: { "4": 218, "10": 165 } // 예시값
        };
    
        try {
            const response = await axios.post(`http://${serverUrl}/save-result`, resultData, {
                headers: { "Content-Type": "application/json" },
            });
            setStatus(`실험 결과 저장 완료: ${response.data.filePath}`);
        } catch (error) {
            setStatus("실험 결과 저장 실패: " + error.message);
        }
    };

    return (
        <div>
            <h2>파일 전송</h2>
            <div>
                <label>서버 주소: </label>
                <input
                    type="text"
                    value={serverUrl}
                    onChange={handleServerUrlChange}
                    placeholder="예: localhost:8080"
                />
            </div>
            <div>
                <label>스레드 수: </label>
                <input
                    type="number"
                    value={threads}
                    onChange={handleThreadsChange}
                    min="1"
                />
            </div>
            <div>
                <input type="file" multiple onChange={handleFileChange} />
            </div>
            <div>
                <button onClick={sendDataSingleThread}>단일 스레드로 전송</button>
                <button onClick={sendDataMultiThread}>멀티 스레드로 전송</button>
            </div>
            <div>
                <button onClick={saveResult}>실험 결과 저장</button>
            </div>
            <p>{status}</p>
            <p>처리 시간: {time} ms</p>
            {files.length > 0 && (
                <div>
                    <h3>전송된 파일:</h3>
                    <ul>
                        {Array.from(files).map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DataSendPage;