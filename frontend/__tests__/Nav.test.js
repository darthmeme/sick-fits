import { mount } from 'enzyme'
import Nav from '../components/Nav'
import { CURRENT_USER_QUERY } from '../components/User'
import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import { fakeUser } from '../lib/testUtils'
import toJSON from 'enzyme-to-json'

const notSignedInMock = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        me: null
      }
    }
  }
]

const signedInMock = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        me: fakeUser()
      }
    }
  }
]

describe('<Nav />', () => {
  it('renders a minimal nav when signed out', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMock}>
        <Nav />
      </MockedProvider>
    )

    await wait()
    wrapper.update()
    const nav = wrapper.find('ul[data-test="nav-test"]')
    expect(toJSON(nav)).toMatchSnapshot()
  })

  it('renders full nav when signed in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMock}>
        <Nav />
      </MockedProvider>
    )

    await wait()
    wrapper.update()
    const nav = wrapper.find('ul[data-test="nav-test"]')
    expect(nav.children().length).toBe(6)
    expect(nav.text()).toContain('Signout')
  })
})
