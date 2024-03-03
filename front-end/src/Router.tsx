import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Admin from "./Admin"
import App from "./App"
import Login from "./Login"

function Router() {
  type Props = {
    children: JSX.Element
  }

  function PrivateRoute({ children }: Props) {
    const isAuth = localStorage.getItem("account") !== null
    return isAuth ? children : <Navigate to="/" />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <App />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
