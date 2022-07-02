import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Starling</h1>
      <div className="links">
        <Link to="/">Deployment</Link>
        <Link to="/monitor">Monitor</Link>
      </div>
    </nav>
  );
}
 
export default Navbar;