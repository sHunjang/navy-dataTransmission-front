import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div>
            <h2>홈페이지</h2>
            <p>데이터 전송과 저장 페이지로 이동하려면 아래 링크를 클릭하세요:</p>
            <ul>
                <li>
                    <Link to="/send">데이터 전송 페이지</Link>
                </li>
                <li>
                    <Link to="/receive">데이터 수신 페이지</Link>
                </li>
            </ul>
        </div>
    );
};

export default HomePage;