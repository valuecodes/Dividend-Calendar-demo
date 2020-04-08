import React, { Component } from 'react'
import { HorizontalBar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
export class PortfolioResults extends Component {

    constructor() {
        super();
        this.state = {
            chartData: {},
            chartOptions: {},
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data.length) {
            let data = props.data.map(elem => elem.labels);
            let result = [];
            for (var i = 0; i < data.length; i++) {
                for (var a = 0; a < data[i].length; a++) {
                    if (result[data[i][a]]) {
                        result[data[i][a]] += a;
                    } else {
                        result[data[i][a]] = a;
                    }
                }
            }
            let res = [];
            Object.keys(result).forEach(elem => res.push([elem, result[elem]]));
            res = res.sort((a, b) => b[1] - a[1]);


            let cData = res.map(elem => elem[1]);
            let cLabels = res.map(elem => elem[0]);

            let chartData = {
                labels: cLabels,
                datasets: [
                    {
                        type: 'horizontalBar',
                        label: 'Total points',
                        data: cData,
                        backgroundColor: 'rgba(62, 121, 189,0.6)',
                        borderColor: 'rgba(62, 121, 189,1)',
                        borderWidth: 2,
                    }
                ]
            }

            let chartOptions = {
                plugins: {
                    datalabels: {
                        color: '#ffffff',
                        // formatter: function (value) {
                        //     return Math.round(value) + '%';
                        // },
                        font: {
                            weight: 'bold',
                            size: 14,
                        }
                    }
                },
                scales: {
                    yAxes: [{

                        ticks: {
                            beginAtZero: true,
                            fontSize: 20,
                        }
                    }],
                    xAxes: [{

                        ticks: {
                            beginAtZero: true,

                            // fontSize: 20,
                        }
                    }]
                },
                legend: {
                    labels: {
                        fontSize: 30
                    }
                }
            }

            return {
                chartData: chartData,
                chartOptions: chartOptions
            }

        }
        return {
            // chartData: [],
            // chartOptions: []
        }
    }

    render() {
        return (
            <div>
                <HorizontalBar
                    data={this.state.chartData}
                    width={100}
                    height={90}
                    options={this.state.chartOptions}
                />
            </div>
        )
    }
}

export default PortfolioResults
