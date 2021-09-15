import React from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import axios from "axios";
// const token = JSON.parse(localStorage.getItem("token"));
const api = axios.create({
  baseURL: `https://connectmeeting.herokuapp.com/apis`,
  // headers: {'Authorization': 'Bearer '+ token.access_token}
  // baseURL: `https://50fa00a52754.ngrok.io/apis`,
});
const CalendarPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [date, setDate] = React.useState(null);
  const [error, setError] = React.useState(null);
  const cancelToken = React.useRef(null);
  const getData = async () => {
    try {
      setLoading(true);
      const urlPath = `/connect`;
      const resp = await api.get(urlPath, {
        // headers: {
        //   Authorization: "Bearer " + token.access_token,
        // },
        cancelToken: cancelToken.current.token,
      });
      setDate(resp.data.data);
    } catch (error) {
      setError(error.message);
      if (error.response) {
        console.log(error.response.data);
        setError(error.response.data.message);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
        setError(error.request);
      } else {
        setError(error.message);
        console.log("Error", error.message);
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
    console.log(info.event.extendedProps);
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
    </>
  );
};

export default CalendarPage;
