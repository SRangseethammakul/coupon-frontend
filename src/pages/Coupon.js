import React from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import { BASE_URL } from "../config";
const api = axios.create({
  baseURL: `${BASE_URL}`,
});
const Coupon = () => {
  const { addToast } = useToasts();
  const [error, setError] = React.useState(null);
  const [dateLimit, setDateLimit] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [count, setCount] = React.useState(null);
  const cancelToken = React.useRef(null);
  const [barcodeInputValue, updateBarcodeInputValue] = React.useState("");
  const sendCode = async (value) => {
    try {
      let resp = await api.post("/transaction", { employeeId: value });
      addToast(resp.data.message, { appearance: "success" });
      setCount(resp.data.count);
      updateBarcodeInputValue("");
    } catch (err) {
      addToast(err.response.data.error.message, { appearance: "error" });
      setError(err.response.data.error.message);
    } finally {
      updateBarcodeInputValue("");
    }
  };
  const onKeyPressBarcode = (event) => {
    try {
      if (event.keyCode === 13) {
        setError("");
        updateBarcodeInputValue();
        sendCode(event.target.value);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const onChangeBarcode = async (event) => {
    try {
      updateBarcodeInputValue(event.target.value);
    } catch (err) {
      console.log(err.message);
    }
  };
  const barcodeAutoFocus = () => {
    try {
      document.getElementById("SearchbyScanning").focus();
    } catch (err) {
      console.log(err.message);
    }
  };
  const getData = async () => {
    try {
      setLoading(true);
      const urlPath = `/transaction/checklimittoday`;
      const resp = await api.get(urlPath, {
        cancelToken: cancelToken.current.token,
      });
      setDateLimit(resp.data);
      setCount(resp.data.usedToday);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    cancelToken.current = axios.CancelToken.source();
    getData();
    return () => {
      cancelToken.current.cancel();
    };
  }, []);
  if (loading === true) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="grow" variant="info" />
      </div>
    );
  }
  return (
    <>
      <Container className="p-3 pb-md-4 mx-auto mt-5 text-center">
        <Row>
          <Col>
            <Container>
              {dateLimit && (
                <>
                  <Row className="gx-5">
                    <Col>วัน</Col>
                    <Col>{dateLimit.day}</Col>
                  </Row>
                  <Row className="gx-5">
                    <Col>จำนวนวันนี้</Col>
                    <Col>{dateLimit.limitToday}</Col>
                  </Row>
                  <Row className="gx-5">
                    <Col>จำนวนการใช้งาน</Col>
                    <Col>{count}</Col>
                  </Row>
                </>
              )}
              <Row>
                <Col>
                  {error && (
                    <>
                      <h1>{error}</h1>
                    </>
                  )}
                </Col>
              </Row>
            </Container>
            <input
              autoFocus={true}
              placeholder="Start Scanning"
              value={barcodeInputValue}
              onChange={onChangeBarcode}
              id="SearchbyScanning"
              className="SearchInput"
              onKeyDown={onKeyPressBarcode}
              onBlur={barcodeAutoFocus}
            />
            <br />
            <Button
              variant="danger"
              className="mt-2"
              onClick={() => {
                updateBarcodeInputValue("");
              }}
            >
              Clear Data
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Coupon;
