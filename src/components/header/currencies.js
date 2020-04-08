import React, { Component } from 'react'
import { Spring } from 'react-spring/renderprops';
import currencyData from './currencyData'

export class Currencies extends Component {

    constructor() {
        super();
        this.state = {
            currencies: [{ updated: "", name: '', rate: '', data: { data: {} } }],
            EURUSD: '',
            EURSEK: '',
            EURCAD: '',
            selectedTimeFrame: "One Day",
            position: 1,
            lastPosition: 1,
            lastTimeFrame: "One Day",
            timeFrames: ["Real Time", "One Day", "One Week", "One Month", "Three Month", "Six Month", "One Year", "Two Year", "Five Year", "Ten Year"]
        };
    }

    componentDidMount() {
        let data = currencyData;
        this.setEDate(data);
    }

    setEDate(data) {
        this.setState({
            currencies: data,
            EURUSD: data[0].data.data['Real Time']['4. close'],
            EURSEK: data[1].data.data['Real Time']['4. close'],
            EURCAD: data[2].data.data['Real Time']['4. close'],
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(this.state.currencies) !== JSON.stringify(nextState.currencies) || this.state.position !== nextState.position) {
            return true;
        }
        return false;
    }

    getPercentage(rate, number) {
        let rates = this.state.currencies;
        if (rates[0].updated !== '' && rates[number].data.data[this.state.selectedTimeFrame] !== undefined) {
            let change = (((Number(rates[number].data.data[this.state.selectedTimeFrame]['4. close']) - this.state[rate]) / Number(rates[number].data.data[this.state.selectedTimeFrame]['4. close'])) * 100).toFixed(2);
            return change;
        }
    }

    getLastPercentage(rate, number) {
        let rates = this.state.currencies;
        if (rates[0].updated !== '' && rates[number].data.data[this.state.lastTimeFrame] !== undefined) {
            let change = (((Number(rates[number].data.data[this.state.lastTimeFrame]['4. close']) - this.state[rate]) / Number(rates[number].data.data[this.state.lastTimeFrame]['4. close'])) * 100).toFixed(2);
            return Number(change);
        }
        return 0;
    }

    scrollCurrency(direction) {
        let position = this.state.position;
        let lastTimeFrame = this.state.selectedTimeFrame;
        let newPos = position;
        if (direction === '-') {
            newPos = position === 0 ? position : position = position - 1;
        } else {
            newPos = position === 9 ? position : position = position + 1;
        }
        let timeFrame = this.state.timeFrames[newPos];
        this.setState({ selectedTimeFrame: timeFrame, lastTimeFrame: lastTimeFrame, position: newPos, lastPosition: position })
    }

    setCurrencyColor(value) {
        if (value) {
            if (value < 0) {
                return "rgba(175, 76, 76, 1)";
            }
            return "rgba(76, 175, 79, 1)";
        }
    }

    render() {
        return (
            <div id='currencyContainer'>
                {this.state.currencies.map((currency, index) =>
                    <div key={index} className='currencyBox'>
                        <p className='cHeader'>{currency.name}</p>
                        <Spring
                            from={{
                                // point: 0,
                                point: this.state.selectedTimeFrame === this.state.lastTimeFrame ? 0 : this.getLastPercentage(currency.name, index)
                            }}
                            to={{
                                point: this.getPercentage(currency.name, index),
                            }}
                            key={this.state.selectedTimeFrame}
                        >
                            {props => (
                                <p id={'id.' + currency.name} style={{ color: this.setCurrencyColor(props.point) }} className='currencyChange'>{props.point > 0 ? '+' : ''}{props.point.toFixed(2)}%</p>
                            )}
                        </Spring>
                        <p className='cHeader'>{currency.rate}</p>
                    </div>
                )}
                <div id='scrollCurrency'>
                    <div id='scrollCurrency'>
                        <div onClick={this.scrollCurrency.bind(this, '-')} className='scrollSectorBox sLeft'>
                            <p className='scrollSectorButton left'></p>
                        </div>
                        <Spring
                            from={{
                                transform: `perspective(600px) rotateX(${0}deg)`
                            }}
                            to={{
                                transform: `perspective(600px) rotateX(${364}deg)`
                            }}
                            // config={{ delay: 40 * index }}
                            key={this.state.selectedTimeFrame}
                        >
                            {props => (
                                <h4 style={props} id='selectedCurrencyTimeFrame'>{this.state.selectedTimeFrame}</h4>
                            )}
                        </Spring>
                        <div onClick={this.scrollCurrency.bind(this, '+')} className='scrollSectorBox sRight' >
                            <p className='scrollSectorButton right'></p>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default Currencies

