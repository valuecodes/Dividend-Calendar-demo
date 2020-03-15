import React, { Component } from 'react';
import { Buttons } from './buttons/Buttons';
import { Search } from './search/Search';
import { Stats } from './stats/Stats'

export class NavBar extends Component {
    render() {
        return (
            <div className='navBar'>
                <Buttons comparison={this.props.comparison} financialComparison={this.props.financialComparison} />
                <Search addTicker={this.props.addTicker} />
                <Stats monthStack={this.props.monthStack} />
            </div>
        )
    }
}

export default NavBar
