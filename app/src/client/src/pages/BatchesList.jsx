import React, { Component } from 'react'
import api from '../api'

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
`

const Print = styled.div`
    float: left;
    color: #34a1eb;
    cursor: pointer;
    padding-left: 10pt;
`

const Delete = styled.div`
    float: left;
    color: #ff0000;
    cursor: pointer;
    padding-left: 10pt;
`

class PrintBatchLabel extends Component {
    printUser = event => {
        event.preventDefault()

        api.printBatchById(this.props.id).then(res => {
            window.dymoPrint(res.data.data)
        })
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

        const dymoSDKScript = document.createElement("script");
        dymoSDKScript.src = "http://labelwriter.com/software/dls/sdk/js/DYMO.Label.Framework.latest.js";
        dymoSDKScript.async = true;
        document.body.appendChild(dymoSDKScript);

        const dymoPrintScript = document.createElement("script");
        dymoPrintScript.innerHTML = 'function dymoPrint(r){try{var e=dymo.label.framework.openLabelXml(r),t=dymo.label.framework.getPrinters();if(0==t.length)throw"No DYMO printers are installed. Install DYMO printers.";for(var a="",l=0;l<t.length;++l){var n=t[l];if("LabelWriterPrinter"==n.printerType){a=n.name;break}}if(""==a)throw"No LabelWriter printers found. Install LabelWriter printer";alert("PRINTING TO "+a),e.print(a)}catch(r){alert(r.message||r)}}'
        document.body.appendChild(dymoPrintScript);
    }

    render() {
        const { batches, isLoading } = this.state
        console.log('TCL: BatchesList -> render -> batches', batches)

        const columns = [
            {
                Header: 'Name',
                accessor: 'name',
                filterable: true,
            },
            {
                Header: 'Date',
                accessor: 'date',
                filterable: true,
            },
            {
                Header: 'Actions',
                accessor: '',
                Cell: function(props) {
                    return (
                        <BlockSpan>
                            <DeleteBatch id={props.original._id} />
                            <UpdateBatch id={props.original._id} />
                            <PrintBatchLabel id={props.original._id} />
                        </BlockSpan>
                    )
                },
            },
        ]

        let showTable = true
        if (!batches.length) {
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