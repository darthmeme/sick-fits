import React from 'react'
import CartStyles from './styles/CartStyles'
import CloseButton from './styles/CloseButton'
import Supreme from './styles/Supreme'
import SickButton from './styles/SickButton'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import User from './User'
import CartItem from './CartItem'
import calcTotalPrice from '../lib/calcTotalPrice'
import formatMoney from '../lib/formatMoney'
import { adopt } from 'react-adopt'
import Payment from './Payment'

export const LOCAL_STATE_QUERY = gql`
  query LOCAL_STATE_QUERY {
    cartOpen @client
  }
`

export const TOGGLE_CART_MUTATION = gql`
  mutation TOGGLE_CART_MUTATION {
    toggleCart @client
  }
`

const Composed = adopt({
  user: <User />,
  toggleCart: <Mutation mutation={TOGGLE_CART_MUTATION} />,
  localState:  <Query query={LOCAL_STATE_QUERY} />
})

const Cart = () => {
  return (
    <Composed>
      {({ user, toggleCart, localState }) => {
        const me = user.data.me

        if (!me) return null

        return (
          <CartStyles open={localState.data.cartOpen}>
            <header>
              <CloseButton
                title='Close'
                onClick={toggleCart}>
                &times;
              </CloseButton>
              <Supreme>{me.name}'s Cart</Supreme>
              <p>You have {me.cart.length} item{me.cart.length === 1 ? '' : 's'} in your cart</p>
            </header>
            <ul>
              {me.cart && me.cart.map(item => (
                <CartItem item={item} key={item.id} />
              ))}
            </ul>
            <footer>
              <p>{formatMoney(calcTotalPrice(me.cart))}</p>
              {me.cart.length && (
                <Payment>
                  <SickButton>Checkout</SickButton>
                </Payment>
              )}
            </footer>
          </CartStyles>
        )
      }}
    </Composed>
  )
}

export default Cart
