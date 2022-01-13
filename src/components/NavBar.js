import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { BsClock } from "react-icons/bs";
const NavBar = () => {
  return (
    <>
      <Navbar bg="dark" expand="lg" variant="dark">
        <NavLink className="navbar-brand" to="/" exact>
          <BsClock /> RB
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavLink to="/" exact className="nav-link" activeClassName="active">
              Home
            </NavLink>
            <NavLink
              to="/coupon"
              className="nav-link"
              activeClassName="active"
            >
              Coupon
            </NavLink>
            <NavLink to="/datesetting" className="nav-link" activeClassName="active">
              Date Setting
            </NavLink>
            <NavLink to="/transaction" className="nav-link" activeClassName="active">
              Transaction
            </NavLink>
            <NavLink to="/chart" className="nav-link" activeClassName="active">
              Chart
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default NavBar;
