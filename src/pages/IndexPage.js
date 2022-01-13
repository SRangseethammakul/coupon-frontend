import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { BsBoxArrowInRight } from "react-icons/bs";
import { Link } from "react-router-dom";

const IndexPage = () => {
  return (
    <div>
      <h1 className="text-center mt-3">Welcome</h1>
      <h1 className="text-center mt-3">Reckitt Benckiser</h1>
      <Container className="mt-3">
        <Row>
          <Col xs={12} md={6}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Coupon</h5>
                <p className="card-text">สแกนคูปอง</p>
                <Link to="/coupon">
                  <Button variant="outline-success" className="float-right">
                    coupon <BsBoxArrowInRight />
                  </Button>{" "}
                </Link>
              </div>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Transaction</h5>
                <p className="card-text">ตรวจสอบข้อมูลราย Transaction</p>
                <Link to="/transaction">
                  <Button variant="outline-success" className="float-right">
                    Transaction <BsBoxArrowInRight />
                  </Button>{" "}
                </Link>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={12} md={6}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Date Setting</h5>
                <p className="card-text">แก้ไข Limit ในแต่ล่ะวัน</p>
                <Link to="/datesetting">
                  <Button variant="outline-success" className="float-right">
                    Date Setting <BsBoxArrowInRight />
                  </Button>{" "}
                </Link>
              </div>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Chart</h5>
                <p className="card-text">ตรวจสอบข้อมูลโดย Chart</p>
                <Link to="/chart">
                  <Button variant="outline-success" className="float-right">
                    Transaction <BsBoxArrowInRight />
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
