import React, { Component } from 'react'
//import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

class Join extends Component {

    constructor(props) {
        super(props)
        
        // this.state = {
        //     status: 'disconnected',
        //     title: '',
        //     shareID: '',
        //     presetID: 'meshuggah'
        // }

        // this.connect = this.connect.bind(this)
        // this.disconnect = this.disconnect.bind(this)
        // this.welcome = this.welcome.bind(this)
        this.join = this.join.bind(this)

        console.log("== [MM] Join Component constructor loaded: this.join ==")
        console.log(this.join)
        console.log("== [MM] end ==")
    }

    join() {
        var memberName = ReactDOM.findDOMNode(this.refs.name).value
        //alert("TODO: Join member " + memberName)
        this.props.emit('join', { name: memberName })
        console.log("== [MM] join: this.props ==")
        console.log(this.props)
        console.log("== [MM] end ==")
    }

    render() {
        return(
            <form action="javascript:void(0)" onSubmit={this.join}>

                <label>Full Name</label>
                <input ref="name"
                    className="form-control"
                    placeholder="enter your full name.."
                    required />
                <button className="btn btn-primary">Join</button>

            </form>
        )
    }
}

export default Join