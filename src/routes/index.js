import React from "react";
import { Route, Routes } from "react-router-dom";
import { DataSendPage, HomePage, DataReceivePage } from "./pages";

const Router = () => {

    return (
        <div className="App">
            <Routes>
                <Route path="/send" element={<DataSendPage />} />
                <Route path="/receive" element={<DataReceivePage />} />
                <Route path="/" element={<HomePage />}></Route>
                
            </Routes>
        </div>
    );
}

export default Router;