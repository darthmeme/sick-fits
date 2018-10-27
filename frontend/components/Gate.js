import { Query } from 'react-apollo'
import { CURRENT_USER_QUERY } from './User'
import Signin from './Signin'

const Gate = props => (
  <Query query={CURRENT_USER_QUERY}>
    {(({ data, loading }) => {
      if (loading) return <div>Loading...</div>
      if (!data.me) return <Signin />

      return props.children
    })}
  </Query>
)

export default Gate
