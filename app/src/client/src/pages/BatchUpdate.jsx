import React, { Component } from 'react'
import DateInput from 'react-input-date'
import api from '../api'
import moment from 'moment';
import Collapsible from 'react-collapsible';
import { Grid, Row, Col } from "react-flexbox-grid";
import ReactSlider from 'react-slider'

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

const StyledSlider = styled(ReactSlider)`
    width: 100%;
    height: 25px;
`;

const StyledThumb = styled.div`
    height: 25px;
    line-height: 25px;
    width: 25px;
    text-align: center;
    background-color: #000;
    color: #fff;
    border-radius: 50%;
    cursor: grab;
`;

const Thumb = (props, state) => <StyledThumb {...props}>{state.valueNow}</StyledThumb>;

const StyledTrack = styled.div`
    top: 0;
    bottom: 0;
    background: ${props => props.index === 2 ? '#ff0000' : props.index === 1 ? '#ff0000' : '#ff0000'};
    border-radius: 999px;
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

class BatchUpdate extends Component {
    constructor(props) {
        super(props)

        var now = new Date();
		var dateString = moment(now).format('DD-MM-YYYY');

        this.state = {
            id: this.props.match.params.id,
            name: '',
            date: dateString,
            heat: 0,
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
        debugger;
        this.setState({ ingredients: ingredientsList })
    }

    handleChangeHeat = async newHeat => {
        this.setState({ heat: newHeat })
    }

    handleCancel = async () => {
        window.location = '/batches'
    }

    handleUpdateBatch = async () => {
        const { id, name, date, ingredients, heat} = this.state
        var payload = { name, date, ingredients, heat }        

        await api.updateBatchById(id, payload).then(res => {
            window.location = '/batches'
        })
    }

    componentDidMount = async () => {
        const { id } = this.state
        const batch = await api.getBatchById(id)

        var now = new Date();
		var dateString = moment(now).format('DD-MM-YYYY');

        this.setState({
            name: batch.data.data.name,
            date: dateString,
            heat: batch.data.data.heat,
            ingredients: batch.data.data.ingredients,
        })
    }

    render() {
        const { name, date, heat } = this.state
        return (
            <Wrapper>  
                <Title>Edit Batch</Title>              
                <Grid>
                    <h5>Batch Information</h5>
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
                    <p></p>
                    <h5>Heat (Mild &lt;-&gt; Spicy)</h5>
                    <Row>                            
                        <Col xs={5} >
                            <ReactSlider
                                className="horizontal-slider"
                                value={heat}
                                onChange={this.handleChangeHeat}
                                renderTrack={Track}
                                renderThumb={Thumb}
                            />
                        </Col>
                    </Row>
                </Grid>

                <Grid>
                    <p></p>
                    <h5>Ingredients</h5>
                    <Row>
                        <Col xs={6} >
                            <IngredientTable onIngredientsChange={this.handleChangeIngredients} batchId={this.state.id} />
                        </Col>
                    </Row>                        
                </Grid>
                
                <Grid>
                    <Row>
                    <Col xs={2} >
                        <Button onClick={this.handleUpdateBatch} >Save</Button>
                    </Col>
                    <Col xs={2}>
                        <CancelButton onClick={this.handleCancel} >Cancel</CancelButton>
                    </Col>
                    </Row>
                </Grid>
                <p></p>
            </Wrapper>
        )
    }
}

export default BatchUpdate