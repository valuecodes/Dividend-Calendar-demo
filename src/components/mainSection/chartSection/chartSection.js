import React, { Component } from 'react';
import { PortFolioStats } from './portfolioStats';
import { MainChart } from './mainChart';
import { StatChart } from './statChart';
import { PortfolioRecap } from './portfolioRecap';
import { Spring } from 'react-spring/renderprops';
import { Transition, animated } from 'react-spring/renderprops';

export class ChartSection extends Component {

    constructor() {
        super();
        this.state = {
            monthSum: [],
            totalSum: 0,
            statType: 'calender',
            calender: 'block',
            stats: 'none',
            buttonClicked: false
        };
    }

    componentDidMount() {
        class month {
            constructor(id, name, sumOfDiv) {
                this.id = id;
                this.name = name;
                this.sumOfDiv = sumOfDiv;
            }
        }
        let monthsName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let months = [];
        for (var i = 0; i < 12; i++) {
            months[i] = new month(i, monthsName[i], 0);
        }
        this.setState({ monthSum: months })
    }

    static getDerivedStateFromProps(props, state) {

        if (Object(props.monthStackData).length !== 0) {
            console.log(props.monthStackData)
            let dividends = props.monthStackData;
            let monthSum = state.monthSum;
            let totalSum = 0;
            monthSum.forEach(month => month.sumOfDiv = 0);
            for (var i = 0; i < 12; i++) {
                for (var a = 0; a < dividends[i].data.length; a++) {
                    monthSum[i].sumOfDiv += dividends[i].data[a].sum
                    totalSum += dividends[i].data[a].sum;
                }
            }
            return {
                monthSum: monthSum,
                totalSum: totalSum
            }
        }
        return null;
    }

    changeStat(type) {
        let calender = 'none';
        let stats = 'none';

        if (type === 'calender') {
            calender = 'block';
        }
        if (type === 'stats') {
            stats = 'block';
        }
        this.setState({
            calender: calender,
            stats: stats,
            statType: type,
            buttonClicked: true,
        });
    }

    setColor(position) {
        if (this.state.statType === position) {
            return " rgba(76, 116, 175,0.7)";
        }
        return "";
    }

    render() {
        let state = this.state.calender;

        return (
            <div className='chartSection'>
                <div className='chartStatistics'>
                    <div id='selectStat'>
                        <button className='statsButton' onClick={this.changeStat.bind(this, 'calender')} style={{ background: this.setColor("calender") }}>Calender</button>
                        <button className='statsButton' onClick={this.changeStat.bind(this, 'stats')} style={{ background: this.setColor("stats") }}>Statistics</button>
                    </div>

                    <Spring
                        from={{
                            marginLeft: this.state.statType === 'calender' ? -200 : 0,
                            opacity: this.state.statType === 'calender' ? 1 : 1,
                        }}

                        to={{
                            marginLeft: this.state.statType === 'calender' ? 0 : 0,
                            opacity: this.state.statType === 'calender' ? 1 : 0,
                        }}
                        config={{
                            duration: 800,
                        }}
                        key={this.state.calender}
                    >
                        {props => (
                            <div id='calenderRecap' style={props}>
                                <PortFolioStats totalSum={this.state.totalSum} />
                            </div>
                        )}
                    </Spring>
                    <Spring
                        from={{
                            marginLeft: this.state.statType === 'stats' ? -200 : 0,
                            opacity: this.state.statType === 'stats' ? 1 : this.state.buttonClicked === false ? 0 : 1,

                        }}
                        to={{
                            marginLeft: this.state.statType === 'stats' ? 0 : 0,
                            opacity: this.state.statType === 'stats' ? 1 : 0,
                        }}
                        config={{ duration: 800 }}
                        key={this.state.statType}
                    >
                        {props => (
                            <div id='portfolioRecap' style={props}>
                                <PortfolioRecap portfolio={this.props.portfolio} totalSum={this.state.totalSum} />
                            </div>
                        )}
                    </Spring>
                </div>

                <div id='divChart' style={{ display: this.state.calender }}>
                    <MainChart createChart={this.state.monthSum} />
                </div>

                <div id='portfolioStats' style={{ display: this.state.stats }}>
                    <StatChart portfolio={this.props.portfolio} statType={this.state.statType} />
                </div>

            </div>
        )
    }
}

export default ChartSection
