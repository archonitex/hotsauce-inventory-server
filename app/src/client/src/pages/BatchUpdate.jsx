import React, { Component } from 'react'
import api from '../api'
import DateInput from 'react-input-date'
import moment from 'moment';

import styled from 'styled-components'

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 5px;
`

const CancelButton = styled.a.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 5px;
`

class BatchUpdate extends Component {
    constructor(props) {
        super(props)

        var now = new Date();
		var dateString = moment(now).format('DD-MM-YYYY');

        this.state = {
            id: this.props.match.params.id,
            name: '',
            date: dateString,
        }
    }

    handleChangeInputName = async event => {
        const name = event.target.value
        this.setState({ name })
    }

    handleChangeInputDate = (newDate) => {
        this.setState({ date: newDate })
    }

    handleUpdateBatch = async () => {
        const { id, name, date } = this.state
        const payload = { name, date }

        var now = new Date();
		var dateString = moment(now).format('DD-MM-YYYY');

        await api.updateBatchById(id, payload).then(res => {
            window.alert(`Batch updated successfully`)
            this.setState({
                name: '',
                date: dateString,
            })
        })
    }

    componentDidMount = async () => {
        const { id } = this.state
        const batch = await api.getBatchById(id)

        var now = new Date();
		var dateString = moment(now).format('DD-MM-YYYY');
		
		debugger;
        this.setState({
            name: batch.data.data.name,
            date: dateString,
        })
    }

    render() {
        const { name, date } = this.state
        debugger;
        return (
            <Wrapper>
                <Title>Update Batch</Title>

                <Label>Name: </Label>
                <InputText
                    type="text"
                    value={name}
                    onChange={this.handleChangeInputName}
                />

                <Label>Date: </Label>
                <DateInput
			        date={date}
			        format='DDMMYYYY'
			        separator='-'
			        onChange={this.handleChangeInputDate}
			    />

                <Button onClick={this.handleUpdateBatch}>Update Batch</Button>
                <CancelButton href={'/batches/list'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default BatchUpdate