import React, { Component } from 'react'
import Currencies from './currencies'
import Sectors from './sectors'

export class Header extends Component {
    render() {
        return (
            <div id='headerContainer'>
                <Currencies />
                <h1 id='mainHeader'>Dividend calender</h1>
                <Sectors />
            </div>
        )
    }
}

export default Header
