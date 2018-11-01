import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import CartCount from '../components/CartCount'

describe('<CartCount />', () => {
  it('renders', () => {
    shallow(<CartCount count={10} />)
  })

  it('matches the snapshot', () => {
    const wrapper = shallow(<CartCount count={5} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })

  it('can update via props', () => {
    const wrapper = shallow(<CartCount count={1} />)
    expect(toJSON(wrapper)).toMatchSnapshot()

    wrapper.setProps({ count: 2 })
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
