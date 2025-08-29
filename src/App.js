import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './Pages/home';
import AboutPage from './Pages/about';
import Services from './Pages/services';
import PartnersPage from './Pages/partners';  
import ContactPage from './Pages/contact';

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
    path: "/services", // Fixed route path
    element: <Services />, // Fixed component reference
  },
  {
    path: "/partners",
    element: <PartnersPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;