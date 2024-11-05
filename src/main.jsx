import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';

import Routes from './routes';
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Auth0Provider  
            domain={import.meta.env.VITE_AUTH0_DOMAIN}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
            authorizationParams={{ redirect_uri: window.location.origin }} 
        >
            <Routes />
        </Auth0Provider>
    </StrictMode>
);
