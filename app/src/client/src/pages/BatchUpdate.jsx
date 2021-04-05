import React, { Component } from 'react'
import DateInput from 'react-input-date'
import api from '../api'
import moment from 'moment';
import Collapsible from 'react-collapsible';
import { Grid, Row, Col } from "react-flexbox-grid";
import ReactSlider from 'react-slider'
import { isAllowed, PERMISSIONS } from '../auth/auth';
import Login from './Login'
import Toggle from 'react-toggle'
import axios from 'axios';

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
const InputTextArea = styled.textarea.attrs({
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
            notes: '',
            heat: 0,
            ingredients: [],
            stock: 0,
            price: 0,
            imageName: '',
            storeDescription: '',
            status: true,
        }
    }

    handleChangeInputName = async event => {
        const name = event.target.value
        this.setState({ name })
    }

    handleChangeInputNotes = async event => {
        const notes = event.target.value
        this.setState({ notes })
    }

    handleChangeInputStoreDescription = async event => {
        const storeDescription = event.target.value
        this.setState({ storeDescription })
    }

    handleChangeInputDate = (newDate) => {
        this.setState({ date: newDate })
    }

    handleChangeImage = async event => {
        const fileName = event.target.value.split(/(\\|\/)/g).pop()
        this.setState({
            imageName: fileName
        });

        if(fileName == ""){
            return
        }

        const data = new FormData() 
        data.append('file', event.target.files[0])

        let baseURL = '//volamtarpeppers.wrclan.ca' + (window.location.protocol === 'https:' ? ':3001' : ':3000') + '/api'
        axios.post(baseURL + "/upload", data, {})
    }

    handleChangePrice = async event => {
        this.setState({ price: event.target.value })
    }

    handleChangeStock = async event => {
        this.setState({ stock: event.target.value })
    }

    handleChangeIngredients = async ingredientsList => {
        this.setState({ ingredients: ingredientsList })
    }

    handleChangeHeat = async newHeat => {
        this.setState({ heat: newHeat })
    }

    handleChangeStatus = async event => {
        this.setState({ status: event.target.checked })
    }

    handleCancel = async () => {
        window.location = '/batches'
    }

    handleUpdateBatch = async () => {
        const { id, name, date, notes, ingredients, heat, stock, price, imageName, status, storeDescription} = this.state
        var payload = { name, date, notes, ingredients, heat, stock, price, imageName, status, storeDescription }        

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
            notes: batch.data.data.notes || '',
            heat: batch.data.data.heat || 0,
            ingredients: batch.data.data.ingredients || [],
            stock: batch.data.data.stock || 0,
            price: batch.data.data.price || 0,
            imageName: '',
            storeDescription: batch.data.data.storeDescription || '',
            status: batch.data.data.status
        })
    }

    render() {
        const { name, date, notes, heat, stock, price, status, storeDescription } = this.state
        
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
                <Title>Edit Batch</Title> 
                <Wrapper id="edit-batch-container">
                               
                    <Grid>
                        <h5>Batch Information</h5>
                        <Row>
                            <Col xs={4} >
                                <h6>Batch Name</h6>
                                <InputText
                                    type="text"
                                    placeholder="Batch name"
                                    value={name}
                                    onChange={this.handleChangeInputName}
                                    onKeyDown={this.handleKeyDown}
                                />
                            </Col>
                            <Col xs={2} >
                                <h6>Batch Date</h6>
                                <DateInput
                                    date={date}
                                    format='DDMMYYYY'
                                    separator='-'
                                    onChange={this.handleChangeInputDate}
                                />
                            </Col>
                            <Col xs={3} >
                                <h6>Heat (Mild &lt;-&gt; Spicy)</h6>
                                <ReactSlider
                                    className="horizontal-slider"
                                    onChange={this.handleChangeHeat}
                                    value={heat}
                                    renderTrack={Track}
                                    renderThumb={Thumb}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={10} >
                                <InputTextArea placeholder="Notes" value={notes} onChange={this.handleChangeInputNotes} />
                            </Col>
                        </Row>
                    </Grid>

                    <Grid>
                        <p></p>
                        <h5>Store Info</h5>
                        <Row>
                        <Col xs={1} >
                                <h6>Price</h6>
                                    <InputText
                                        type="number"
                                        value={price}
                                        min="0"
                                        onChange={this.handleChangePrice}
                                    />
                            </Col>
                            <Col xs={1} >
                            <h6>Stock</h6>
                                <InputText
                                    type="number"
                                    value={stock}
                                    min="0"
                                    onChange={this.handleChangeStock}
                                />
                            </Col>
                            <Col xs={2} >
                                <h6>Store Status</h6>
                                <Toggle
                                    checked={status}
                                    onChange={this.handleChangeStatus}
                                />
                            </Col>
                        </Row>     
                        <Row>
                            <Col xs={6} >
                                <h6>Image</h6>
                                <input type="file" onChange={this.handleChangeImage}/>
                            </Col>
                        </Row>  
                        <Row>
                            <Col xs={10} >
                                <h6>Description</h6>
                                <InputTextArea placeholder="Description" value={storeDescription} onChange={this.handleChangeInputStoreDescription} />
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
            </Wrapper>
        )
    }
}

export default BatchUpdate