import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import AddToCart, { ADD_TO_CART_MUTATION } from '../components/AddToCart'
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
          ...fakeUser()
        }
      }
    }
  },
  {
    request: {
      query: ADD_TO_CART_MUTATION,
      variables: {
        id: 'omg123'
      }
    },
    result: {
      data: {
        addToCart: {
          ...fakeCartItem(),
          quantity: 1
        }
      }
    }
  },
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem()]
        }
      }
    }
  }
]

describe('<AddToCart />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id='123' />
      </MockedProvider>
    )

    await wait()
    wrapper.update()

    expect(toJSON(wrapper.find('button'))).toMatchSnapshot()
  })

  it('adds an item to cart when clicked', async () => {
    let apolloClient
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client

            return <AddToCart id='omg123' />
          }}
        </ApolloConsumer>
      </MockedProvider>
    )

    await wait()
    wrapper.update()

    const { data: { me } } = await apolloClient.query({ query: CURRENT_USER_QUERY })
    expect(me.cart).toHaveLength(0)

    wrapper.find('button').simulate('click')

    await wait()

    const { data: { me: updatedMe } } = await apolloClient.query({ query: CURRENT_USER_QUERY })
    // console.log(updatedMe)
    // expect(updatedMe.cart).toHaveLength(1)
  })
})
