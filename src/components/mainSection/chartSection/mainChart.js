import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';
// import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

export class MainChart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chartData: {},
            chartOptions: {}
        }
    }

    static getDerivedStateFromProps(props, state) {
        let months = [];
        let sum = [];
        let average = [];
        let total = 0;
        props.createChart.forEach((month, index) => {
            months[index] = month.name;
            sum[index] = Math.round(month.sumOfDiv * 100) / 100;
            total += month.sumOfDiv;
        });
        for (var i = 0; i < 12; i++) {
            average[i] = Math.round(((total / 12) * 100) / 100);
        }
        let data = {
            labels: months,
            datasets: [
                {
                    label: 'Monthly Dividends',
                    data: sum,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.4)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 9, 32, 1)',
                    ],
                    borderWidth: 2,
                },
                {
                    label: 'Average',
                    data: average,
                    backgroundColor: 'rgba(255, 99, 132, 0.0)',
                    borderColor: 'rgba(55, 99, 132, 1)',
                    borderWidth: 3,
                }
            ]
        }
        let options = {
            legend: {
                position: 'right',
                align: 'start',
                labels: {
                    fontSize: 22
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutCubic'
            },
            layout: {
                padding: {
                    top: 42,
                }
            },
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    display: true,
                    color: 'black',
                    align: 'end',
                    font: {
                        size: 25,
                    },
                    formatter: (value, ctx) => {
                        if (ctx.dataset.label === 'Monthly Dividends') {
                            return value;
                        } else {
                            return ' ';
                        }


                    }
                },
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 20
                    }
                }],
                yAxes: [{
                    ticks: {
                        margin: 100,
                        fontSize: 20,
                        maxTicksLimit: 8,
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            return value + '€';
                        },
                    }
                }]
            },

        }
        return {
            chartData: data,
            chartOptions: options
        }
        // return null;
    }
    render() {
        return (
            <div className='mainChart' id='mainChart'>
                <div className='chart'>
                    <Line
                        data={this.state.chartData}
                        width={300}
                        height={400}
                        options={this.state.chartOptions}
                    />
                </div>
            </div>
        )
    }

}

export default MainChart
