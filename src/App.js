import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import PrivateRoute from "./guard/auth";
import { Provider } from "react-redux";
import NavBar from "./components/NavBar";
import CalendarPage from "./pages/CalendarPage";
import CreatePage from "./pages/CreatePage";
import IndexPage from "./pages/IndexPage";
import RoomPage from "./pages/RoomPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import configureStore from "./redux/configureStore";
import CustomerPage from "./pages/CustomerPage";
import SuccessPage from "./pages/SuccessPage";
const { store } = configureStore();
function App() {
  return (
    <>
      <Provider store={store}>
        <ToastProvider>
          <Router>
            <NavBar />
            <Switch>
              <PrivateRoute exact path="/">
                <IndexPage />
              </PrivateRoute>
              <PrivateRoute path="/schedule">
                <CalendarPage />
              </PrivateRoute>

              <Route
                path="/room"
                render={({ match: { url } }) => (
                  <>
                    <PrivateRoute path={`${url}/`} exact>
                      <RoomPage />
                    </PrivateRoute>
                    <Route path={`${url}/create`} exact>
                      <CreatePage />
                    </Route>
                    <Route path={`${url}/edit/:id`} exact>
                      <CreatePage />
                    </Route>
                  </>
                )}
              ></Route>
              <Route path="/register">
                <RegisterPage />
              </Route>
              <Route path="/login">
                <LoginPage />
              </Route>
              <Route path="/customer">
                <CustomerPage />
              </Route>
              <Route path="/success">
                <SuccessPage />
              </Route>
            </Switch>
          </Router>
        </ToastProvider>
      </Provider>
    </>
  );
}

export default App;
