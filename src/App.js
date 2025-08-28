import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './Pages/home';
import AboutPage from './Pages/about';
import DoctorsPage from './Pages/doctors';
import CareersPage from './Pages/careers';
//import BlogPage from './Pages/blog';




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
    path: "/doctors",
    element: <DoctorsPage />,
  },
  {
    path: "/careers",
    element: <CareersPage />,
  },
  // {
  //   path: "/blog",
  //   element: <BlogPage />,
  // },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;