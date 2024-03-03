import { useEffect, useState } from "react"
import { Header } from "./Header"
import {
  Dashboard,
  getDashboard,
  setBid,
  setCommission,
  upgrade,
} from "./Web3Service"

function Admin() {
  const [message, setMessage] = useState("")
  const [dashboard, setDashboard] = useState<Dashboard>()

  useEffect(() => {
    getDashboard()
      .then((dashboard) => {
        console.log("dashboard", dashboard)
        return setDashboard(dashboard)
      })
      .catch((err) => setMessage(err.message))
  }, [])

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDashboard((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }))
  }

  function onUpgradeClick(): void {
    if (!dashboard?.address) return setMessage("Address is required")

    upgrade(dashboard.address)
      .then((tx) => setMessage("Success. Tx: " + tx))
      .catch((err) => setMessage(err.message))
  }

  function onChangeBidClick(): void {
    if (!dashboard?.bid) return setMessage("Bid is required")

    setBid(dashboard.bid)
      .then((tx) => setMessage("Success. Tx: " + tx))
      .catch((err) => setMessage(err.message))
  }

  function onChangeCommissionClick(): void {
    if (!dashboard?.commission) return setMessage("Commission is required")

    setCommission(dashboard.commission)
      .then((tx) => setMessage("Success. Tx: " + tx))
      .catch((err) => setMessage(err.message))
  }

  return (
    <div className="container">
      <Header />
      <main>
        <div className="py-5 text-center">
          <img
            className="d-block mx-auto mb-4"
            src="/logo512.png"
            alt="JoKenPo"
            width="72"
          />
          <h2>Administrative Panel</h2>
          <p className="lead">
            Change the players' bid, your commission and upgrade the contract.
          </p>
          <p className="lead text-danger">{message}</p>
        </div>
        <div className="col-md-8 col-lg-12">
          <div className="row">
            <div className="col-sm-6">
              <label htmlFor="bid" className="form-label">
                Bid (wei):
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  id="bid"
                  value={dashboard?.bid?.toString() || ""}
                  onChange={onInputChange}
                />
                <span className="input-group-text bg-secondary">wei</span>
                <button
                  type="button"
                  className="btn btn-primary d-inline-flex align-items-center"
                  onClick={onChangeBidClick}
                >
                  Change Bid
                </button>
              </div>
            </div>
            <div className="col-sm-6">
              <label htmlFor="commission" className="form-label">
                Commission (%):
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  id="commission"
                  value={dashboard?.commission?.toString() || ""}
                  onChange={onInputChange}
                />
                <span className="input-group-text bg-secondary">%</span>
                <button
                  type="button"
                  className="btn btn-primary d-inline-flex align-items-center"
                  onClick={onChangeCommissionClick}
                >
                  Change Commission
                </button>
              </div>
            </div>
          </div>
          <div className="row py-5">
            <div className="col-sm-12">
              <label htmlFor="address" className="form-label">
                New Contract (address):
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  value={dashboard?.address || ""}
                  onChange={onInputChange}
                />
                <button
                  type="button"
                  className="btn btn-primary d-inline-flex align-items-center"
                  onClick={onUpgradeClick}
                >
                  Upgrade Contract
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Admin
