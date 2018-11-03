import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import Signup, { CREATE_USER_MUTATION } from '../components/Signup'
import { fakeUser } from '../lib/testUtils'
import { CURRENT_USER_QUERY } from '../components/User'
import { ApolloConsumer } from 'react-apollo';

const type = (wrapper, name, value) => {
  wrapper.find(`input[name="${name}"]`).simulate('change', { target: { name, value } })
}

const user = fakeUser()

const mocks = [
  {
    request: {
      query: CREATE_USER_MUTATION,
      variables: {
        email: user.email,
        name: user.name,
        password: 'password'
      }
    },
    result: {
      data: {
        signup: {
          __typename: 'User',
          id: 'abc123',
          email: user.email,
          name: user.name
        }
      }
    }
  },
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: { me: { ...user } }
    }
  }
]

describe('<Signup />', () => {
  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <Signup />
      </MockedProvider>
    )

    expect(toJSON(wrapper.find('form'))).toMatchSnapshot()
  })

  it('calls the mutation properly', async () => {
    let ApolloClient
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            ApolloClient = client
            
            return (
              <Signup />
            )
          }}
        </ApolloConsumer>
      </MockedProvider>
    )

    await wait()
    wrapper.update()

    type(wrapper, 'name', user.name)
    type(wrapper, 'email', user.email)
    type(wrapper, 'password', 'password')

    wrapper.update()

    wrapper.find('form').simulate('submit')
    await wait()

    const currentUser = await ApolloClient.query({ query: CURRENT_USER_QUERY })

    expect(currentUser.data.me).toMatchObject(user)
  })
})
