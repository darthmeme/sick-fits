import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import gql from 'graphql-tag'
import ErrorMessage from './ErrorMessage'
import Router from 'next/router'

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $name: String!,
    $description: String!,
    $price: Int!,
    $image: String,
    $largeImage: String
  ) {
    createItem(
      name: $name
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
      name
    }
  }
`

export default class CreateItem extends Component {
  state = {
    name: 'Cool',
    description: '',
    image: '',
    largeImage: '',
    price: 0
  }

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value

    this.setState({ [name]: val })
  }

  uploadFile = async e => {
    const files = e.target.files
    const data = new FormData()
    data.append('file', files[0])
    data.append('upload_preset', 'sickfits')

    const res = await fetch('https://api.cloudinary.com/v1_1/dug281bvy/image/upload', {
      method: 'POST',
      body: data
    })

    const file = await res.json()

    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    })
  }

  render () {
    return (
      <Mutation
        mutation={CREATE_ITEM_MUTATION}
        variables={this.state}>
        {(createItem, { data, error, loading }) => (
          <Form onSubmit={
            async e => {
              e.preventDefault()
              
              const res = await createItem()
              Router.push({ pathname: '/item', query: { item: res.data.createItem.id } })
            }
          }>
            <ErrorMessage error={error} />
            <h2>Sell an item</h2>
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="name">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  onChange={this.uploadFile} />

                {this.state.image && <img src={this.state.image} />}
              </label>

              <label htmlFor="name">
                Name
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="name"
                  value={this.state.name}
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
                  value={this.state.description}
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
                  value={this.state.price}
                  onChange={this.handleChange}
                  required />
              </label>

              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}
