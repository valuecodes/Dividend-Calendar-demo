import React, { Component } from 'react'

export class Month extends Component {
    render() {
        return (
            <div className='months'>
                {this.props.month}
            </div>
        )
    }
}

export default Month