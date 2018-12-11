import React, { Component } from 'react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import routes from 'routes'
// [MM]
import DevTools from 'containers/DevTools';

class App extends Component {
    render = () => (
        <Provider store={this.props.store}>
            <div style={{height: '100%'}}>
                <Router key={Math.random()} history={this.props.history} routes={routes} />
                {/* {process.env.NODE_ENV !== 'production' && <DevTools />} */}
                <DevTools />
            </div>
        </Provider>
    )
}

export default App