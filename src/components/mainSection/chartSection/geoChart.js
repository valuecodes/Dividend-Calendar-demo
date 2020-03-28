import React, { Component } from 'react';
// import Chart from "react-google-charts";

export class GeoChart extends Component {
    constructor() {
        super();
        this.state = {
            countryStake: [],
            countryLabel: [],
        };
    }

    static getDerivedStateFromProps(props, state) {

        if (JSON.stringify(props.portfolio) !== '[]') {
            console.log(props.portfolio)
            let tickers = props.portfolio.tickers;
            let divData = props.portfolio.dividendData;
            let stake = [];
            let stakeLabel = [];
            let stakeColor = [];

            let tickerStake = [];
            let tickerLabel = [];

            let sectorStake = [];
            let sectorLabel = [];

            let countryStake = [['Country', 'Allocation']];
            let countryLabel = [];


            let total = 0;

            for (var i = 0; i < tickers.length; i++) {
                stake.push(divData[tickers[i][0]].weeklyData[0].close * tickers[i][1])
                stakeLabel.push(tickers[i][0]);
                // stakeColor.push(randomColor());
                total += divData[tickers[i][0]].weeklyData[0].close * tickers[i][1];
            }

            let sectors = {};

            let countries = {};

            for (var a = 0; a < stake.length; a++) {
                if (countries[divData[stakeLabel[a]].tickerData.countryName]) {
                    countries[divData[stakeLabel[a]].tickerData.countryName] += stake[a];
                } else {
                    countries[divData[stakeLabel[a]].tickerData.countryName] = stake[a];
                }
            }
            for (let key in countries) {
                countryStake.push([key, countries[key]])
                // countryLabel.push(key);
            }
            console.log(countryStake)
            return {
                countryStake: countryStake
            }
        }
        return null;
    }


    render() {
        return (
            <div >
                {/* <Chart
                    chartType="GeoChart"
                    options={{ legend: 'none' }}
                    width="600px"
                    height="400px"
                    data={this.state.countryStake}
                /> */}
            </div>
        )
    }
}

export default GeoChart
