import React, { Component } from 'react'

export class Ticker extends Component {
    render() {
        return (
            <div className='tickerInfo' >
                <button className="infoName" onClick={this.props.showTickerInfo.bind(this, this.props.ticker[0])}>{this.props.ticker[0]} </button>
                <p className="count">{this.props.ticker[1]}</p>
                <input type='number' onBlur={this.props.addShares.bind(this, this.props.ticker[0])} className='shareCount' />
                <button className='delTicker' onClick={this.props.deleteTicker.bind(this, this.props.ticker[0])}>X</button>
            </div>
        )
    }
}

export default Ticker
