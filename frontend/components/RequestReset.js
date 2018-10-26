import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User'
const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestResetToken(email: $email) {
      message
    }
  }
`

export default class RequestReset extends Component {
  state = {
    email: ''
  }

  handleChange = e => {
    const { value, name } = e.target

    this.setState({ [name]: value })
  }

  render () {
    return (
      <Mutation
        mutation={REQUEST_RESET_MUTATION}
        variables={this.state}>
        {(requestResetToken, { error, loading, called }) => (
          <Form onSubmit={async e => {
            e.preventDefault()

            await requestResetToken()
            this.setState({ email: '' })
          }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <Error error={error} />
              <h2>Reset your password</h2>
              {!error && !loading && called && <p>Success! Check your email for a rest link</p>}
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

              <button type="submit">Send reset link</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}
