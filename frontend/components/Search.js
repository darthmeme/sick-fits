import React, { Component } from 'react'
import Downshift from 'downshift'
import Router from 'next/router'
import { ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'
import debounce from 'lodash.debounce'
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown'

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($query: String!) {
    items(where: { OR: [{ name_contains: $query }, { description_contains: $query }]}) {
      id
      name
      image
    }
  }
`

export default class Search extends Component {
  state = {
    items: [],
    loading: false
  }

  onChange = debounce(async (e, client) => {
    this.setState({ loading: true  })

    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: {
        query: e.target.value
      }
    })

    this.setState({ items: res.data.items, loading: false })
  }, 350)

  routeToItem = item => {
    Router.push({ pathname: '/item', query: { id: item.id } })
  }

  render () {
    return (
      <SearchStyles>
        <Downshift 
          itemToString={item => item === null ? '' : item.name}
          onChange={this.routeToItem}>
          {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    {...getInputProps({
                      type: 'search',
                      id: 'search',
                      className: this.state.loading ? 'loading' : '',
                      placeholder: 'Search...',
                      onChange: e => {
                        e.persist()
                        this.onChange(e, client)
                      }
                    }
                  )} />
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {this.state.items.map((item, index) => (
                    <DropDownItem
                      {...getItemProps({ item })} 
                      key={item.id}
                      highlighted={index === highlightedIndex}>
                      <img width="50" src={item.image} />
                      {item.name}
                    </DropDownItem>
                  ))}
                  {!this.state.items.length && !this.state.loading && (
                    <DropDownItem>
                      No results found for {inputValue}
                    </DropDownItem>
                  )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    )
  }
}
