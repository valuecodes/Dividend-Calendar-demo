import React, { Component } from 'react'
import CalenderMonth from './calenderMonth'


export class MonthStack extends Component {

    render() {
        return (
            <div id={'month.' + this.props.id} className='monthColumn'>
                <div className='monthPadding'></div>
                <div className='dividends' style={{ display: this.props.style }}>
                    {this.props.monthStack.data.map((dividend, index) =>
                        <CalenderMonth data={dividend} month={dividend.month} key={dividend.id} ticker={dividend.ticker} payment={dividend.sum} monthView={this.props.monthView} index={this.props.monthStack.data.length - index} startDay={(this.props.startDay.length-dividend.day)} />
                    )}
                </div>
            </div>
        )
    }
}

export default MonthStack
