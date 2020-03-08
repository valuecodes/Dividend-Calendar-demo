import React, { Component } from 'react'
import Ticker from './Ticker'

export class MainTickerList extends Component {
    render() {
        let current = [];
        if (this.props.tickers !== undefined) {
            current = this.props.tickers;
        }
        return (
            <div id='tickerList'>
                {current.map(ticker =>
                    <Ticker key={ticker} ticker={ticker} addShares={this.props.addShares} deleteTicker={this.props.deleteTicker} showTickerInfo={this.props.showTickerInfo} />
                )}
            </div>
        )
    }
}

export default MainTickerList
