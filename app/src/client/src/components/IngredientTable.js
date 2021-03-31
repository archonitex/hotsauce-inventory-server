import React, { Component } from 'react'
import IngredientAutoSuggest from '../components/IngredientAutoSuggest'
import { Grid, Row, Col } from "react-flexbox-grid";
import uuid from 'react-uuid'

import styled from 'styled-components'

const Button = styled.button.attrs({
    className: `btn btn-secondary`,
})`
    margin: 15px 15px 15px 5px;
`
const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

class IngredientTable extends React.Component {
    constructor() {
      super();
  
      this.state = {
        rows: [ { id: uuid(), ingredient: '', quantity: '' } ]
      };
    }

    addRow = async event => {
        var rows = this.state.rows
        rows.push( { id: uuid(), ingredient: '', quantity: '' } )
        this.setState({rows: rows})
    }

    removeRow = async event => {
        const elementId = event.target.parentNode.id

        var rows = this.state.rows
        var matchingRow = rows.find( ({ id }) => id === elementId );
        const index = rows.indexOf(matchingRow);
        if (index > -1) {
            rows.splice(index, 1);
        }
      
        this.setState({rows: rows})
        this.props.onIngredientsChange(rows)
    }

    handleChangeIngredientName = async (event, newIngredient) => {
        const elementId = event.target.type == "text" ? event.target.parentNode.parentNode.id : event.target.parentNode.parentNode.parentNode.parentNode.parentNode.id

        var rows = this.state.rows
        var matchingRow = rows.find( ({ id }) => id === elementId );
        if(matchingRow){
            matchingRow.ingredient = newIngredient
        }
        this.setState({rows: rows})
        this.props.onIngredientsChange(rows)
    }

    handleChangeIngredientQuantity = async (event) => {
        const elementId = event.target.parentNode.id

        var rows = this.state.rows
        var matchingRow = rows.find( ({ id }) => id === elementId );
        matchingRow.quantity = event.target.value

        this.setState({rows: rows})
        this.props.onIngredientsChange(rows)
    }
  
    render() {
        return (
            <div>
                <table>
                    {this.state.rows.map((r) => (
                      <tr>
                          <td id={r.id}> <IngredientAutoSuggest onIngredientChange={this.handleChangeIngredientName}/> </td>
                          <td id={r.id}> <InputText id={r.id} type="text" value={r.quantity} placeholder='Qty' onChange={this.handleChangeIngredientQuantity}></InputText> </td>
                          <td id={r.id}> <button class="btn" onClick={this.removeRow}>💣</button> </td>
                      </tr>
                    ))}
                </table>
                <Button onClick={this.addRow} >Add Ingredient</Button>
            </div>
        );
    }
  }

export default IngredientTable