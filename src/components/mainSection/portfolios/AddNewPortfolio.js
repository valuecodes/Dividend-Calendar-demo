import React, { Component } from 'react'

export class AddNewPortfolio extends Component {
    constructor() {
        super();
        this.state = {
          currentPortfolio:[]
        };
    }
    value(e){
        this.setState({currentPortfolio:e.target.value})
    }
    render() {
        let visibilityState=this.props.visibility;
        return (
            <div onChange={this.visibilityState} className='addNewPortfolio' style={{visibility: visibilityState}} >
                <input onChange={this.value.bind(this)} name='newPortfolio' className='newPortfolio'/>
                <button onClick={this.props.savePortfolioName.bind(this,this.state.currentPortfolio)} className='saveNewPortfolio'>Save</button>
                <button onClick={this.props.cancel}>Cancel</button>
            </div>
        )
    }
}

export default AddNewPortfolio
