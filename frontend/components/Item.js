import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Title from './styles/Title'
import ItemStyles from './styles/ItemStyles'
import PriceTag from './styles/PriceTag'
import Link from 'next/link'
import formatMoney from '../lib/formatMoney'
import DeleteItem from './DeleteItem'
import AddToCart from './AddToCart'

export default class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired
  }
  
  render () {
    const { item } = this.props

    return (
      <ItemStyles>
        {item.image && <img src={item.image} />}
        <Title>
          <Link href={{ pathname: '/item', query: { id: item.id } }}>
            <a>{item.name}</a>
          </Link>
        </Title>
        <p>{item.description}</p>
        <div>
          <Link href={{ pathname: '/update', query: { id: item.id } }}><a>Edit ✏️</a></Link>
          <AddToCart id={item.id} />
          <DeleteItem id={item.id} />
        </div>
        <PriceTag>{formatMoney(item.price)}</PriceTag>
      </ItemStyles>
    )
  }
}
