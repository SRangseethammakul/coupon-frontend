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
  const checkAs = /^[0-9a-zA-Z_]+$/;
  const [message, setMessage] = React.useState(null);
  const [employee, setEmployee] = React.useState(null);
  const [dateLimit, setDateLimit] = React.useState({});
  const [send, setSend] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [count, setCount] = React.useState(null);
  const cancelToken = React.useRef(null);
  const [barcodeInputValue, updateBarcodeInputValue] = React.useState("");
  const checkKeyBoard = (value) => {
    return new Promise((resolve, reject) => {
      if (value.match(checkAs) === null) {
        reject(false);
      }
      resolve(true);
    });
  };
  const sendCode = async (value) => {
    try {
      await checkKeyBoard(value);
      const resp = await api.post("/transaction", { employeeId: value });
      const { message: messageResponse, count:countResponse, detail } = resp.data;
      addToast(message, { appearance: "success" });
      setCount(countResponse);
      setMessage(messageResponse);
      setEmployee(detail.employeeId);
      updateBarcodeInputValue("");
    } catch (err) {
      if(err){
        addToast(err.response.data.error.message, { appearance: "error" });
        setMessage(err.response.data.error.message);
      }else{
        addToast("กรุณาเปลี่ยนภาษา", { appearance: "error" });
        setMessage("กรุณาเปลี่ยนภาษา");
      }
      setEmployee("");

    } finally {
      setSend(false);
      barcodeAutoFocus();
      updateBarcodeInputValue("");
    }
  };
  const onKeyPressBarcode = (event) => {
    try {
      if (event.keyCode === 13) {
        setSend(true);
        setEmployee("");
        setMessage("");
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
      setMessage(err.message);
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
                    <Col>
                      <h1 className="display-4">วัน</h1>
                    </Col>
                    <Col>
                      <h1 className="display-4">{dateLimit.day}</h1>
                    </Col>
                  </Row>
                  <Row className="gx-5">
                    <Col>
                      <h1 className="display-4">โควต้าวันนี้</h1>
                    </Col>
                    <Col>
                      <h1 className="display-4">{dateLimit.limitToday}</h1>
                    </Col>
                  </Row>
                  <Row className="gx-5">
                    <Col>
                      <h1 className="display-4">จำนวนการใช้งาน</h1>
                    </Col>
                    <Col>
                      <h1 className="display-4">{count}</h1>
                    </Col>
                  </Row>
                  <Row className="gx-5">
                    <Col>
                      <h1 className="display-5">สถานะ</h1>
                    </Col>
                    <Col>
                      {message && (
                        <>
                          <h1 className="display-5">{message}</h1>
                        </>
                      )}
                    </Col>
                  </Row>
                  <Row className="gx-5">
                    <Col>
                      <h1 className="display-5">รหัสพนังงาน : </h1>
                    </Col>
                    <Col>
                      {employee && (
                        <>
                          <h1 className="display-5">{employee}</h1>
                        </>
                      )}
                    </Col>
                  </Row>
                </>
              )}
            </Container>
            <input
              autoFocus={true}
              disabled={send}
              placeholder="Start Scanning"
              value={barcodeInputValue}
              onChange={onChangeBarcode}
              id="SearchbyScanning"
              className="form-control"
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
