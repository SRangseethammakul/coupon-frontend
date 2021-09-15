import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { BsPeopleCircle } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const schema = yup.object().shape({
  name: yup.string().required("name not empty"),
  username: yup.string().required("username not empty"),
  password: yup.string().required("password not empty"),
});

const RegisterPage = () => {
  const { addToast } = useToasts();
  const history = useHistory();
  const MySwal = withReactContent(Swal);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    try {
      const pathURL = "https://connectmeeting.herokuapp.com/users/register";
      const resp = await axios.post(pathURL, {
        name: data.name,
        username: data.username,
        password: data.password,
      });
      MySwal.fire({
        icon: "success",
        title: resp.data.message,
        showConfirmButton: false,
        timer: 3000,
      });
      history.replace("/login");
    } catch (error) {
      addToast(error.response.data.error.message, {
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
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  ref={register}
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                />
                {errors.name && (
                  <Form.Control.Feedback type="invalid">
                    {errors.name.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
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

export default RegisterPage;