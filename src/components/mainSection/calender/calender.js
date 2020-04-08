import React, { Component } from 'react';
import { Month } from './month';
import { MonthStack } from './monthStack'
import { Spring } from 'react-spring/renderprops';

export class Calender extends Component {
    constructor() {
        super();
        this.state = {
            monthsName: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            monthId: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            monthStack: [],
            sum: [],
            current: [],
            display: ['', '', '', '', '', '', '', '', '', '', '', ''],
            monthView: false,
            weekDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            monthStart: [3, 6, 0, 3, 5, 1, 3, 6, 2, 4, 0, 2],
            monthDays: [[]],
            startDays: [[]],
            endBlocks: [[]],
            currentMonth: 0
        };
    }

    componentDidMount() {
        let mdays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let start = [3, 6, 0, 3, 5, 1, 3, 6, 2, 4, 0, 2];
        let end = [9, 8, 11, 10, 7, 12, 9, 6, 11, 8, 12, 10];
        let days = [];
        let sdays = [];
        let eblock = [];

        for (var i = 0; i < 12; i++) {
            let m = [];
            for (var a = 1; a <= mdays[i]; a++) {
                m.push(a);
            }
            days.push(m);

            let st = [];
            for (var x = 0; x <= start[i]; x++) {
                st.push(x);
            }
            sdays.push(st);

            let eb = [];
            for (var q = 0; q <= end[i]; q++) {
                eb.push(q);
            }
            eblock.push(eb);
        }
        this.setState({ monthDays: days, startDays: sdays, endBlocks: eblock });
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

    monthView(month) {
        let state = this.state.display
        for (let i = 0; i < 12; i++) {
            if (i === month || month === 13) {
                state[i] = '';
            } else {
                state[i] = 'none';
            }
        }
        this.setState({
            display: state,
            currentMonth: month === 13 ? 1 : month,
            monthView: month === 13 ? false : month
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.currentportfolio !== this.props.currentportfolio || nextState.currentMonth !== this.state.currentMonth) {

            return true;
        }
        return false;
    }
    render() {
        return (
            <div className='calender' onChange={this.test}>
                <div className='monthStack'>
                    {this.state.monthId.map((monthId, index) =>
                        <MonthStack style={this.state.display[index]} key={monthId} id={monthId} monthStack={this.state.monthStack[monthId]} monthView={this.state.monthView} startDay={this.state.startDays[this.state.currentMonth]} currentMonth={this.state.currentMonth} />
                    )}
                </div>
                <Spring
                    from={{
                        opacity: this.state.monthView === false ? 1 : 0,
                        display: this.state.monthView === false ? 'none' : ''
                    }}
                    to={{
                        opacity: this.state.monthView === false ? 0 : 1,
                        display: this.state.monthView === false ? 'none' : ''
                    }}
                    config={{ duration: this.state.monthView === false ? 0 : 0 }}
                    key={this.state.monthView}
                >
                    {props => (
                        <div style={props} id='monthCalender'>
                            {this.state.weekDays.map((day, index) =>
                                <div key={index} className='dayBlock'>
                                    <p className='dayBlockHeader'>{day}</p>
                                </div>
                            )}

                            {this.state.monthDays[this.state.currentMonth].map((day, index) =>
                                <div key={index} className='dayBlock'>
                                    <p id={'day.' + day}>{day}</p>
                                </div>
                            )}
                        </div>
                    )}

                </Spring>
                <div className='monthNames'>
                    {this.state.monthsName.map((month, index) =>
                        <Month key={index} index={index} month={month} monthView={this.monthView.bind(this)} />
                    )}
                </div>
            </ div >
        )
    }
}

export default Calender
