import Gate from '../components/Gate'
import Order from '../components/Order'

const OrderPage = props => (
  <Gate>
    <Order id={props.query.id} />
  </Gate>
)

export default OrderPage
