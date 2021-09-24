import React from "react";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { useLocation,useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { BsPeopleCircle } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const schema = yup.object().shape({
  name: yup.string().required("name not empty"),
  phonenumber: yup
    .number("ใส่ตัวเลขเท่านั้น")
    .required("Phone Number not empty"),
  department: yup.string().required("department not empty"),
});

const CustomerPage = () => {
  const query = useQuery();
  const history = useHistory();
  const { addToast } = useToasts();
  const MySwal = withReactContent(Swal);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [userId, setUserId] = React.useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    try {
      setLoading(true); 
      const pathURL = "https://connect-meeting-backend.herokuapp.com/customer";
      const resp = await axios.post(pathURL, {
        name: data.name,
        phonenumber: data.phonenumber,
        department: data.department,
        userid: userId
      });
      MySwal.fire({
        icon: "success",
        title: resp.data.message,
        showConfirmButton: false,
        timer: 3000,
      });
      history.replace("/login");
    } catch (err) {
      addToast(err.response.data.error.message, {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
    }
  };
  const getUserid = async () => {
    try {
      setLoading(true);
      if(query.get("userid")){
        setUserId(query.get("userid"));
      }else{
        setError('กรุณาลองกดลิงค์ใหม่ทางไลน์อีกครั้ง');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    getUserid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (loading === true) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="grow" variant="info" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center mt-5">
        <p>Try Again</p>
        <p>{error}</p>
      </div>
    );
  }
  return (
    <>
      <Container className="mt-4">
        <h1>Register Customer {userId}</h1>
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
                <Form.Label>3CX Number Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phonenumber"
                  ref={register}
                  className={`form-control ${
                    errors.phonenumber ? "is-invalid" : ""
                  }`}
                />
                {errors.phonenumber && (
                  <Form.Control.Feedback type="invalid">
                    {errors.phonenumber.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Form.Group controlId="formBasicDepartment">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  name="department"
                  ref={register}
                  className={`form-control ${
                    errors.department ? "is-invalid" : ""
                  }`}
                />
                {errors.department && (
                  <Form.Control.Feedback type="invalid">
                    {errors.department.message}
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

export default CustomerPage;
