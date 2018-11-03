import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import Payment, { CREATE_ORDER_MUTATION } from '../components/Payment'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser, fakeCartItem } from '../lib/testUtils'
import { ApolloConsumer } from 'react-apollo';
import NProgress from 'nprogress'
import Router from 'next/router'

Router.router = {
  push: jest.fn()
}

const mocks = [
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

describe('<Payment />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Payment />
      </MockedProvider>
    )

    await wait()
    wrapper.update()

    const checkoutButton = wrapper.find('ReactStripeCheckout')

    expect(toJSON(checkoutButton)).toMatchSnapshot()
  })

  it('creates an order onToken', () => {
    const createOrderMock = jest.fn().mockResolvedValue({
      data: {
        createOrder: {
          id: 'xyz789'
        }
      }
    })

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Payment />
      </MockedProvider>
    )

    const component = wrapper.find('Payment').instance()
    component.onToken({ id: 'abc123' }, createOrderMock)

    expect(createOrderMock).toHaveBeenCalled()
  })

  it('turns the progress bar on', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Payment />
      </MockedProvider>
    )

    const createOrderMock = jest.fn().mockResolvedValue({
      data: {
        createOrder: {
          id: 'xyz789'
        }
      }
    })

    await wait()
    wrapper.update()

    NProgress.start = jest.fn()

    const component = wrapper.find('Payment').instance()
    component.onToken({ id: 'abc123' }, createOrderMock)

    expect(NProgress.start).toHaveBeenCalled()
  })

  it('routes to the order page once completed', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Payment />
      </MockedProvider>
    )

    const createOrderMock = jest.fn().mockResolvedValue({
      data: {
        createOrder: {
          id: 'xyz789'
        }
      }
    })

    await wait()
    wrapper.update()

    const component = wrapper.find('Payment').instance()
    component.onToken({ id: 'abc123' }, createOrderMock)

    expect(Router.router.push).toHaveBeenCalled()
  })
})
