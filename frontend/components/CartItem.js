import React, { Component } from 'react'
import formatMoney from '../lib/formatMoney'
import styled from 'styled-components'
import RemoveFromCart from './RemoveFromCart'

const CartItemStyled = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightGrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;

  img {
    width: 100px;
    margin-right: 10px;
  }

  h3, p {
    margin: 0;
  }
`

const CartItem = ({ item }) => (
  <CartItemStyled>
    <img src={item.item.image} />
    <div>
      <h3>{item.item.name}</h3>
      <p>
        {formatMoney(item.item.price * item.quantity)}
        {' - '}
        <em>
          {item.quantity} &times; {formatMoney(item.item.price)} each
        </em>
      </p>
    </div>
    <RemoveFromCart id={item.id} />
  </CartItemStyled>
)

export default CartItem
