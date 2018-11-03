import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import CreateItem, { CREATE_ITEM_MUTATION} from '../components/CreateItem'
import Router from 'next/router'
import { fakeItem } from '../lib/testUtils'

const dogImage = 'http://dog.com/dog.jpg'

global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: dogImage,
    eager: [
      {
        secure_url: dogImage
      }
    ]
  })
})

describe('<CreateItem />', () => {
  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    )

    const form = wrapper.find('form[data-test="form"]')

    expect(toJSON(form)).toMatchSnapshot()
  })

  it('uploads a file when changes', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    )

    const input = wrapper.find('input[type="file"]')

    input.simulate('change', { target: { files: ['dog.jpg'] } })
    await wait()

    const component = wrapper.find('CreateItem').instance()
    expect(global.fetch).toHaveBeenCalled()
    expect(component.state.image).toEqual(dogImage)
    expect(component.state.largeImage).toEqual(dogImage)

    global.fetch.mockReset()
  })

  it('handles state updating', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    )

    wrapper.find('#name').simulate('change', { target: { value: 'Title', name: 'name' } })
    wrapper.find('#price').simulate('change', { target: { value: 10000, name: 'price', type: 'number' } })
    wrapper.find('#description').simulate('change', { target: { value: 'Description', name: 'description' } })

    expect(wrapper.find('CreateItem').instance().state).toMatchObject({
      name: 'Title',
      description: 'Description',
      price: 10000
    })
  })

  it('creates an item when the form is submitted', async () => {
    const item = fakeItem()
    const mocks = [
      {
        request: {
          query: CREATE_ITEM_MUTATION,
          variables: {
            name: item.name,
            description: item.description,
            image: '',
            largeImage: '',
            price: item.price
          }
        },
        result: {
          data: {
            createItem: {
              ...item,
              typename: 'Item'
            }
          }
        }
      }
    ]

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>
    )

    wrapper.find('#name').simulate('change', { target: { value: item.name, name: 'name' } })
    wrapper.find('#price').simulate('change', { target: { value: item.price, name: 'price', type: 'number' } })
    wrapper.find('#description').simulate('change', { target: { value: item.description, name: 'description' } })
    
    Router.router = {
      push: jest.fn()
    }

    wrapper.find('form').simulate('submit')
    await wait(50)
    expect(Router.router.push).toHaveBeenCalled()
    expect(Router.router.push).toHaveBeenCalledWith({ pathname: '/item', query: { id: item.id } })
  })
})
