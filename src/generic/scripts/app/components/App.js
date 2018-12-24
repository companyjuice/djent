import React, { Component } from 'react'
//import { Router } from 'react-router'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'
//import routes from 'routes'
import Main from '../containers/Main'
// [MM] chat
import DevTools from '../containers/DevTools'
// [MM] polling
import ioClient from 'socket.io-client'
import Header from './Header'
// [MM] polling
import Audience from './Audience'
import Speaker from './Speaker'
import Board from './Board'

class App extends Component {

    constructor() {
        super()
        
        this.state = {
            status: 'disconnected',
            title: '',
            shareID: '',
            presetID: 'meshuggah'
        }

        this.connect = this.connect.bind(this)
        this.disconnect = this.disconnect.bind(this)
        this.welcome = this.welcome.bind(this)

        console.log("===")
        //console.log(routes)
        console.log("===")
    }

    componentWillMount() {
        this.socket = ioClient('http://localhost:3003')
        console.log(this.socket)
        this.socket.on('connect', this.connect)
        this.socket.on('disconnect', this.disconnect)
        this.socket.on('welcome', this.welcome)
    }

    connect() {
        console.log("ioClient connected: " + this.socket.id)
        //alert("ioClient connected: " + this.socket.id)
        this.setState({ status: 'connected' })
    }

    disconnect() {
        console.log("ioClient disconnected: " + this.socket.id)
        //alert("ioClient disconnect: " + this.socket.id)
        this.setState({ status: 'disconnected' })
    }

    welcome(serverState) {
        //console.log("ioClient disconnected: " + this.socket.id)
        //alert("ioClient disconnect: " + this.socket.id)
        this.setState({ title: serverState.title })
    }

    render = () => (
        <Provider store={this.props.store}>
            <div style={{height: '100%'}}>
                
                {/* <h1 style={{textAlign: 'center'}}>HEY HEY HEY from React -- Live Polling</h1> */}
                <Header title={this.state.title} status={this.state.status} />
                
                {/* <Router key={Math.random()} history={this.props.history} routes={routes} /> */}
                <Router key={Math.random()}>
                    <Switch>
                        {/* <Route exact path="/" component={Main} /> */}
                        <Route exact path="/" render={(props) => (
                            <div>
                                <Audience {...this.state} />
                                <Main {...this.state} />
                            </div>
                        )} />
                        <Redirect from='/**/share/:shareID' to='share/:shareID' />
                        <Route path="share/:shareID" id="share" />
                        <Route path="preset/:presetID" id="preset" />
                        <Route path="sequences" id="sequences" />
                        <Route path="instruments" id="instruments" />
                        <Route status={404} path="*" />

                        <Route exact path="/" component={Audience} />
                        <Route name="speaker" path="/speaker" component={Speaker} {...this.state} />
                        <Route name="board" path="/board" handler={Board} {...this.state} />
                    </Switch>
                </Router>

                {/* {process.env.NODE_ENV !== 'production' && <DevTools />} */}
                <DevTools />

            </div>
        </Provider>
    )
}

export default App