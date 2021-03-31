import React, { Component } from 'react'
import api from '../api'
import DateInput from 'react-input-date'
import moment from 'moment';
import BatchesList from './BatchesList'
import BatchInsert from './BatchInsert'
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