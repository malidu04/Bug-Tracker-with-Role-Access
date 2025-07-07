import { Provider } from "react-redux";
import store from "./redux/store"; // Don't forget to import your store!
import Navbar from "./components/Navbar";
import Login from "./pages/Login";

function App() {
  return (
    <Provider store={store}>
      <>
        <Navbar />
        <Login />
      </>
    </Provider>
  );
}

export default App;
