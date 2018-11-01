import { mount } from 'enzyme'
import Pagination, { PAGINATION_QUERY } from '../components/Pagination'
import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import toJSON from 'enzyme-to-json'
import Router from 'next/router'

Router.router = {
  push () {},
  prefetch () {}
}

const makeMocksFor = length => {
  return [
    {
      request: {
        query: PAGINATION_QUERY
      },
      result: {
        data: {
          itemsConnection: {
            __typename: 'aggreagate',
            aggregate: {
              __typename: 'count',
              count: length
            }
          }
        }
      }
    }
  ]
}

describe('<Pagination />', () => {
  it('displays a loading message', () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(1)}>
        <Pagination page={1} />
      </MockedProvider>
    )

    expect(wrapper.text()).toContain('Loading...')
  })

  it('displays pagination for 18 items', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    )

    await wait()
    wrapper.update()
    expect(wrapper.find('.totalPages').text()).toBe('5')
    const pagination = wrapper.find('div[data-test="pagination"]')
    expect(toJSON(pagination)).toMatchSnapshot()
  })

  it('disabes prev on first page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    )

    await wait()
    wrapper.update()
    expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(true)
    expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false)
  })

  it('disabes next on last page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={5} />
      </MockedProvider>
    )

    await wait()
    wrapper.update()
    expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false)
    expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(true)
  })

  it('enables all buttons on a middle page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={3} />
      </MockedProvider>
    )

    await wait()
    wrapper.update()
    expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false)
    expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false)
  })

})
