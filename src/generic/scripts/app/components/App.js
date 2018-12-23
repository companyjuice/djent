import React, { Component } from 'react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import routes from 'routes'
// [MM] chat
import DevTools from 'containers/DevTools'
// [MM] polling
import ioClient from 'socket.io-client'

class App extends Component {

    constructor() {
        super()
        this.connect = this.connect.bind(this)
    }

    componentWillMount() {
        this.socket = ioClient('http://localhost:3003')
        console.log(this.socket)
        this.socket.on('connect', this.connect)
    }

    connect() {
        console.log("ioClient connected: " + this.socket.id)
        //alert("ioClient connected: " + this.socket.id)
    }

    render = () => (
        <Provider store={this.props.store}>
            <div style={{height: '100%'}}>
                
                <h1 style={{textAlign: 'center'}}>HEY HEY HEY from React -- Live Polling</h1>
                
                <Router key={Math.random()} history={this.props.history} routes={routes} />
                {/* {process.env.NODE_ENV !== 'production' && <DevTools />} */}
                <DevTools />

            </div>
        </Provider>
    )
}

export default App