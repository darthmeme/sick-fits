import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Error from '../components/ErrorMessage'
import styled from 'styled-components'
import Head from 'next/head'

const Card = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.boxShadow};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`
const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id,
      name,
      description,
      price,
      largeImage
    }
  }
`

export default class SingleItem extends Component {  
  render () {
    return (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{ id: this.props.id }}>
        {({ data, error, loading }) => {
          if (error) return <Error error={error} />
          if (loading) return <div>Loading...</div>
          if (!data.item) return <Error error={{ message: 'No item found' }} />

          const item = data.item

          return (
            <Card>
              <Head>
                <title>Sick Fits | {item.name}</title>
              </Head>
              <img src={item.largeImage} />
              <div class="details">
                Viewing {item.name}
                <p>{item.description}</p>
              </div>
            </Card>
          )
        }}
      </Query>
    )
  }
}
