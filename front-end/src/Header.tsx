import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  doLogin,
  doLogout,
  getLocalAccount,
  getLocalIsAdmin,
} from "./Web3Service"

function Header() {
  const navigate = useNavigate()

  useEffect(() => {
    if (getLocalAccount() !== null) {
      if (getLocalIsAdmin()) {
        doLogin()
          .then((result) => {
            if (!result.isAdmin) {
              localStorage.setItem("isAdmin", "false")
              navigate("/app")
            }
          })
          .catch((err) => {
            console.error(err)
            onLogoutClick()
          })
      } else navigate("/app")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onLogoutClick() {
    doLogout()
    navigate("/")
  }

  return (
    <header className="d-flex flex-wrap justify-content-center py-3 mb-4">
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
      >
        <span className="fs-4 text-light">dApp JoKenPo</span>
      </a>

      <div className="col-md-3 text-end">
        <button
          onClick={onLogoutClick}
          type="button"
          className="btn btn-outline-danger me-2"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export { Header }
