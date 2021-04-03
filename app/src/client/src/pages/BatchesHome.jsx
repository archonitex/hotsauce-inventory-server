import React, { Component } from 'react'
import BatchesList from './BatchesList'
import BatchInsert from './BatchInsert'
import Login from './Login'
import { isAllowed, PERMISSIONS } from '../auth/auth';
import styled from 'styled-components'

const Title = styled.h2.attrs({
    className: 'h2',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

const Label = styled.label`
    margin: 5px;
`

class BatchesHome extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    componentDidMount = async () => {
        this.setState({ })
    }

    render() {
        if(!isAllowed(PERMISSIONS.CAN_EDIT_BATCHED)){
            return (
                <Wrapper>
                    <Title>Permission Denied.</Title>
                    <React.Fragment>
                        <Login />
                    </React.Fragment>
                </Wrapper>
            )
        }

        return (
            <Wrapper>
                <Title>New Batch</Title>
                <React.Fragment>
                    <BatchInsert />
                <Title>Batches</Title>
                    <BatchesList />
                </React.Fragment>
            </Wrapper>
        )
    }
}

export default BatchesHome