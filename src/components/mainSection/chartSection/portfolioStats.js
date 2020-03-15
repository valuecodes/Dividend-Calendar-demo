import React, { Component } from 'react'
import { Spring } from 'react-spring/renderprops';
import { Transition, animated } from 'react-spring/renderprops';

export class PortFolioStats extends Component {
    constructor() {
        super();
        this.state = {
            yearly: 0,
            monthly: 0,
            daily: 0,
            hourly: 0,
            hourlyWork: 0
        };
    }

    static getDerivedStateFromProps(props, state) {
        return {
            yearly: Number((props.totalSum).toFixed(2)),
            monthly: Number((props.totalSum / 12).toFixed(2)),
            daily: Number((props.totalSum / 365).toFixed(2)),
            hourly: Number(((props.totalSum / 365) / 24).toFixed(2)),
            hourlyWork: Number(((props.totalSum / 52) / 37.5).toFixed(2)),
        }
    }

    render() {
        return (
            <div className='statContainer'>
                <h1>Dividends</h1>
                <Spring
                    from={{ yearly: 0, monthly: 0, daily: 0, hourly: 0, hourlyWork: 0 }}
                    to={{ yearly: this.state.yearly, monthly: this.state.monthly, daily: this.state.daily, hourly: this.state.hourly, hourlyWork: this.state.hourlyWork }}
                    config={{ duration: 2000 }}
                >
                    {props => (
                        <div style={props}>
                            <h3>Yearly</h3>
                            {props.yearly.toFixed(2) + ' €'}
                            <h3>Monthly</h3>
                            {props.monthly.toFixed(2) + ' €'}
                            <h3>Daily</h3>
                            {props.daily.toFixed(2) + ' €'}
                            <h3>Hourly</h3>
                            {props.hourly.toFixed(2) + ' €'}
                            <h3>Work hours(37,5h/w)</h3>
                            {props.hourlyWork.toFixed(2) + ' €'}
                        </div>
                    )}
                </Spring>
            </div>
        )
    }
}

export default PortFolioStats

const counter = {
    paddingTop: 6,
    margin: 0,
}