import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import Form from './styles/Form';
import { CREATE_USER_QUERY, CURRENT_USER_QUERY } from './User'

export const CREATE_USER_MUTATION = gql`
  mutation CREATE_USER_MUTATION($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      name,
      email,
      id
    }
  }
`

export default class Signup extends Component {
  state = {
    email: '',
    name: '',
    password: ''
  }

  handleChange = e => {
    const { value, name } = e.target

    this.setState({ [name]: value })
  }

  render () {
    return (
      <Mutation
        mutation={CREATE_USER_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(signup, { error, loading }) => (
          <Form onSubmit={async e => {
            e.preventDefault()
            
            await signup()
            this.setState({ name: '', email: '', password: '' })
          }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <Error error={error} />
              <h2>Sign up for an account</h2>
              <label htmlFor="email">
                Email
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Email..."
                  onChange={this.handleChange}
                  value={this.state.email} />
              </label>

              <label htmlFor="name">
                Name
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name..."
                  onChange={this.handleChange}
                  value={this.state.name} />
              </label>

              <label htmlFor="password">
                Password
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password..."
                  onChange={this.handleChange}
                  value={this.state.password} />
              </label>

              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}
