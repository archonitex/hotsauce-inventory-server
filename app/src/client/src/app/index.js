import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { BatchesHome, BatchesList, BatchesView, BatchInsert, BatchUpdate, ProductView } from '../pages'

import logo from '../logo-white.png'

import Footer from 'rc-footer';
import 'rc-footer/assets/index.css';

import '../style/index.js'
import 'bootstrap/dist/css/bootstrap.min.css'

import ReactGA from 'react-ga';

const TRACKING_ID = "G-WHT97CVBB9"; // YOUR_OWN_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/" exact component={BatchesView} />
                <Route path="/batches" exact component={BatchesHome} />
                <Route path="/batches/list" exact component={BatchesList} />
                <Route path="/batches/create" exact component={BatchInsert} />
                <Route
                    path="/batches/update/:id"
                    exact
                    component={BatchUpdate}
                />
                <Route 
                    path="/product/:id"
                    exact
                    component={ProductView}
                />
            </Switch>
            <Footer
                backgroundColor='#343a40'
                columns={[
                {
                    icon: (
                    <img src={logo} />
                    ),
                    title: 'Volamtar Peppers',
                    url: 'https://volamtarpeppers.wrclan.ca',
                    description: 'Hot Sauce & Pepper Products',
                    openExternal: true,
                },
                ]}
                bottom="Made with 🌶️❤️ by Francis Carriere"
            />
        </Router>
    )
}

export default App