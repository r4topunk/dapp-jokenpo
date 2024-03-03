/* eslint-disable jsx-a11y/anchor-is-valid */

import { useState } from "react"
import { doLogin } from "./Web3Service"

function Login() {
  const [message, setMessage] = useState("")

  function onBtnClick() {
    setMessage("Loggin in...")
    doLogin()
      .then((result) => alert(JSON.stringify(result)))
      .catch((err) => console.error(err))
  }
  return (
    <div className="cover-container d-flex h-100 p-3 mx-auto flex-column">
      <header className="mb-auto">
        <div>
          <h3 className="float-md-start mb-0">dApp JoKenPo</h3>
          <nav className="nav nav-masthead justify-content-center float-md-end">
            <a
              className="nav-link fw-bold py-1 px-0 active"
              aria-current="page"
              href="/"
            >
              Home
            </a>
            <a className="nav-link fw-bold py-1 px-0" href="/about">
              About
            </a>
          </nav>
        </div>
      </header>

      <main className="px-3">
        <h1>Log in and play with us</h1>
        <p
          className="lead"
          style={{ paddingInline: "64px", paddingBlock: "16px" }}
        >
          Play Rock-Paper-Scissors and earn prizes.
        </p>
        <p className="lead">
          <a
            href="#"
            className="btn btn-lg btn-light fw-bold border-white bg-white"
            onClick={onBtnClick}
          >
            <img
              src="/assets/metamask.svg"
              alt="MetaMask logo"
              width={28}
              style={{ marginRight: "8px" }}
            />
            Log in with Metamask
          </a>
        </p>

        <p className="lead">{message}</p>
      </main>

      <footer className="mt-auto text-white-50">
        <p>
          Built by{" "}
          <a href="https://twitter.com/r4topunk" className="text-white">
            @r4topunk
          </a>
          .
        </p>
      </footer>
    </div>
  )
}

export default Login
