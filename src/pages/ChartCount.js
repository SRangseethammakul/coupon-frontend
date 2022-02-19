import React from "react";
import axios from "axios";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useHistory } from "react-router-dom";
import { BASE_URL } from "../config";
const api = axios.create({
  baseURL: `${BASE_URL}/transaction_infomation`,
});
const ChartCount = () => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [dataByBu, setDataByBu] = React.useState([]);
  const [error, setError] = React.useState(null);
  const cancelToken = React.useRef(null);
  const history = useHistory();
  const profileValue = JSON.parse(localStorage.getItem("token"));
  const getData = async () => {
    try {
      setLoading(true);
      const urlPath = `/countperdate`;
      const resp = await api.get(urlPath, {
        cancelToken: cancelToken.current.token,
        headers: {
          Authorization: "Bearer " + profileValue.access_token,
        },
      });
      setData(resp.data.data);
      setDataByBu(resp.data.transactionbybus);
    } catch (err) {
      if (err.response.status === 401) {
        history.replace("/login");
      }
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
      {data && (
        <>
          <Container className="mt-3">
            <Row>
              <Col>
                <LineChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="number"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
                <h2 className="text-center">Per Day</h2>
              </Col>
              <Col>
                <LineChart
                  width={500}
                  height={300}
                  data={dataByBu}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="number"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
                <h2 className="text-center">Per Units</h2>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
};

export default ChartCount;
