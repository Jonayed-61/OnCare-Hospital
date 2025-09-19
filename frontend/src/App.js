import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './Pages/home';
import AboutPage from './Pages/about';
import Services from './Pages/services';
import PartnersPage from './Pages/partners';
import ContactPage from './Pages/contact';
import AppointmentPage from './Pages/appointment';
import DoctorsPage from './Pages/doctors';
import CareersPage from './Pages/careers';
import BlogPage from './Pages/blog';
import RegistrationPage from './Pages/registration';
import LoginPage from './Pages/login';
import RegisterPage from './Pages/register';
import ProfilePage from './Pages/profile';
<<<<<<< HEAD
import PartnershipApplication from './Pages/PartnershipApplication';
=======
import AdminDashboard from './Pages/adminDashboard';
import AdminLogin from './Pages/adminLogin';

>>>>>>> dfe8809e3228b61391fd64c79f165441f3252a2b


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/partners",
    element: <PartnersPage />,
  },
  {
    path: "/doctors",
    element: <DoctorsPage />,
  },
  {
    path: "/careers",
    element: <CareersPage />,
  },
  {
    path: "/blog",
    element: <BlogPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/appointment",
    element: <AppointmentPage />,
  },
  {
    path: "/registration",
    element: <RegistrationPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/partnershipapplication",
    element: <PartnershipApplication />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin-login",
    element: <AdminLogin />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;