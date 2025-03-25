import React, { useState } from "react";
import axios from "axios";

const DataSendPage = () => {
    const [files, setFiles] = useState([]); // 선택된 파일들을 배열로 초기화
    const [status, setStatus] = useState("");
    const [time, setTime] = useState(""); // 처리 시간
    const [serverUrl, setServerUrl] = useState("localhost:8080"); // 서버 주소
    const [threads, setThreads] = useState(10); // 기본 스레드 수

    // 파일 선택 처리
    const handleFileChange = (e) => {
        setFiles(e.target.files ? Array.from(e.target.files) : []);
    };

    // 서버 주소 입력 처리
    const handleServerUrlChange = (e) => {
        setServerUrl(e.target.value);
    };

    // 스레드 수 변경 처리
    const handleThreadsChange = (e) => {
        setThreads(e.target.value);
    };

    // 파일 업로드 함수: /upload 엔드포인트 호출하여 파일들을 업로드한 후,
    // 서버로부터 { downloadFiles: [{ url, displayName }, ...] } 형태의 응답을 받음
    const uploadFiles = async () => {
        if (!files || files.length === 0) {
            throw new Error("파일을 선택하세요");
        }
        const formData = new FormData();
        files.forEach(file => {
            formData.append("files", file);
        });
        const response = await axios.post(`http://${serverUrl}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        // 반환된 응답에서 displayName(원본 파일명)을 추출하여 사용
        return response.data.downloadFiles.map(fileObj => fileObj.displayName);
    };

    // 단일 스레드 전송: 먼저 파일 업로드 후, 업로드된 파일 목록을 /send-single 엔드포인트로 전달
    const sendDataSingleThread = async () => {
        try {
            const startTime = Date.now();
            const uploadedFileNames = await uploadFiles();
            const response = await axios.post(`http://${serverUrl}/send-single`, { fileNames: uploadedFileNames }, {
                headers: { "Content-Type": "application/json" },
            });
            const endTime = Date.now();
            setTime(endTime - startTime);
            setStatus(response.data.message || "단일 스레드 전송 완료");
        } catch (error) {
            setStatus("전송 실패: " + error.message);
        }
    };

    // 멀티 스레드 전송: 먼저 파일 업로드 후, 업로드된 파일 목록과 스레드 수를 /send-multiple 엔드포인트에 전달
    const sendDataMultiThread = async () => {
        try {
            const startTime = Date.now();
            const uploadedFileNames = await uploadFiles();
            const response = await axios.post(`http://${serverUrl}/send-multiple`, { fileNames: uploadedFileNames, threads }, {
                headers: { "Content-Type": "application/json" },
            });
            const endTime = Date.now();
            setTime(endTime - startTime);
            setStatus(response.data.message || "멀티 스레드 전송 완료");
        } catch (error) {
            setStatus("전송 실패: " + error.message);
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
            <p>{status}</p>
            <p>처리 시간: {time} ms</p>
            {files.length > 0 && (
                <div>
                    <h3>선택된 파일:</h3>
                    <ul>
                        {files.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DataSendPage;