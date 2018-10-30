import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import { formatDistance } from 'date-fns'
import styled from 'styled-components'
import Link from 'next/link'
import formatMoney from '../lib/formatMoney'
import OrderItemStyles from './styles/OrderItemStyles'

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders {
      id
      total
      createdAt
      items {
        id
        name
        description
        quantity
        image
      }
    }
  }
`

const OrderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minMax(40%, 1fr));
`

export default class OrderList extends Component {
  render () {
    return (
      <Query query={USER_ORDERS_QUERY}>
        {({ data: { orders }, loading, error }) => {
          if (error) return <Error error={error} />
          if (loading) return <div>Loading...</div>

          return (
            <div>
              <h2>You have {orders.length} orders</h2>
              <OrderUl>
                {orders.map(order => (
                  <OrderItemStyles key={order.id}>
                    <Link href={{ pathname: '/order', query: { id: order.id } }}>
                      <a>
                        <div className="order-meta">
                          <p>{order.items.reduce((a,b) => a + b.quantity, 0)} items</p>
                          <p>{order.items.length} products</p>
                          <p>{formatDistance(order.createdAt, new Date())}</p>
                          <p>{formatMoney(order.total)}</p>
                        </div>
                        <div className="images">
                          {order.items.map(item => (
                            <img src={item.image} key={item.id} />
                          ))}
                        </div>
                      </a>
                    </Link>
                  </OrderItemStyles>
                ))}
              </OrderUl>
            </div>
          )
        }}
      </Query>
    )
  }
}
