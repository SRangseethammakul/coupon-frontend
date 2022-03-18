import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import PrivateRoute from "./guard/auth";
import { Provider } from "react-redux";
import NavBar from "./components/NavBar";
import CalendarPage from "./pages/CalendarPage";
import IndexPage from "./pages/IndexPage";
import RoomPage from "./pages/RoomPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import configureStore from "./redux/configureStore";
import Coupon from "./pages/Coupon";
import DateSetting from "./pages/DateSetting";
import Transaction from "./pages/Transaction";
import ChartCount from "./pages/ChartCount";
const { store } = configureStore();
function App() {
  return (
    <>
      <Provider store={store}>
        <ToastProvider
        autoDismiss
        >
          <Router>
            <NavBar />
            <Route exact path="/coupon">
              <Coupon />
            </Route>
            <Route exact path="/datesetting">
              <DateSetting />
            </Route>
            <Route exact path="/transaction">
              <Transaction />
            </Route>
            <Route exact path="/chart">
              <ChartCount />
            </Route>
            <Route exact path="/">
                <IndexPage />
              </Route>
            <Switch>
              <Route path="/schedule">
                <CalendarPage />
              </Route>
              <Route
                path="/room"
                render={({ match: { url } }) => (
                  <>
                    <Route path={`${url}/`} exact>
                      <RoomPage />
                    </Route>
                  </>
                )}
              ></Route>
              <PrivateRoute path="/register">
                <RegisterPage />
              </PrivateRoute>
              <Route path="/login">
                <LoginPage />
              </Route>
            </Switch>
          </Router>
        </ToastProvider>
      </Provider>
    </>
  );
}

export default App;
