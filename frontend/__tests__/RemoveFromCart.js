import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import RemoveFromCart, { REMOVE_FROM_CART_MUTATION } from '../components/RemoveFromCart'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser, fakeCartItem } from '../lib/testUtils'
import { ApolloConsumer } from 'react-apollo';

const mocks = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem({ id: '123' })]
        }
      }
    }
  },
  {
    request: {
      query: REMOVE_FROM_CART_MUTATION,
      variables: {
        id: '123'
      }
    },
    result: {
      data: {
        removeFromCart: {
          __typename: 'CartItem',
          id: '123'
        }
      }
    }
  }
]

describe('<RemoveFromCart />', () => {
  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <RemoveFromCart />
      </MockedProvider>
    )

    expect(toJSON(wrapper.find('button'))).toMatchSnapshot()
  })

  it('removes item from cart', async () => {
    let apolloClient
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client

            return <RemoveFromCart id='123' />
          }}
        </ApolloConsumer>
      </MockedProvider>
    )

    const res = await apolloClient.query({ query: CURRENT_USER_QUERY })
    expect(res.data.me.cart).toHaveLength(1)

    wrapper.find('button').simulate('click')

    await wait()

    const newRes = await apolloClient.query({ query: CURRENT_USER_QUERY })
    
    expect(newRes.data.me.cart).toHaveLength(0)
  })
})
