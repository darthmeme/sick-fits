import Link from 'next/link'
import NavStyles from '../components/styles/NavStyles'
import User from './User'

const Nav = () => (
  <NavStyles>
    <User>
      {({ data }) => {
        if (data) return <div>{data.me.name}</div>
      }}
    </User>
    <Link href="/items">
      <a>Items</a>
    </Link>
    <Link href="/sell">
      <a>Sell</a>
    </Link>
    <Link href="/signup">
      <a>Signup</a>
    </Link>
    <Link href="/orders">
      <a>Orders</a>
    </Link>
    <Link href="/me">
      <a>Account</a>
    </Link>
  </NavStyles>
)

export default Nav
