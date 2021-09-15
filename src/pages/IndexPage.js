import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { BsBoxArrowInRight } from "react-icons/bs";
import { Link } from "react-router-dom";

const IndexPage = () => {
  return (
    <div>
      <h1 className="text-center mt-3">Welcome</h1>
      <h1 className="text-center mt-3">CHG Meeting Room</h1>
      <Container className="mt-3">
        <Row>
        <Col xs={12} md={6}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Schedule</h5>
                <p className="card-text">รายละเอียดข้อมูลการจอง</p>
                <Link to="/schedule">
                  <Button variant="outline-success" className="float-right">
                  Schedule <BsBoxArrowInRight />
                  </Button>{" "}
                </Link>
              </div>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Room</h5>
                <p className="card-text">จัดการห้องประชุม</p>
                <Link to="/room">
                  <Button variant="outline-success" className="float-right">
                    Room <BsBoxArrowInRight />
                  </Button>{" "}
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default IndexPage;
