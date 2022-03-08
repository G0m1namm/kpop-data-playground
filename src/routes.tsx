import React from 'react';
import { Route } from '@tanstack/react-location';
import { Home, Profile, Search, ArtistHome } from './pages';

export const routes: Route[] = [
    { path: "/", element: <Home /> },
    { 
        path: "list", 
        element: <Search/>,
        children: [
            { path: "/", element: <ArtistHome /> },
            { path: ":artistId", element: <Profile /> }
        ]
    }
]
