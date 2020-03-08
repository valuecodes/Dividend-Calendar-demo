import React, { Component } from 'react';
import { PriceChart } from './priceChart';
import { EarningsChart } from './earningsChart';
import { Statistics } from './statistics';
import { ForecastChart } from './forecastChart';

export class TickerInfoPage extends Component {
    constructor() {
        super();
        this.state = {
            selectedCompany: [],
            header: []
        };
    }
    static getDerivedStateFromProps(props, state) {

        if (props.selectedCompany !== null) {
            return {
                selectedCompany: props.selectedCompany,
                header: props.selectedCompany.tickerData
            }
        }
        return false
    }
    datasetKeyProvider() { return Math.random(); }
    render() {
        return (
            <div>
                <div id="tickerInfoBar">
                    <button id="closeInfoPage" onClick={this.props.closeInfoPage}>Back</button>
                    <h1 id="infoName">{this.state.header.name}({this.state.header.ticker})</h1>
                    <div id='generalInfo'>
                        <div className='infoPart'>
                            <h3>Sector</h3>
                            <h1>{this.state.header.sector}</h1>
                        </div>
                        <div className='infoPart'>
                            <h3>Industry</h3>
                            <h1>{this.state.header.industry}</h1>
                        </div>
                        <div className='infoPart'>
                            <h3>Sub industry</h3>
                            <h1>{this.state.header.subindustry}</h1>
                        </div>
                        <div className='infoPart'>
                            <h3>Founded</h3>
                            <h1>{this.state.header.founded}</h1>
                        </div>
                        <div className='infoPart'>
                            <h3>Employees</h3>
                            <h1>{this.state.header.employees}</h1>
                        </div>
                        <div className='infoPart'>
                            <h3>Country</h3>
                            <h1>{this.state.header.country}</h1>
                        </div>
                        <div className='infoPart'>
                            <h3>Description</h3>
                            <p>{this.state.header.description}</p>
                        </div>
                    </div>
                </div>
                <div id='tickerInfoCharts'>
                    <PriceChart selectedCompany={this.state.selectedCompany} />
                    <Statistics selectedCompany={this.state.selectedCompany} />
                    <EarningsChart selectedCompany={this.state.selectedCompany} />
                    <ForecastChart selectedCompany={this.state.selectedCompany} />
                </div>

            </div>
        )
    }
}

export default TickerInfoPage
