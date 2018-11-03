import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { format } from 'date-fns'
import Head from 'next/head'
import gql from 'graphql-tag'
import formatMoney from '../lib/formatMoney'
import Error from '../components/ErrorMessage'
import OrderStyles from './styles/OrderStyles'

export const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        name
        description
        price
        image
        quantity
      }
    }
  }
`

export default class Order extends Component {
  render () {
    return (
      <Query
        query={SINGLE_ORDER_QUERY}
        variables={{ id: this.props.id }}>
        {({ data, error, loading }) => {
          if (error) return <Error error={error} />
          if (loading) return <div>Loading...</div>
          
          const order = data.order

          return (
            <OrderStyles data-test="order"> 
              <Head>
                <title>Sick Fits | Order {order.id}</title>
              </Head>
              <p>
                <span>Order ID:</span>
                <span>{order.id}</span>
              </p>
              <p>
                <span>Charge:</span>
                <span>{order.charge}</span>
              </p>
              <p>
                <span>Date:</span>
                <span>{format(order.createdAt, 'MMMM d, yyyy h:mm a')}</span>
              </p>
              <p>
                <span>Total Price:</span>
                <span>{formatMoney(order.total)}</span>
              </p>
              <p>
                <span>Total Items:</span>
                <span>{order.items.length}</span>
              </p>
              <div className="items">
                {order.items.map(item => (
                  <div className="order-item" key={item.id}>
                    <img src={item.image} />
                    <div className="item-details">
                      <h2>{item.name}</h2>
                      <p>Qty: {item.quantity}</p>
                      <p>Each: {formatMoney(item.price)}</p>
                      <p>SubTotal: {formatMoney(item.price * item.quantity)}</p>
                      <p>Description: {item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </OrderStyles>
          )
        }}
      </Query>
    )
  }
}
