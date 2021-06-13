import React, { Component } from 'react'
import Collapsible from 'react-collapsible';
import { Grid, Row, Col } from "react-flexbox-grid";
import api from '../api';

import styled from 'styled-components'

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
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
    width: 100%;
`

class ContactForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            email: '',
            message: '',
        }
    }

    handleChangeName = async event => {
        this.setState({ name: event.target.value })
    }

    handleChangeEmail = async event => {
        this.setState({ email: event.target.value })
    }

    handleChangeMessage = async event => {
        this.setState({ message: event.target.value })
    }

    handleSendRequest = async event => {
        const { name, email, message } = this.state

        let data = {
            value1: (name || "Anonymous") + ' (' + (email || '') +')',
            value2: message
        }

        await api.contactRequest(data).then(res => {
            alert('Message sent!')
            window.location.reload();
        })

        event.target.disabled = true
        event.target.innerHTML = "Sending..."
    }

    render() {
        return (
            <Wrapper>
                <Collapsible trigger="Send Us A Request ⇕">
                    <Grid>
                        <p>Send us a message about what you'd like to get your hands on! We'll reach out to you super quickly!</p>
                        <Row>
                            <Col xs={6} lg={3} >
                                <h6>Name</h6>
                                    <InputText
                                        type="text"
                                        placeholder=""
                                        onChange={this.handleChangeName}
                                    />
                            </Col>
                            <Col xs={6} lg={5} >
                            <h6>Email or Phone</h6>
                                <InputText
                                    type="text"
                                    placeholder=""
                                    onChange={this.handleChangeEmail}
                                />
                            </Col>
                        </Row> 
                        <Row>
                            <Col xs={12} lg={8}>
                                <InputTextArea
                                    maxLength="100"
                                    placeholder="Your message (100 character limit)"
                                    onChange={this.handleChangeMessage}
                                />    
                            </Col>    
                        </Row>                       
                    </Grid>

                    <Grid>
                        <Row>
                            <Col xs={12} lg={2} >
                                <Button onClick={this.handleSendRequest} >Send</Button>
                            </Col>
                        </Row>
                    </Grid>

                </Collapsible>

                <p></p>

            </Wrapper>
        )
    }
}

export default ContactForm