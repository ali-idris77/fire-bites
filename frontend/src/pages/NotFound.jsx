import {Link} from 'react-router-dom'
const NotFound = () => {
    return ( 
        <div className="not-found">
            <h1>404</h1>
            <h2>page not found</h2>
            <p>the page you are looking for isnt quite here.</p>
            <Link to='/'>Go home</Link>
        </div>
     );
}
 
export default NotFound;