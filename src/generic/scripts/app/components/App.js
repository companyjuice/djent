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
            presetID: 'meshuggah',
            member: {},
            audience: [],
            speaker: {},
            //speaker: '',
            questions: [],
            currentQuestion: false,
            results: {}
        }

        this.connect = this.connect.bind(this)
        this.disconnect = this.disconnect.bind(this)
        this.updateState = this.updateState.bind(this)
        this.emit = this.emit.bind(this)
        this.joined = this.joined.bind(this)
        this.updateAudience = this.updateAudience.bind(this)
        this.ask = this.ask.bind(this)

        console.log("== [MM] App Component constructor loaded: this.state ==")
        console.log(this.state)
        console.log("== [MM] end ==")
    }

    componentWillMount() {
        this.socket = ioClient('http://localhost:3003')
        console.log(this.socket)
        this.socket.on('connect', this.connect)
        this.socket.on('disconnect', this.disconnect)
        this.socket.on('welcome', this.updateState)
        this.socket.on('joined', this.joined)
        this.socket.on('audience', this.updateAudience)
        this.socket.on('start', this.updateState)
        this.socket.on('ask', this.ask)
        this.socket.on('results', this.updateResults)
    }
    
    connect() {
        console.log("ioClient connected: " + this.socket.id)

        // check session storage for a previously joined member
        var member = (sessionStorage.member) ? JSON.parse(sessionStorage.member) : null
        if (member && member.type === 'audience') {
            // (re)join the member
            this.emit('join', member)
        } else if (member && member.type === 'speaker') {
            this.emit('start', { name: member.name, title: sessionStorage.title })
        }
        
        // update state
        this.setState({ status: 'connected' })
    }

    disconnect() {
        console.log("ioClient disconnected: " + this.socket.id)

        this.setState({ 
            status: 'disconnected',
            title: 'Room Disconnected',
            speaker: ''
        })
    }

    joined(member) {

        sessionStorage.member = JSON.stringify(member)

        this.setState({ member: member })
        console.log("== [MM] Member Joined ==")
        console.log(member)
        console.log(this.state)
        console.log("== [MM] end ==")
    }

    updateAudience(newAudience) {
        this.setState({ audience: newAudience })
    }

    start(room) {
        if (this.state.member.type === 'speaker') {
            sessionStorage.title = room.title
        }
        this.setState(room)
    }

    ask(question) {
        sessionStorage.answer = ''
        this.setState({ 
            currentQuestion: question,
            results: {a: 0, b: 0, c: 0, d: 0}
        })
    }

    updateResults(data){
        this.setState({ results: data })
    }

    //welcome(serverState) {
    updateState(serverState) {
        console.log("ioClient updateState: " + this.socket.id)

        //this.setState({ title: serverState.title })
        this.setState(serverState)
    }

    emit(eventName, payload) {
        this.socket.emit(eventName, payload)
    }

    render = () => (
        <Provider store={this.props.store}>
            <div style={{height: '100%'}}>
                
                {/* <h1 style={{textAlign: 'center'}}>HEY HEY HEY from React -- Live Polling</h1> */}
                {/* <Header title={this.state.title} status={this.state.status} /> */}
                <Header {...this.state} />
                
                {/* <Router key={Math.random()} history={this.props.history} routes={routes} /> */}
                <Router key={Math.random()}>
                    <Switch>
                        {/* <Route exact path="/" component={Main} /> */}
                        <Route exact path="/" render={(props) => (
                            <div>
                                {/* <Audience {...this.state} emit={this.emit} /> */}
                                
                                <Main {...this.state} />
                            </div>
                        )} />
                        <Redirect from='/**/share/:shareID' to='share/:shareID' />
                        <Route path="share/:shareID" id="share" />
                        <Route path="preset/:presetID" id="preset" />
                        <Route path="sequences" id="sequences" />
                        <Route path="instruments" id="instruments" />
                        {/* <Route status={404} path="*" /> */}

                        {/* <Route exact path="/" component={Audience} /> */}
                        <Route exact path="/audience" render={(props) => (
                            <div>
                                <Audience {...this.state} emit={this.emit} />
                                <Main {...this.state} />
                            </div>
                        )} />
                        {/* <Route name="speaker" path="/speaker" component={Speaker} {...this.state} /> */}
                        <Route exact path="/speaker" render={(props) => (
                            <div>
                                <Speaker {...this.state} emit={this.emit} />
                                <Main {...this.state} />
                            </div>
                        )} />
                        {/* <Route name="board" path="/board" handler={Board} {...this.state} /> */}
                        <Route exact path="/board" render={(props) => (
                            <div>
                                <Board {...this.state} emit={this.emit} />
                                <Main {...this.state} />
                            </div>
                        )} />
                    </Switch>
                </Router>

                {/* {process.env.NODE_ENV !== 'production' && <DevTools />} */}
                <DevTools />

            </div>
        </Provider>
    )
}

export default App