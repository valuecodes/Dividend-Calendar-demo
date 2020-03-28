import React, { Component } from 'react'
import { Spring } from 'react-spring/renderprops';

export class PortfolioRecap extends Component {

    constructor() {
        super();
        this.state = {
            totalPortfolio: 0,
            totalDividends: 0,
            divPercent: 0,
            payOutRatio: 0,
            peRatio: 0,
            earningsYield: 0,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (Object(props.portfolio).length !== 0) {
            let tickers = props.portfolio.tickers;
            let divData = props.portfolio.dividendData;
            let total = 0;
            let earnings = 0;
            for (var i = 0; i < tickers.length; i++) {
                total += divData[tickers[i][0]].weeklyData[0].close * tickers[i][1];
                earnings += divData[tickers[i][0]].yearData[0].EPSEarningsPerShare * tickers[i][1];
            }
            return {
                totalPortfolio: total,
                totalDividends: props.totalSum,
                divPercent: (props.totalSum / total) * 100,
                payOutRatio: (props.totalSum / earnings) * 100,
                peRatio: total / earnings,
                earningsYield: (earnings / total) * 100,
            }
        }
        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(this.props.portfolio) === JSON.stringify(nextProps.portfolio)) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        return (
            <div className='statContainer'>
                <h1>Portfolio</h1>
                <Spring
                    from={{ totalPortfolio: 0, totalDividends: 0, divPercent: 0, payOutRatio: 0, peRatio: 0, earningsYield: 0 }}
                    to={{ totalPortfolio: this.state.totalPortfolio, totalDividends: this.state.totalDividends, divPercent: this.state.divPercent, payOutRatio: this.state.payOutRatio, peRatio: this.state.peRatio, earningsYield: this.state.earningsYield }}
                    config={{ duration: 2000 }}
                    key={this.props.stats}
                >
                    {props => (
                        <div style={props}>
                            <h3>Total Portfolio</h3>
                            {props.totalPortfolio.toFixed(2) + ' €'}
                            <h3>Total Dividends</h3>
                            {props.totalDividends.toFixed(2) + ' €'}
                            <h3>Dividend %</h3>
                            {props.divPercent.toFixed(2) + '%'}
                            <h3>Payout Ratio</h3>
                            {props.payOutRatio.toFixed(2) + '%'}
                            <h3>PE ratio</h3>
                            {props.peRatio.toFixed(2)}
                            {/* <h3>Earnings Yield</h3>
                            {props.earningsYield.toFixed(2) + '%'} */}
                        </div>
                    )}
                </Spring>
            </div>
        )
    }
}

export default PortfolioRecap
