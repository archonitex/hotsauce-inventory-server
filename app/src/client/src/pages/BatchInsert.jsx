import React, { Component } from 'react'
import DateInput from 'react-input-date'
import api from '../api'
import Moment from 'react-moment'
import moment from 'moment';
import Collapsible from 'react-collapsible';
import IngreditTable from '../components/IngredientTable'
import { Grid, Row, Col } from "react-flexbox-grid";

import styled from 'styled-components'
import IngredientTable from '../components/IngredientTable';

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

class BatchInsert extends Component {
    constructor(props) {
        super(props)

        var now = new Date();
		var dateString = moment(now).format('DD-MM-YYYY');

        this.state = {
            name: '',
            date: dateString,
            ingredients: []
        }
    }

    handleChangeInputName = async event => {
        const name = event.target.value
        this.setState({ name })
    }

    handleChangeInputDate = (newDate) => {
        this.setState({ date: newDate })
    }

    handleChangeIngredients = async ingredientsList => {
        this.setState({ ingredients: ingredientsList })
    }

    handleIncludeBatch = async () => {
        const { name, date, ingredients } = this.state
        const payload = { name, date, ingredients }

        await api.insertBatch(payload).then(res => {
            window.location.reload();
        })

        //Insert Ingredients. API filters what is needed or not
        var ingredientsPayload = ingredients.map(ingredient => ({ name: ingredient.ingredient }));

        ingredientsPayload.forEach(async function(iPayload) {
            api.insertIngredient(iPayload).then(res => {})
        })
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleIncludeBatch()
        }
    }

    render() {
        const { name, date } = this.state
        return (
            <Wrapper>
                <Collapsible trigger="Create Batch">
                    <Grid>
                        <h6>Batch Information</h6>
                        <Row>
                        <Col xs={5} >
                            <InputText
                                type="text"
                                placeholder="Batch name"
                                value={name}
                                onChange={this.handleChangeInputName}
                                onKeyDown={this.handleKeyDown}
                            />
                        </Col>
                        <Col xs={5} xsOffset={2} >
                            <DateInput
                                date={date}
                                format='DDMMYYYY'
                                separator='-'
                                onChange={this.handleChangeInputDate}
                            />
                        </Col>
                        </Row>
                    </Grid>

                    <Grid>
                        <p></p>
                        <h6>Ingredients</h6>
                        <IngredientTable onIngredientsChange={this.handleChangeIngredients}/>
                    </Grid>
                    
                    <Grid>
                        <Row>
                        <Col xs={2} >
                            <Button onClick={this.handleIncludeBatch} >Create</Button>
                        </Col>
                        </Row>
                    </Grid>

                </Collapsible>

                <p></p>

            </Wrapper>
        )
    }
}

export default BatchInsert