import {Link} from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div className='cntrlize'>
        <h1>Oops, You Stumbled Upon Some Unauthorized Zone.</h1>
        <h2>Either you are not logged in or you are not allowed to go further</h2>
        <Link to='/menu'>Go back to the menu</Link>
    </div>
  )
}
