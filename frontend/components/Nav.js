import Link from 'next/link'
import NavStyles from '../components/styles/NavStyles'
import User from './User'
import Signout from './Signout'
import { Mutation } from 'react-apollo'
import { TOGGLE_CART_MUTATION } from './Cart'
import CartCount from './CartCount'

const Nav = () => (
  <User>
    {({ data }) => (
      <NavStyles>
        <Link href="/">
          <a>Home</a>
        </Link>
        
        {data.me && (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
            <Link href="/me">
              <a>Account</a>
            </Link>
            <Signout />
            <Mutation mutation={TOGGLE_CART_MUTATION}>
              {toggleCart => (
                <button onClick={toggleCart}>My Cart <CartCount count={
                  data.me.cart.reduce((tally, item) => tally + item.quantity, 0)
                } /></button>
              )}
            </Mutation>
          </>
        )}
        
        {!data.me && (
          <Link href="/signup">
            <a>Sign In</a>
          </Link>
        )}
      </NavStyles>
    )}
  </User>
)

export default Nav
