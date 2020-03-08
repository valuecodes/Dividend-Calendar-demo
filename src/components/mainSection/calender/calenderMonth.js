import React, { Component } from 'react'

export class CalenderMonth extends Component {

    onHover(state, id) {
        let res=document.getElementsByClassName('ticker.'+id);

        if (state === 'in') {
            for(let i=0;i<res.length;i++){
                res[i].style.backgroundColor =  'rgb(145, 189, 214)';
                res[i].style.color =   'rgb(255, 255, 255)';
            }
        } else {
            for(let i=0;i<res.length;i++){
                res[i].style.backgroundColor =  'rgb(223, 223, 223)';
                res[i].style.color =   'black';
            }
        }
    }
    render() {
        return (
            <div onMouseEnter={this.onHover.bind(this, 'in', this.props.ticker)} onMouseLeave={this.onHover.bind(this, 'out', this.props.ticker)} className={['calenderDivs', 'ticker.'+this.props.ticker, "main-class"].join(' ')}>
                <p className='cTick'>{this.props.ticker}</p>
                <p className='cSum'>{this.props.payment + ' €'}</p>
            </div>
        )
    }
}

export default CalenderMonth
