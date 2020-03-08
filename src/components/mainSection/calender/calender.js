import React, { Component } from 'react';
import { Month } from './month';
import { MonthStack } from './monthStack'

export class Calender extends Component {
    constructor() {
        super();
        this.state = {
            monthsName: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            monthId: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            monthStack: [],
            sum: [],
            current: []
        };
    }

    static getDerivedStateFromProps(props, state) {
        class monthtTrack {
            constructor(id) {
                this.id = id;
                this.data = [];
            }
        }
        let monthStackData = {};
        for (var a = 0; a < 12; a++) {
            monthStackData[a] = new monthtTrack(a);
        }
        if (Object.keys(state.monthStack).length === 0) {
            return {
                monthStack: monthStackData
            }
        }
        let tickers = props.currentportfolio.tickers;
        if (Object.keys(props.currentportfolio).length !== 0) {
            let data = props.currentportfolio.dividendData;
            for (var i = 0; i < tickers.length; i++) {
                let type;
                switch (data[tickers[i][0]].tickerData.dividendType) {
                    case 'Quarterly':
                        type = 4;
                        break
                    case 'Annual':
                        type = 1;
                        break
                    case 'SemiAnnual':
                        type = 2;
                        break
                    case 'Monthly':
                        type = 12;
                        break;
                    default:
                        type = Number(data[tickers[i][0]].tickerData.dividendType)
                }
                for (var j = 0; j <= type - 1; j++) {
                    let d = data[tickers[i][0]].dividendData[j].month - 1;
                    let sum = Math.round(([tickers[i][1]] * data[tickers[i][0]].dividendData[j].dividend) * 100) / 100
                    data[tickers[i][0]].dividendData[j].sum = sum;
                    data[tickers[i][0]].dividendData[j].ticker = tickers[i][0];
                    monthStackData[d].data.push(data[tickers[i][0]].dividendData[j]);
                }
            }
            data = monthStackData;
            props.setMonthStack(data);
            return {
                currentportfolio: props.currentportfolio,
                monthStack: data,
                current: tickers
            };
        }
        return null;
    }

    render() {
        return (
            <div className='calender' onChange={this.test}>
                <div className='monthStack'>
                    {this.state.monthId.map(monthId =>
                        <MonthStack key={monthId} id={monthId} monthStack={this.state.monthStack[monthId]} />
                    )}
                </div>
                <div className='monthNames'>
                    {this.state.monthsName.map(month =>
                        <Month key={month} month={month} />
                    )}
                </div>
            </ div >
        )
    }
}

export default Calender
