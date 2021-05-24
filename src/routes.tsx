import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import home from './pages/home';
import CreatePoint from './pages/CreatePoint';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={home} path="/" exact/>
            <Route component={CreatePoint} path="/create-point" />
        </BrowserRouter>
    );
} 

export default Routes;