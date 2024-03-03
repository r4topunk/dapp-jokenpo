import Web3, { Contract } from "web3"
import ABI from "./abi.json"

const ADAPTER_ADDRESS = `${process.env.REACT_APP_CONTRACT_ADDRESS}`

function getWeb3(): Web3 {
  if (!window.ethereum) throw new Error("No MetaMask found.")
  return new Web3(window.ethereum)
}

function getContract(web3?: Web3): Contract<typeof ABI> {
  if (!web3) web3 = getWeb3()
  return new web3.eth.Contract(ABI, ADAPTER_ADDRESS, {
    from: localStorage.getItem("account") || undefined,
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

  localStorage.setItem("account", accounts[0])
  localStorage.setItem("isAdmin", `${accounts[0] === ownerAddress}`)

  return {
    account: accounts[0],
    isAdmin: isAdmin,
  } as LoginResult
}

export { doLogin }
