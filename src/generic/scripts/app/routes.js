import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import Main from './containers/Main'

// [MM] chat
import SignIn from './components/SignIn';
//import ChatContainer from './containers/ChatContainer';
import SignUp from './components/SignUp';
import WelcomePage from './components/WelcomePage';
import App from './containers/App';
import {checkAuth} from './actions/authActions';
const requireAuth = (nextState, replace) => {
    if(!checkAuth()) {
        return replace(null, '/signin')
    }
}

// <Route path="/" component={App/Main}>
//     <IndexRoute component={WelcomePage} />
//     <Route path="/welcome" component={WelcomePage} />
//     <Route path="/signin" component={SignIn} />
//     <Route path="/signup" component={SignUp} />
//     <Route path="/chat" component={ChatContainer}>
//     </Route>
// </Route>

export default (
    <Route path="/" component={Main}>
        <Route path="/welcome" component={WelcomePage} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />

        <Redirect from='/**/share/:shareID' to='share/:shareID' />
        <Route path="share/:shareID" id="share" />
        <Route path="preset/:presetID" id="preset" />
        <Route path="sequences" id="sequences" />
        <Route path="instruments" id="instruments" />
        <Route status={404} path="*" />
    </Route>
)
