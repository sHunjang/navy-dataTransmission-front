import React, { useState } from "react";
import axios from "axios";

const FileUploadPage = () => {
    const [files, setFiles] = useState(null);           // 다중 파일 선택 상태
    const [serverUrl, setServerUrl] = useState("localhost:8080");
    const [downloadUrls, setDownloadUrls] = useState([]); // 서버가 반환한 다운로드 URL 목록

    // 파일 선택 처리
    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    // 서버 주소 입력 처리
    const handleServerUrlChange = (e) => {
        setServerUrl(e.target.value);
    };

    // 파일 업로드 처리
    const handleUpload = async () => {
        if (!files || files.length === 0) {
            alert("파일을 선택하세요");
            return;
        }
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        try {
            const response = await axios.post(`http://${serverUrl}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setDownloadUrls(response.data.downloadUrls);
        } catch (error) {
            console.error("파일 업로드 실패:", error);
        }
    };

    return (
        <div>
            <h2>파일 업로드 및 다운로드</h2>
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
                <input type="file" multiple onChange={handleFileChange} />
            </div>
            <div>
                <button onClick={handleUpload}>파일 업로드</button>
            </div>
            {downloadUrls.length > 0 && (
                <div>
                    <h3>다운로드 링크:</h3>
                    <ul>
                        {downloadUrls.map((url, index) => (
                            <li key={index}>
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                    {url}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FileUploadPage;