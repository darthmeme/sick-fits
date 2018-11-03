import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User'

export const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      name,
      email,
      id
    }
  }
`

export default class Signin extends Component {
  state = {
    email: '',
    password: ''
  }

  handleChange = e => {
    const { value, name } = e.target

    this.setState({ [name]: value })
  }

  render () {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(signin, { error, loading }) => (
          <Form onSubmit={async e => {
            e.preventDefault()

            await signin()
            this.setState({ email: '', password: '' })
          }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <Error error={error} />
              <h2>Sign into your account</h2>
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

              <button type="submit">Sign in</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}
