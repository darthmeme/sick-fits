import Item from '../components/Item'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

const fakeItem = {
  id: '123',
  name: 'Cool Item',
  description: 'A cool item',
  price: 10000,
  image: 'dog.jpg',
  largeImage: 'large-dog.jpg'
}

describe('<Item />', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<Item item={fakeItem} />)

    expect(toJSON(wrapper)).toMatchSnapshot()
  })

  // it('renders and displays properly', () => {
  //   const wrapper = shallow(<Item item={fakeItem} />)
  //   const priceTag = wrapper.find('PriceTag')
  //   const image = wrapper.find('img')

  //   expect(priceTag.children().text()).toBe('$100')
  //   expect(wrapper.find('Title a').text()).toBe(fakeItem.name)
  //   expect(image.props().src).toBe(fakeItem.image)
  // })

  // it('renders out the buttons properly', () => {
  //   const wrapper = shallow(<Item item={fakeItem} />)
  //   const buttonList = wrapper.find('.buttonList')

  //   expect(buttonList.children()).toHaveLength(3)
  //   expect(buttonList.find('Link').exists()).toBe(true)
  //   expect(buttonList.find('DeleteItem').exists()).toBe(true)
  //   expect(buttonList.find('AddToCart').exists()).toBe(true)
  // })
})
