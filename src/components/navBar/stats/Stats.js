import React, { Component } from 'react'

export class Stats extends Component {

    constructor() {
        super();
        this.state = {
            dividends: 0,
            nextDiv: null,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            nextDivTicker: '',
            nextDivSum: 0,
        };
    }

    tick() {
        if (this.state.dividends !== 0) {
            let d = new Date();
            let nextDiv = this.state.nextDiv;
            let dDate = new Date(d.getFullYear(), nextDiv.month - 1, nextDiv.day);
            let days = (dDate - d) / (1000 * 60 * 60 * 24);
            let hours = (days - Math.floor(days)) * 24;
            let mins = (hours - Math.floor(hours)) * 60;
            let secs = (mins - Math.floor(mins)) * 60;

            this.setState(state => ({
                days: Math.floor(days),
                hours: Math.floor(hours),
                minutes: Math.floor(mins),
                seconds: Math.floor(secs),
                nextDivTicker: nextDiv.ticker,
                nextDivSum: nextDiv.sum
            }));
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    static getDerivedStateFromProps(props, state) {
        console.log(props);
        if (JSON.stringify(props.monthStack) !== '[]') {
            let dividends = props.monthStack;
            let totalSum = 0;

            let d = new Date();
            let year = d.getFullYear();
            let month = d.getMonth() + 1;
            let day = d.getDate();
            let match = null;

            for (var i = 0; i < 12; i++) {
                for (var a = 0; a < dividends[i].data.length; a++) {
                    let dMonth = dividends[i].data[a].month;
                    let dDay = dividends[i].data[a].day;
                    if (dMonth >= month && match === null) {
                        match = dividends[i].data.filter(element =>
                            element.day >= day || dMonth !== month
                        )
                        if(match.length!==0){
                            match = match.reduce((prev, curr) => prev.day < curr.day ? prev : curr)
                        }else{
                            match=null;
                        }
                    }
                    totalSum += dividends[i].data[a].sum;
                }
            }
            return {
                dividends: totalSum,
                nextDiv: match
            }

        }
        return null;
    }

    onHover(state, id) {
        let res = document.getElementsByClassName('ticker.' + id);

        if (state === 'in') {
            for (let i = 0; i < res.length; i++) {
                res[i].style.backgroundColor = 'rgb(145, 189, 214)';
                res[i].style.color = 'rgb(255, 255, 255)';
            }
        } else {
            for (let i = 0; i < res.length; i++) {
                res[i].style.backgroundColor = 'rgb(223, 223, 223)';
                res[i].style.color = 'black';
            }
        }
    }

    render() {
        return (
            <div id='infoBarStats'>
                <h4 style={counter}>Next dividend in:  </h4>
                <p className='statNumber'>{this.state.days}</p>
                <p className='statHead'>Days</p>
                <p className='statNumber'>{this.state.hours}</p>
                <p className='statHead'>Hours</p>
                <p className='statNumber'>{this.state.minutes}</p>
                <p className='statHead'>Mins</p>
                <p className='statNumber'>{this.state.seconds}</p>
                <p className='statHead'>Secs</p>
                <div onMouseEnter={this.onHover.bind(this, 'in', this.state.nextDivTicker)} onMouseLeave={this.onHover.bind(this, 'out', this.state.nextDivTicker)} className={['ticker.' + this.state.nextDivTicker, "divsHeader"].join(' ')}>
                    <p className='cTick'>{this.state.nextDivTicker}</p>
                    <p className='cSum'>{this.state.nextDivSum + ' €'}</p>
                </div>
            </div>
        )
    }
}

export default Stats;

const counter = {
    paddingTop: 6,
    margin: 0,
}