import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { BsPeopleCircle } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
// import { UserStoreContext } from "../context/UserContext";
import { useDispatch } from "react-redux";
import { updateProfile } from "../redux/actions/authAction";
const schema = yup.object().shape({
  username: yup.string().required("email not empty"),
  password: yup.string().required("password not empty"),
});

const LoginPage = () => {
  const { addToast } = useToasts();
  const history = useHistory();
  // const userStore = React.useContext(UserStoreContext);
  //use redux
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    try {
      const pathURL = "https://connectmeeting.herokuapp.com/users/login";
      const resp = await axios.post(pathURL, {
        username: data.username,
        password: data.password,
      });
      localStorage.setItem("token", JSON.stringify(resp.data));
      //get profile
      const urlProfile = "https://connectmeeting.herokuapp.com/users/me";
      const respProfile = await axios.get(urlProfile, {
        headers: {
          Authorization: "Bearer " + resp.data.access_token,
        },
      });
      localStorage.setItem(
        "profile",
        JSON.stringify(respProfile.data.user)
      );

      addToast("Welcome Back !!!", {
        appearance: "success",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
      const profileValue = JSON.parse(localStorage.getItem('profile'))
      // userStore.updateProfile(profileValue); //context
      //call action
      dispatch(updateProfile(profileValue))
      history.replace('/');
    } catch (error) {
      addToast(error.response.data.message, {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
    }
  };
  return (
    <>
      <Container className="mt-4">
        <h1>Login</h1>
        <Row>
          <Col xs={12} md={8}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  ref={register}
                  className={`form-control ${errors.username ? "is-invalid" : ""}`}
                />
                {errors.username && (
                  <Form.Control.Feedback type="invalid">
                    {errors.username.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  ref={register}
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                />
                {errors.password && (
                  <Form.Control.Feedback type="invalid">
                    {errors.password.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Button variant="primary" type="submit">
                <BsPeopleCircle className="mr-2" />
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginPage;