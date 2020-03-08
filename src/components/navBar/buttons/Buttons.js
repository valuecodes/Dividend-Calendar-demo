import React, { Component } from 'react';

export class Buttons extends Component {
    render() {
        return (
            <div className='buttons'>
                <button onClick={this.props.comparison} className='navButton'>Comparison</button>
                <button className='navButton'>All stocks</button>
                <button className='navButton'>Other Portfolios</button>
                <button id='navButtonLast' className='navButton'>Save</button>
            </div>
        )
    }
}

export default Buttons
