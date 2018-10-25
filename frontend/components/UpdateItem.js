import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import gql from 'graphql-tag'
import ErrorMessage from './ErrorMessage'
import Router from 'next/router'

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $name: String,
    $description: String,
    $price: Int,
    $id: ID!
  ) {
    updateItem(
      name: $name,
      description: $description,
      price: $price,
      id: $id
    ) {
      id
      name
      description
      price
    }
  }
`

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      name
      description
      price
    }
  }
`

export default class updateItem extends Component {
  state = {}

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value

    this.setState({ [name]: val })
  }

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault()

    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    })
  }

  render () {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, error, loading }) => {
          if (loading) return <div>Loading...</div>
          if (!data.item) return <div>No item found</div>
          
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION}>
              {(updateItem, { error, loading }) => (
                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                  <ErrorMessage error={error} />
                  <h2>Sell an item</h2>
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="name">
                      Name
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="name"
                        defaultValue={data.item.name}
                        onChange={this.handleChange}
                        required />
                    </label>

                    <label htmlFor="description">
                      Description
                      <textarea
                        type="text"
                        id="description"
                        name="description"
                        placeholder="description"
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                        required />
                    </label>

                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="price"
                        defaultValue={data.item.price}
                        onChange={this.handleChange}
                        required />
                    </label>

                    <button type="submit">Submit</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}
