import React, { Component } from 'react'
//import PropTypes from 'prop-types'

class Audience extends Component {

    render() {
        return(
            <h1>
                Audience : {this.props.title}
            </h1>
        )
    }
}

export default Audience