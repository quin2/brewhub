import * as React from 'react';
import './header.css';
import CartView from '../cartview/cartview'

export default class Sidebar extends React.Component{
  render() {
    return (
      <div id="header">
        <span id="logotype">BeersToBars</span>
        <CartView cart={this.props.cart}/>
      </div>
    )
  };
}
