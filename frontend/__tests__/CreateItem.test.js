import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import CreateItem, { CREATE_ITEM_MUTATION} from '../components/CreateItem'
import Router from 'next/router'
import { fakeItem } from '../lib/testUtils'

global.fetch = jest.fn().MockResolvedValue({
  json: () => ({
    secure_url: 'dog.jpg',
    eager: [
      {
        secure_url: 'large-dog.jpg'
      }
    ]
  })
})

describe('<CreateItem />')
