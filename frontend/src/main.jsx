import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import './profile.css';

import Main_page from './Main_page.jsx';
import Profile_page from './Profile_page.jsx';
import ClientDetailsForJob from './ClientDetailsForJob.jsx';
import HandymanJobDetails from './details_client.jsx';
import Register from './Registration_page.jsx';
import Welcome from './welcome_page.jsx';
import Login from "./login.jsx";
import MyApplications from './MyApplications.jsx';
import MyRequests from './MyRequests.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/main" element={<Main_page />} />
                <Route path="/profile" element={<Profile_page />} />
                <Route path="/dclient" element={<ClientDetailsForJob />} />
                <Route path="/dhandyman" element={<HandymanJobDetails />} />
                <Route path="/register" element={<Register/>} />
                <Route path="/welcome" element={<Welcome/>} />
                <Route path="/login" element={<Login/>}/>
                <Route path="/my-applications" element={<MyApplications />} />
                <Route path="/my-requests" element={<MyRequests />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);