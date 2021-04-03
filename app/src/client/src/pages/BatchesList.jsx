import React, { Component } from 'react'
import api from '../api'
import moment from 'moment';

import ReactTable from "react-table-6"
import "react-table-6/react-table.css"

import styled from 'styled-components'

const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`

const BlockSpan = styled.span`
    display: block;
`

const Update = styled.div`
    float: left;
    color: #ef9b0f;
    cursor: pointer;
    padding-left: 10pt;
    font-size: 20px;
`

const Print = styled.div`
    float: left;
    color: #34a1eb;
    cursor: pointer;
    padding-left: 10pt;
    font-size: 20px;
`

const Delete = styled.div`
    float: left;
    color: #ff0000;
    cursor: pointer;
    padding-left: 10pt;
    font-size: 20px;
`

class PrintBatchLabel extends Component {
    printUser = event => {
        event.preventDefault()

        const copies = prompt('Print how many copies?', "1")
        if(copies != null){
            const copiesInt = parseInt(copies);

            var payload = { copies: copiesInt }
            
            api.printBatchById(this.props.id, payload).then(res => {
                console.log("Printing...")
            })
        }        
    }

    render() {
        return <Print onClick={this.printUser}>🖨️</Print>
    }
}

class UpdateBatch extends Component {
    updateUser = event => {
        event.preventDefault()

        window.location.href = `/batches/update/${this.props.id}`
    }

    render() {
        return <Update onClick={this.updateUser}>✏</Update>
    }
}

class DeleteBatch extends Component {
    deleteUser = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do tou want to delete the batch ${this.props.name} permanently?`,
            )
        ) {
            api.deleteBatchById(this.props.id)
            window.location.reload()
        }
    }

    render() {
        return <Delete onClick={this.deleteUser}>💣</Delete>
    }
}

class BatchesList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            batches: [],
            columns: [],
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getAllBatches().then(batches => {
            this.setState({
                batches: batches.data.data,
                isLoading: false,
            })
        })
    }

    render() {
        const { batches, isLoading } = this.state
        console.log('TCL: BatchesList -> render -> batches', batches)

        const columns = [
            {
                Header: 'Name',
                accessor: 'name',
                filterable: true,
                Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>
            },
            {
                Header: 'Date',
                accessor: 'date',
                filterable: true,
                Cell: ({ value }) => <div style={{ textAlign: "center" }}>{moment(value).format('ll')}</div>
            },
            {
                Header: 'Stock',
                accessor: 'stock',
                filterable: false,
                Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>
            },
            {
                Header: 'Status',
                accessor: 'status',
                filterable: false,
                Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value == true ? "✅" : "🛑"}</div>
            },
            {
                Header: 'Actions',
                accessor: '',
                Cell: function(props) {
                    return (
                        <div style={{ float: "right" }}>
                            <DeleteBatch id={props.original._id} />
                            <UpdateBatch id={props.original._id} />
                            <PrintBatchLabel id={props.original._id} />
                        </div>
                    )
                },
            },
        ]

        let showTable = true
        if (batches && !batches.length) {
            showTable = false
        }

        return (
            <Wrapper>
                {showTable && (
                    <ReactTable
                        data={batches}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        minRows={0}
                    />
                )}
            </Wrapper>
        )
    }
}

export default BatchesList