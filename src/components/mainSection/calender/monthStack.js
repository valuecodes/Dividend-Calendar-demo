import React, { Component } from 'react'
import CalenderMonth from './calenderMonth'

export class MonthStack extends Component {
    render() {
        return (
            <div id={'month.' + this.props.id} className='monthColumn'>
                <div className='monthPadding'></div>
                <div className='dividends'>
                    {this.props.monthStack.data.map(dividend =>
                        <CalenderMonth key={dividend.id} ticker={dividend.ticker} payment={dividend.sum} />
                    )}
                </div>
            </div>
        )
    }
}

export default MonthStack
