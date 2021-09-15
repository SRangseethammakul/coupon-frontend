import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { BsClock } from "react-icons/bs";
const NavBar = () => {
  return (
    <>
      <Navbar bg="dark" expand="lg" variant="dark">
        <NavLink className="navbar-brand" to="/" exact>
          <BsClock /> CHG
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavLink to="/" exact className="nav-link" activeClassName="active">
              Home
            </NavLink>
            <NavLink
              to="/schedule"
              className="nav-link"
              activeClassName="active"
            >
              Schedule
            </NavLink>
            <NavLink to="/room" className="nav-link" activeClassName="active">
              Room
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default NavBar;
