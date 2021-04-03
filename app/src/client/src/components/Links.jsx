import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { authenticate, deauthenticate, isAuthenticated } from "../auth/auth";

const Collapse = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

const List = styled.div.attrs({
    className: 'navbar-nav mr-auto',
})``

const Item = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

function handleLogout(e) {
    e.preventDefault();
    deauthenticate()
    window.location = '/'
}

class Links extends Component {
    render() {
        let authItem;
        if(isAuthenticated()) { 
            authItem = <Link onClick={handleLogout} className="nav-link">Logout</Link> 
        }

        return (
            <React.Fragment>
                <Link to="/" className="navbar-brand">
                    Volamtar Peppers
                </Link>
                <Collapse>
                    <List>
                        <Item>
                            <Link to="/" className="nav-link">
                                Order
                            </Link>
                            <Link to="/batches" className="nav-link">
                                Manage
                            </Link>
                            {authItem}
                        </Item>
                    </List>
                </Collapse>
            </React.Fragment>
        )
    }
}

export default Links