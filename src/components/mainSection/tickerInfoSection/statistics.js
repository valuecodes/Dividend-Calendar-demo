import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

export class Statistics extends Component {
    constructor() {
        super();
        this.state = {
            selectedCompany: [],
            chartData: {},
            chartOptions: {},
            sector: "",
            country: "",
            eps: "",
            price: "",
            dividend: "",
            dividendYield: "",
            pe: "",
            epsGrowthRate: "",
            dividendGrowthRate: "",
            priceGrowth: "",
            growthTime: 5,
            cratio: "",
            margin: ""
        };
    }

    static getDerivedStateFromProps(props, state) {

        if (JSON.stringify(props.selectedCompany) !== '[]' && props.selectedCompany.yearData.length > 1) {
            let price = props.selectedCompany.weeklyData[0].close;
            let eps = 0;
            let len = props.selectedCompany.yearData.length - 1;
            for (var i = len; i > len - 4; i--) {
                eps += Number(props.selectedCompany.yearData[len].EPSEarningsPerShare)
            }
            let annualD = {};
            let annualE = {};
            let annualP = {};
            let growthTime = state.growthTime;
            let max = props.selectedCompany.yearData[0].year;
            let min = props.selectedCompany.yearData[props.selectedCompany.yearData.length - 1].year;
            if (growthTime > max - min) {
                growthTime = max - min
            }

            for (var a = max - growthTime; a <= max; a++) {
                let aYear = a;
                annualD[aYear] = 0;
                annualE[aYear] = 0;
                props.selectedCompany.dividendData.forEach(element => {
                    if (element.year === aYear) {
                        annualD[aYear] += element.dividend
                    }
                })
                props.selectedCompany.yearData.forEach(element => {
                    if (element.year === aYear && element.quarter === 4) {
                        annualE[aYear] += Number(element.EPSEarningsPerShare);
                    }
                })
                if (props.selectedCompany.weeklyData.length > 1) {
                    annualP[aYear] = props.selectedCompany.weeklyData[max - a].close;
                }
            }
            annualP[max] = price;
            let dividend = annualD[max];
            eps = Number(eps.toFixed(2));
            dividend = Number(dividend.toFixed(2));
            let epsGrowthRate = getGrowthRate(annualE);
            let dividendGrowthRate = getGrowthRate(annualD);
            let annualPriceGrowth = getGrowthRate(annualP);
            let dividendYield = Number(((dividend / price) * 100).toFixed(2));
            let pe = Number((price / eps).toFixed(2));
            let label = ['Earnings', 'Dividend', 'Stock price']
            let rates = [epsGrowthRate, dividendGrowthRate, annualPriceGrowth];
            let colors = [];
            rates.forEach(element => {
                if (element >= 0) {
                    colors.push('rgba(71, 189, 138, 0.5)');
                } else {
                    colors.push('rgba(245, 61, 29, 0.5)');
                }
            })

            let data = {
                labels: label,
                datasets: [
                    {
                        data: rates,
                        label: 'Price Chart',
                        backgroundColor: colors,
                        borderColor: [
                        ],
                        borderWidth: 1,
                    }
                ]
            }

            let options = {
                legend: {
                    display: false
                },
                maintainAspectRatio: true,
                responsive: true,
                width: "100px",
                height: "100px",
                plugins: {
                    datalabels: {
                        display: true,
                        color: 'black',
                        align: 'center',
                        font: {
                            size: 20,
                        },
                        formatter: (value, ctx) => {
                            return value + '%';
                        }
                    },
                },
                tooltips: {
                    cornerRadius: 10,
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return Number(tooltipItem.value).toFixed(1) + '%';
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function (value) {
                                return value + "%";
                            },
                            fontSize: 15
                        }
                    }],
                }
            }
            return {
                chartData: data,
                chartOptions: options,
                selectedCompany: props.selectedCompany,
                sector: props.selectedCompany.tickerData.sector,
                country: props.selectedCompany.tickerData.country,
                eps: eps,
                price: price,
                dividend: dividend,
                dividendYield: dividendYield,
                pe: pe,
                epsGrowthRate: epsGrowthRate,
                dividendGrowthRate: dividendGrowthRate,
                priceGrowth: annualPriceGrowth,
                growthTime: growthTime,
                cratio: props.selectedCompany.yearData[1].CurrentRatio,
                margin: props.selectedCompany.yearData[1].NetProfitMargin
            }
        }
        return false
    }

    changeGrowthYears(value) {
        this.setState({ growthTime: value });
    }

    myColor(value) {
        if (this.state.growthTime === value) {
            return "rgba(156, 156, 56, 0.753)";
        }
        return "";
    }

    render() {
        return (
            <div id='statistics'>
                <div id='stats'>
                    <p>Current ratio</p>
                    <h3>{this.state.cratio}</h3>
                    <p>Profit Margin</p>
                    <h3>{this.state.margin}%</h3>
                    <p>Share Price</p>
                    <h3>{this.state.price}</h3>
                    <p>Eps</p>
                    <h3>{this.state.eps}</h3>
                    <p>Dividend</p>
                    <h3>{this.state.dividend}</h3>
                    <p>Dividend Yield</p>
                    <h3>{this.state.dividendYield}%</h3>
                    <p>PE</p>
                    <h3>{this.state.pe}</h3>
                    <p>PEG</p>
                    <h3>{this.state.pe}</h3>
                </div>
                <div id="growthGraphs">
                    <div id='growthOptions'>
                        <h2 id='growthRate'>Annual growth</h2>
                        <button style={{ background: this.myColor(3) }} onClick={this.changeGrowthYears.bind(this, 3)}>3 Year</button>
                        <button style={{ background: this.myColor(5) }} onClick={this.changeGrowthYears.bind(this, 5)}>5 Year</button>
                        <button style={{ background: this.myColor(10) }} onClick={this.changeGrowthYears.bind(this, 10)}>10 Year</button>
                    </div>
                    <Bar
                        data={this.state.chartData}
                        width={50}
                        height={39}
                        options={this.state.chartOptions}
                        datasetKeyProvider={this.datasetKeyProvider}
                    />
                </div>
            </div>
        )
    }
}

export default Statistics

let getGrowthRate = (annual) => {
    let endYear = Object.keys(annual)[Object.keys(annual).length - 1]
    let startYear = Object.keys(annual)[0];
    let years = Object.keys(annual).length
    let growthRate = (((Math.pow(annual[endYear] / annual[startYear], 1 / years)) - 1) * 100);
    return Number(growthRate.toFixed(1));
}