import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import {AuthProvider} from "./context/AuthContext.jsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <GoogleOAuthProvider clientId="239106531712-f1if0c9rnbcnimm30vbumnj7cr6abk0b.apps.googleusercontent.com">
                    <App/>
                </GoogleOAuthProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
