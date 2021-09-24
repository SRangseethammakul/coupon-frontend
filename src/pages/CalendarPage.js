import React from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Modal,
  Button
} from "react-bootstrap";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import {BASE_URL} from "../config/index";
const api = axios.create({
  baseURL: `${BASE_URL}`,
});
const CalendarPage = () => {
  const MySwal = withReactContent(Swal);
  const [loading, setLoading] = React.useState(false);
  const [date, setDate] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [show, setShow] = React.useState(false);
  const [content, setContent] = React.useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const cancelToken = React.useRef(null);
  const getData = async () => {
    try {
      setLoading(true);
      const urlPath = `/booking`;
      const resp = await api.get(urlPath, {
        cancelToken: cancelToken.current.token,
      });
      setDate(resp.data.data);
    } catch (err) {
      setError(err.message);
      if (err.response) {
        console.log(err.response.data);
        setError(err.response.data.message);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        console.log(err.request);
        setError(err.request);
      } else {
        setError(err.message);
        console.log("Error", err.message);
      }
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
  if (error) {
    return (
      <div className="text-center mt-5">
        <p>Try Again</p>
        <p>{error}</p>
      </div>
    );
  }
  const handleEventClick = (info) => {
    setContent(info.event.extendedProps);
    handleShow();
  };
  const deleteBooking = (info) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "ต้องการยกเลิกการจองนี้ ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยกเลิกการจอง",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let bookingUrl = "booking/" + content.bookingId;
        const resp = await api.delete(bookingUrl);
        Swal.fire(resp.data.message, "Your file has been deleted.", "success");
        getData();
        handleClose();
      }
    });
  };

  return (
    <>
      <Container className="mt-5">
        <Row>
          <Col>
            <FullCalendar
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
                interactionPlugin,
              ]}
              themeSystem="bootstrap"
              initialView="dayGridMonth"
              weekends={false}
              eventClick={handleEventClick}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,listWeek",
              }}
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              }}
              events={date}
            />
          </Col>
        </Row>
      </Container>
      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>ห้องประชุม {content.roomName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12} md={3}>
                ผู้ทำการจอง
              </Col>
              <Col xs={6} md={9}>
                {content.customerName}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="outline-danger" onClick={deleteBooking}>
            ยกเลิกการจองนี้
          </Button>{" "}
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CalendarPage;
