import React, { forwardRef } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import MaterialTable from "material-table";
import axios from "axios";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import { BASE_URL } from "../config/index";
const api = axios.create({
  baseURL: `${BASE_URL}/transaction_infomation`,
});
const Transaction = () => {
  const MySwal = withReactContent(Swal);
  const [loading, setLoading] = React.useState(false);
  const [transactions, setTransaction] = React.useState([]);
  const [error, setError] = React.useState(null);
  const cancelToken = React.useRef(null);
  const history = useHistory();
  const profileValue = JSON.parse(localStorage.getItem("token"));
  const getData = async () => {
    try {
      setLoading(true);
      const urlPath = `/`;
      const resp = await api.get(urlPath, {
        cancelToken: cancelToken.current.token,
        headers: {
          Authorization: "Bearer " + profileValue.access_token,
        },
      });
      setTransaction(resp.data.data);
    } catch (err) {
      console.log(err.response);
      if (err.response.status === 401) {
        history.replace("/login");
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchData = async () => {
    try {
      setLoading(true);
      const startDate = document.getElementById("startDate");
      const endDate = document.getElementById("endDate");
      if (!startDate.value && !endDate.value) {
        MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please insert start date and end date",
          showConfirmButton: false,
          timer: 1500,
        });
        return 0;
      }
      if (!startDate.value) {
        MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please insert start date",
          showConfirmButton: false,
          timer: 1500,
        });
        return 0;
      }
      if (!endDate.value) {
        MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please end date",
          showConfirmButton: false,
          timer: 1500,
        });
        return 0;
      }
      const urlPath = `/searchByDate`;
      const resp = await api.get(urlPath, {
        params: {
          startDate: startDate.value,
          endDate: endDate.value,
        },
        cancelToken: cancelToken.current.token,
        headers: {
          Authorization: "Bearer " + profileValue.access_token,
        },
      });
      setTransaction(resp.data.data);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  };
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
        <Row>
          <Col>
            <div>
              <label htmlFor="birthday">Start Search:</label>
              <input type="date" id="startDate" name="startDate" />
            </div>
          </Col>
          <Col>
            <div>
              <label htmlFor="birthday">End Search:</label>
              <input type="date" id="endDate" name="endDate" />
            </div>
          </Col>
          <Col>
            <button
              className="btn btn-outline-success ml-2"
              onClick={() => searchData()}
            >
              Search by date
            </button>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <MaterialTable
              icons={tableIcons}
              title="transactions"
              columns={[
                { title: "id", field: "_id", hidden: true },
                { title: "employeeId", field: "employeeId" },
                {
                  title: "buCode",
                  field: "buCode",
                },
                {
                  title: "datetime",
                  field: "datetime",
                },
              ]}
              data={transactions}
              options={{
                exportButton: {
                  csv: true,
                  pdf: false,
                },
                filtering: true,
              }}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Transaction;
