import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { BatchesHome, BatchesList, BatchInsert, BatchUpdate } from '../pages'

import '../style/index.js'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/batches" exact component={BatchesHome} />
                <Route path="/batches/list" exact component={BatchesList} />
                <Route path="/batches/create" exact component={BatchInsert} />
                <Route
                    path="/batches/update/:id"
                    exact
                    component={BatchUpdate}
                />
            </Switch>
        </Router>
    )
}

export default App