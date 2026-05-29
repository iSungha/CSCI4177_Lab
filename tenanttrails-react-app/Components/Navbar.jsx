import Button from "./Button";

function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">TenantTrails</div>

      <nav className="nav-actions" aria-label="Main navigation">
        <button className="nav-link">Sign In</button>
        <Button variant="nav">Get Started</Button>
      </nav>
    </header>
  );
}

export default Navbar;