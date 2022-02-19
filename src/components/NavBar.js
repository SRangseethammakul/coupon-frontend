import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import { BsClock } from "react-icons/bs";
//redux
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../redux/actions/authAction";
const NavBar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  //redux
  const profileRedux = useSelector((state) => state.authReducer.profile);
  const getProfile = () => {
    const profileValue = JSON.parse(localStorage.getItem("profile"));
    if (profileValue) {
      dispatch(updateProfile(profileValue));
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    history.replace("/");
    dispatch(updateProfile(null));
  };
  React.useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
            <NavLink to="/coupon" className="nav-link" activeClassName="active">
              Coupon
            </NavLink>
            <NavLink
              to="/datesetting"
              className="nav-link"
              activeClassName="active"
            >
              Date Setting
            </NavLink>
            <NavLink
              to="/transaction"
              className="nav-link"
              activeClassName="active"
            >
              Transaction
            </NavLink>
            <NavLink to="/chart" className="nav-link" activeClassName="active">
              Chart
            </NavLink>
          </Nav>
          <Nav>
            {profileRedux ? (
              <span className="navbar-text text-white">
                Welcome {profileRedux.name} {profileRedux.role}
                <button className="btn btn-danger ml-2" onClick={logout}>
                  Log out
                </button>
              </span>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="nav-link"
                  activeClassName="active"
                >
                  Login
                </NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default NavBar;
