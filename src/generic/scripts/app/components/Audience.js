import React, { Component } from 'react'
//import PropTypes from 'prop-types'
import Display from './Display'
import Join from './Join'

class Audience extends Component {

    render() {
        return(
            <div>
                <h1>
                    Audience : {this.props.title}
                </h1>
                <Display if={this.props.status === 'connected'}>                
                    <Display if={this.props.member.name}>
                        <h2>Welcome {this.props.member.name}</h2>
                        <p>Questions will appear here.</p>
                    </Display>
                    <Display if={!this.props.member.name}>
                        <h2>Join the session</h2>
                        <Join emit={this.props.emit} />
                    </Display>
                </Display>
            </div>
        )
    }
}

export default Audience