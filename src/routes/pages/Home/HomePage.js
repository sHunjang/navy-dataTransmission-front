import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div>
            <h2>홈페이지</h2>
            <p>데이터 전송과 저장 페이지로 이동하려면 아래 링크를 클릭하세요:</p>
            <Link to="/upload">데이터 업로드</Link>
        </div>
    );
};

export default HomePage;