import React from 'react'
import CartStyles from './styles/CartStyles'
import CloseButton from './styles/CloseButton'
import Supreme from './styles/Supreme'
import SickButton from './styles/SickButton'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'

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

const Cart = () => {
  return (
    <Mutation mutation={TOGGLE_CART_MUTATION}>
      {(toggleCart) => (
        <Query query={LOCAL_STATE_QUERY}>
          {({ data }) => (
            <CartStyles open={data.cartOpen}>
              <header>
                <CloseButton
                  title='Close'
                  onClick={toggleCart}>
                  &times;
                </CloseButton>
                <Supreme>Your Cart</Supreme>
                <p>You have __ items in your cart</p>
              </header>
              <footer>
                <p>$10.10</p>
                <SickButton>Checkout</SickButton>
              </footer>
            </CartStyles>
          )}
        </Query>
      )}
    </Mutation>
  )
}

export default Cart
