import React, { Component, Fragment } from "react";
import Button from "react-bootstrap/Button";
import ContactForm from "../components/ContactForm";
import api from '../api'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import styled from 'styled-components'

const Wrapper = styled.div`
    padding: 40px;
`

const HeatPeppers = styled.div`
  display:block
`;

const OnHeatPeppers = styled.div`
  float:left;
  opacity:1;
`;

const OffHeatPeppers = styled.div`
  opacity: 0.15;
`;

const BackButtonWrapper = styled.div`
    padding: 20px;
    margin-top: -40px;
`;

const BackButton = styled.a`
    padding: 15px;
    border: 1px solid #ccc!important;
    color: black;
`;

const HeaderImage = styled.img`
    max-height: 500px;
    display: block;
    margin-left: auto;
    margin-right: auto;
`;

const Container = styled.div`
    display: flex; 
`;

const LeftContainerItem = styled.div`
    width: 40%;
    margin-left: 20px;
    margin-right: 20px;
`;

const RightContainerItem = styled.div`
    flex-grow: 1;
`;

const IngredientList = styled.ul`
    list-style-type: circle;
`;

const IngredientItem = styled.li`

`;

class ProductView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product: null,
            isLoading: true,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getBatchById(this.props.match.params.id).then(batch => {
            this.setState({
                product: batch.data.data,
                isLoading: false,
            })
        })
    }

    render() {
        const { product, isLoading } = this.state
        if(isLoading){
            return (<Wrapper></Wrapper>)
        }

        //Heat
        var heatString = ''
        let numberOfPeppers = Math.round(parseFloat(product.heat/20))
        for (var i=0; i < numberOfPeppers; i++) {
            heatString += "🌶️"
        }

        var offHeatString = '&nbsp;'
        for (var i=numberOfPeppers; i<5; i++){
            offHeatString += "🌶️"
        }

        return (
            <Wrapper>
                <BackButtonWrapper>
                    <BackButton href="/" title="Back To Products">❮ Back To Products</BackButton>
                </BackButtonWrapper>
                <Container>
                    <LeftContainerItem>
                        <HeaderImage src={product.imageUrl} />
                    </LeftContainerItem>
                    <RightContainerItem>
                        <h2>{product.name}</h2>
                        <HeatPeppers>
                            <OnHeatPeppers >{heatString}</OnHeatPeppers>
                            <OffHeatPeppers dangerouslySetInnerHTML={{ __html: offHeatString }} />
                        </HeatPeppers>
                        <span className="tag is-primary">${product.price || 'TBD'}</span>
                        <Tabs defaultActiveKey="product">
                            <Tab eventKey="product" title="Product" dangerouslySetInnerHTML={{__html:product.storeDescription}}>
                                
                            </Tab>
                            <Tab eventKey="ingredients" title="Ingredients">
                                <IngredientList>
                                    {product.ingredients ? (
                                        product.ingredients.map((ingredient, index) => (
                                            <IngredientItem>
                                                {ingredient.ingredient}
                                            </IngredientItem>
                                        ))
                                    ) : (<li>No ingredients found.</li>)}

                                </IngredientList>
                            </Tab>
                        </Tabs>
                    </RightContainerItem>
                </Container>
                

                
                
                
            </Wrapper>
        )
    }
}

export default ProductView