import Web3, { Contract } from "web3"
import ABI from "./abi.json"

const ADAPTER_ADDRESS = `${process.env.REACT_APP_CONTRACT_ADDRESS}`
const LS_KEY_ACCOUNT = "account"
const LS_KEY_IS_ADMIN = "isAdmin"

function getWeb3(): Web3 {
  if (!window.ethereum) throw new Error("No MetaMask found.")
  return new Web3(window.ethereum)
}

function getContract(web3?: Web3): Contract<typeof ABI> {
  if (!web3) web3 = getWeb3()
  return new web3.eth.Contract(ABI, ADAPTER_ADDRESS, {
    from: localStorage.getItem(LS_KEY_ACCOUNT) || undefined,
  })
}

type LoginResult = {
  account: string
  isAdmin: boolean
}

async function doLogin(): Promise<LoginResult> {
  const web3 = new Web3(window.ethereum)
  const accounts = await web3.eth.requestAccounts()

  if (!accounts || !accounts.length)
    throw new Error("Wallet not found/allowed.")

  const contract = getContract(web3)
  const ownerAddress = (await contract.methods.owner().call()) as string
  const isAdmin = ownerAddress.toLowerCase() === accounts[0].toLowerCase()

  localStorage.setItem(LS_KEY_ACCOUNT, accounts[0])
  localStorage.setItem(LS_KEY_IS_ADMIN, `${accounts[0] === ownerAddress}`)

  return {
    account: accounts[0],
    isAdmin: isAdmin,
  } as LoginResult
}

function doLogout() {
  localStorage.removeItem(LS_KEY_ACCOUNT)
  localStorage.removeItem(LS_KEY_IS_ADMIN)
}

function getLocalAccount() {
  return localStorage.getItem(LS_KEY_ACCOUNT)
}

function getLocalIsAdmin() {
  return localStorage.getItem(LS_KEY_IS_ADMIN) === "true"
}

export { doLogin, doLogout, getLocalAccount, getLocalIsAdmin }
