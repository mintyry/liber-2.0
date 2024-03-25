import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Error from './pages/Error.jsx';
// for routing process
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import pages to be used as children
import Home from './pages/Home.jsx';
import MyLibrary from './pages/MyLibrary.jsx';
import Signup from './pages/Signup.jsx';
import SingleBook from './pages/SingleBook.jsx';
import SearchResults from './pages/SearchResults.jsx';
import Surprise from './pages/Surprise.jsx';
import Success from './pages/Success.jsx';

// import BookReader from './pages/BookReader.jsx'
import Three from './Components/Three/Three.jsx';
import AllBooks from './pages/AllBooks.jsx';
import Admin from './pages/Admin.jsx'



// this establishes pages component structure and their paths
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    // children components and paths that will be injected into Outlet
    children: [
      {
        // this index: true means home will be the default path that matches App.jsx, other children objects should not have index:true.
        index: true,
        element: <Home />
      },
      {
        path: '/myLibrary',
        element: <MyLibrary />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/singleBook/:id',
        element: <SingleBook />
      },
      {
        path: '/bookReader/:bookId',
        element: <Three />
      },
      {
        path: '/searchresults',
        element: <SearchResults />
      },
      {
        path: '/allbooks',
        element: <AllBooks />
      },
      {
        path: '/admin',
        element: <Admin />
      },
      {
        path: '/surprise',
        element: <Surprise />
      },
      {
        path: '/success',
        element: <Success />
      },
   
    ]
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
