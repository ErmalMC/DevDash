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

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main_page />} />
                <Route path="/profile" element={<Profile_page />} />
                <Route path="/dclient" element={<ClientDetailsForJob />} />
                <Route path="/dhandyman" element={<HandymanJobDetails />} />
                <Route path="/register" element={<Register/>} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
