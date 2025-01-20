import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//browser router is a browser application, it stores commen URL
import { MantineProvider } from "@mantine/core";
//mantineprovider is an abstract component that takes in any router and provides a common API for all of them
import Home from "./screens/home";
import '@mantine/core/styles.css';
import './index.css';

const paths = [
  {
    path: '/',
    element: (
      <Home />
    ),
  },
];

const BrowserRouter = createBrowserRouter(paths);

const App = () => { // Ensure React.FC type for functional component
  return (
    <MantineProvider>
      <RouterProvider router={BrowserRouter} />
    </MantineProvider>
  )
}

export default App;