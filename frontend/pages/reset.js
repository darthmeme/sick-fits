import ResetForm from '../components/ResetForm'

const Reset = props => (
  <div>
    <ResetForm resetToken={props.query.resetToken} />
  </div>
)

export default Reset
