import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import Order, { SINGLE_ORDER_QUERY } from '../components/Order'
import { fakeUser, fakeOrder } from '../lib/testUtils'
import { ApolloConsumer } from 'react-apollo'

const mocks = [
  {
    request: {
      query: SINGLE_ORDER_QUERY,
      variables: {
        id: 'ord123'
      }
    },
    result: {
      data: {
        order: fakeOrder()
      }
    }
  }
]

describe('<Order />', () => {
  it('render the order', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id='ord123' />
      </MockedProvider>
    )

    await wait()
    wrapper.update()

    const order = wrapper.find('div[data-test="order"]')

    expect(toJSON(order)).toMatchSnapshot()
  })
})
