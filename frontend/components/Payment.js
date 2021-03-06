import React, { Component } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import NProgress from 'nprogress'
import Router from 'next/router'
import calcTotalPrice from '../lib/calcTotalPrice'
import Error from './ErrorMessage'
import User, { CURRENT_USER_QUERY } from './User'

const totalItems = cart => cart.reduce((tally, item) => tally + item.quantity, 0)

export const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`

export default class Payment extends Component {
  onToken = async (res, createOrder) => {
    NProgress.start()
    const order = await createOrder({
      variables: {
        token: res.id
      }
    })

    Router.push({ pathname: '/order', query: { id: order.data.createOrder.id } })
  }

  render () {
    return (
      <User>
        {({ data: { me }, loading }) => {
          if (loading) return <div>Loading...</div>
          
          return (
            <Mutation
              mutation={CREATE_ORDER_MUTATION}
              refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
              {createOrder => (
                <StripeCheckout
                  amount={calcTotalPrice(me.cart)}
                  name='Sick Fits'
                  description={`Order of ${totalItems(me.cart)} item${totalItems(me.cart) > 1 ? 's' : ''}`}
                  image={me.cart.length && me.cart[0].item.image}
                  stripeKey='pk_test_y9tJBaZ8bIqzVSrBnnmLp9Ye'
                  currency='USD'
                  email={me.email}
                  token={res => this.onToken(res, createOrder)}>
                  {this.props.children}
                </StripeCheckout>
              )}
            </Mutation>
          )
        }}
      </User>
    )
  }
}
