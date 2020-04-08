import React, { Component } from 'react'

export class Month extends Component {
    constructor() {
        super();
        this.state = {
            hover: ''
        };
    }

    changeColor(month) {
        console.log(month);
        this.setState({ hover: month });
    }

    render() {
        return (
            <div className='monthBlock'>
                <p
                    // onMouseEnter={() => this.props.monthView(this.props.index)} 
                    // onMouseLeave={() => this.props.monthView(13)} 
                    className='months'>{this.props.month}</p>
            </div>
        )
    }
}

export default Month