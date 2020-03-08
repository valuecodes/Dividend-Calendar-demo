import React, { Component } from 'react'

export class PortFolioStats extends Component {

    render() {
        let yearly = Number((this.props.totalSum).toFixed(2)) + ' €';
        let monthly = Number((this.props.totalSum / 12).toFixed(2)) + ' €';
        let daily = Number((this.props.totalSum / 365).toFixed(2)) + ' €';
        let hourly = Number(((this.props.totalSum / 365) / 24).toFixed(2)) + ' €/h';
        let hourlyWork = Number(((this.props.totalSum / 52) / 37.5).toFixed(2)) + ' €/h';
        return (
            <div id='dividendStats'>
                <h1>Dividends</h1>
                <h3>Yearly</h3>
                <p>{yearly}</p>
                <h3>Monthly</h3>
                <p>{monthly}</p>
                <h3>Daily</h3>
                <p>{daily}</p>
                <h3>Hourly</h3>
                <p>{hourly}</p>
                <h3>Work hours(37,5h/w)</h3>
                <p>{hourlyWork}</p>
            </div>
        )
    }
}

export default PortFolioStats
