import WelcomePage from '../../pages/welcome/WelcomePage.jsx';
import MainPage from '../../pages/home/MainPage.jsx';
import ProfilePage from '../../pages/profile/ProfilePage.jsx';
import RegisterPage from '../../pages/auth/RegisterPage.jsx';
import LoginPage from '../../pages/auth/LoginPage.jsx';
import MyApplicationsPage from '../../pages/applications/MyApplicationsPage.jsx';
import MyRequestsPage from '../../pages/requests/MyRequestsPage.jsx';
import ClientJobDetailsPage from '../../pages/requests/ClientJobDetailsPage.jsx';
import HandymanJobDetailsPage from '../../pages/requests/HandymanJobDetailsPage.jsx';
import { APP_PATHS } from './paths.js';

export const APP_ROUTES = [
    { path: APP_PATHS.HOME, element: <WelcomePage /> },
    { path: APP_PATHS.WELCOME, element: <WelcomePage /> },
    { path: APP_PATHS.MAIN, element: <MainPage /> },
    { path: APP_PATHS.PROFILE, element: <ProfilePage /> },
    { path: APP_PATHS.REGISTER, element: <RegisterPage /> },
    { path: APP_PATHS.LOGIN, element: <LoginPage /> },
    { path: APP_PATHS.MY_APPLICATIONS, element: <MyApplicationsPage /> },
    { path: APP_PATHS.MY_REQUESTS, element: <MyRequestsPage /> },
    { path: APP_PATHS.CLIENT_DETAILS, element: <ClientJobDetailsPage /> },
    { path: APP_PATHS.HANDYMAN_DETAILS, element: <HandymanJobDetailsPage /> },
];

