import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { ALL_ITEMS_QUERY } from './Items' 

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

export default class DeleteItem extends Component {
  update = (cache, payload) => {
    console.log(payload)
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY })
    const filteredItems = data.items.filter(item => item.id !== payload.data.deleteItem.id)
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data: { items: filteredItems } })
  }

  render () {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}>
        {(deleteItem, { error, loading }) => (
          <button onClick={async () => {
            if (confirm('Are you sure you want to delete this?')) {
              deleteItem()
            }
          }}>Delete</button>
        )}
      </Mutation>
    )
  }
}
