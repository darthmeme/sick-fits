import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import Form from './styles/Form'
import { CURRENT_USER_QUERY } from './User'
const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION($resetToken: String!, $newPassword: String!) {
    resetPassword(resetToken: $resetToken, newPassword: $newPassword) {
      name,
      email,
      id
    }
  }
`

export default class ReqestForm extends Component {
  state = {
    password: '',
    confirmPassword: '',
    errorMessage: ''
  }

  handleChange = e => {
    const { value, name } = e.target

    this.setState({ [name]: value, errorMessage: '' })
  }

  render () {
    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{ resetToken: this.props.resetToken, newPassword: this.state.password }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(resetPassword, { error, loading }) => (
          <Form onSubmit={async e => {
            e.preventDefault()

            if (this.state.password !== this.state.confirmPassword) {
              console.log('hello')
              this.setState({ errorMessage: 'Passwords don\'t match!' })
            } else {
              await resetPassword()
              this.setState({ password: '', confirmPassword: '' })
            }
          }}>
            <fieldset disabled={loading} aria-busy={loading}>
              {error && <Error error={error} />}
              {this.state.errorMessage && <Error error={{ message: this.state.errorMessage }} />}
              <h2>Reset your password</h2>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter new password..."
                  onChange={this.handleChange}
                  value={this.state.password} />
              </label>

              <label htmlFor="confirmPassword">
                Confirm password
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm new password..."
                  onChange={this.handleChange}
                  value={this.state.newPassword} />
              </label>

              <button type="submit">Reset Password</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}
