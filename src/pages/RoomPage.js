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
// const token = JSON.parse(localStorage.getItem("token"));
// const URL_END_POINT = process.env.REACT_APP_API_ENDPOINT;
const api = axios.create({
  baseURL: `https://connectmeeting.herokuapp.com/apis/connect`,
  // headers: {'Authorization': 'Bearer '+ token.access_token}
  // baseURL: `https://50fa00a52754.ngrok.io/apis/connect`,
});
const RoomPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [rooms, setRoom] = React.useState([]);
  const [error, setError] = React.useState(null);
  const cancelToken = React.useRef(null);
  const handleRowUpdate = (newData, oldData, resolve) => {
    api
      .put("/room", {
        _id: newData._id,
        status: newData.status,
        name: newData.name,
      })
      .then((res) => {
        const dataUpdate = [...rooms];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        setRoom([...dataUpdate]);
        resolve();
      })
      .catch((error) => {
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
        resolve();
      });
  };

  const handleRowAdd = (newData, resolve) => {
    console.log(newData);
    api
      .post("/room", newData)
      .then((res) => {
        let dataToAdd = [...rooms];
        dataToAdd.push(newData);
        setRoom(dataToAdd);
        resolve();
      })
      .catch((error) => {
        setError(error.message);
        resolve();
      });
  };
  const getData = async () => {
    try {
      setLoading(true);
      const urlPath = `/room`;
      const resp = await api.get(urlPath, {
        // headers: {
        //   Authorization: "Bearer " + token.access_token,
        // },
        cancelToken: cancelToken.current.token,
      });
      setRoom(resp.data.data);
    } catch (error) {
      setError(error.message);
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
            <MaterialTable
              icons={tableIcons}
              title="rooms"
              columns={[
                { title: "id", field: "_id", editable: "never" ,hidden: true },
                { title: "name", field: "name" },
                {
                  title: "status",
                  field: "status",
                  lookup: { true: "ใช้งาน", false: "ปิดใช้งาน" },
                },
              ]}
              data={rooms}
              options={{
                filtering: true,
              }}
              editable={{
                onRowAdd: (newData) =>
                  new Promise((resolve) => {
                    handleRowAdd(newData, resolve);
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                    handleRowUpdate(newData, oldData, resolve);
                  }),
              }}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RoomPage;
