import { mount } from 'enzyme'
import Gate from '../components/Gate'
import { CURRENT_USER_QUERY } from '../components/User'
import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import { fakeUser } from '../lib/testUtils'

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

describe('<Gate />', () => {
  it('renders <SignIn /> to logged out users', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMock}>
        <Gate>
          <div>Logged in!</div>
        </Gate>
      </MockedProvider>
    )

    await wait()
    wrapper.update()
    expect(wrapper.text()).toContain('Sign into your account')
    expect(wrapper.find('Signin').exists()).toBe(true)
    expect(wrapper.contains(<div>Logged in!</div>)).toBe(false)
  })

  it('renders child component when signed in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMock}>
        <Gate>
          <div>Logged in!</div>
        </Gate>
      </MockedProvider>
    )

    await wait()
    wrapper.update()
    expect(wrapper.contains(<div>Logged in!</div>)).toBe(true)
  })
})
