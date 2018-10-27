import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import Table from './styles/Table'
import SickButton from './styles/SickButton'

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION($id: ID!, $permissions: [Permission]!) {
    updatePermissions(id: $id, permissions: $permissions) {
      permissions
    }
  }
`

const permissions = [
  'ADMIN',
  'USER',
  'ITEM_CREATE',
  'ITEM_UPDATE',
  'ITEM_DELETE',
  'PERMISSION_UPDATE'
]

class User extends Component {
  state = {
    permissions: this.props.user.permissions
  }

  handleChange = e => {
    const { value } = e.target
    let updatedPermissions = this.state.permissions.slice(0)

    if (updatedPermissions.includes(value)) {
      updatedPermissions = updatedPermissions.filter(permission => permission !== value)
    } else {
      updatedPermissions.push(value)
    }

    this.setState({ permissions: updatedPermissions })
  }

  render () {
    const { user }= this.props

    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{ id: user.id, permissions: this.state.permissions }}>
        {(updatedPermissions, { loading, error }) => {
          return (
            <>
              {error && <Error error={ error} />}
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {permissions.map(permission => (
                  <td key={permission}>
                    <label htmlFor={`${user.id}-permission-${permission}`}>
                      <input
                        type="checkbox"
                        checked={this.state.permissions.includes(permission)}
                        onChange={this.handleChange}
                        value={permission} />
                    </label>
                  </td>
                ))}
                <td>
                  <SickButton
                    disabled={loading}
                    onClick={updatedPermissions}>
                    Update
                  </SickButton>
                </td>
              </tr>
            </>
          )
        }}
      </Mutation>
    )
  }
}

const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <div>Loading...</div>
      if (error) return <Error error={error} />

      return (
        <>
          <h1>Manage Permissions</h1>
          <Table>
            <thead>
              <tr>
                <td>Name</td>
                <td>Email</td>
                {permissions.map(permission => <th key={permission}>{permission}</th>)}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(user => (
                <User user={user} key={user.id} />
              ))}
            </tbody>
          </Table>
        </>
      )
    }}
  </Query>
)

export default Permissions
