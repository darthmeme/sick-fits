import React, { Component } from 'react'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { CURRENT_USER_QUERY } from './User'

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.red}
  }
`

export default class RemoveFromCart extends Component {
  update = (cache, payload) => {
    const data = cache.readQuery({ query: CURRENT_USER_QUERY })
    const id = payload.data.removeFromCart.id

    const newData = {
      me: {
        ...data.me,
        cart: data.me.cart.filter(item => item.id !== id)
      }
    }

    cache.writeQuery({ query: CURRENT_USER_QUERY, data: newData })
  }

  render () {
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
        optimisticResponse={
          {
            __typename: 'Mutation',
            removeFromCart: {
              __typename: 'CartItem',
              id: this.props.id
            }
          }
        }>
        {(removeFromCart, { error, loading }) => (
          <BigButton
            disabled={loading}
            onClick={() => {
              removeFromCart()
            }}>
            &times;
          </BigButton>
        )}
      </Mutation>
    )
  }
}
