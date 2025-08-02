import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client' for createRoot
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Your global CSS
import './App.css';  // Your main app CSS
import 'bootstrap/dist/css/bootstrap.min.css';


// Get the root DOM element
const rootElement = document.getElementById('root');

// Create a root and render your app using the new API for React 18+
const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
