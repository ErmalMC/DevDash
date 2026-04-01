import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { APP_ROUTES } from './router/routes.jsx';
import './styles/index.css';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {APP_ROUTES.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}
            </Routes>
        </BrowserRouter>
    );
}

