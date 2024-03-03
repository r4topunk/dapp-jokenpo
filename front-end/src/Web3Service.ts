import Web3, { Contract } from "web3"
import { AbiType } from "./AbiType"
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
  return new web3.eth.Contract(ABI as AbiType, ADAPTER_ADDRESS, {
    from: localStorage.getItem(LS_KEY_ACCOUNT) || undefined,
  })
}

type LoginResult = {
  account: string
  isAdmin: boolean
}

export async function doLogin(): Promise<LoginResult> {
  const web3 = new Web3(window.ethereum)
  const accounts = await web3.eth.requestAccounts()

  if (!accounts || !accounts.length)
    throw new Error("Wallet not found/allowed.")

  const contract = getContract(web3)
  const ownerAddress = (await contract.methods.owner().call()) as string
  const isAdmin = ownerAddress.toLowerCase() === accounts[0].toLowerCase()

  localStorage.setItem(LS_KEY_ACCOUNT, accounts[0])
  localStorage.setItem(LS_KEY_IS_ADMIN, `${isAdmin}`)

  return {
    account: accounts[0],
    isAdmin: isAdmin,
  } as LoginResult
}

export function doLogout() {
  localStorage.removeItem(LS_KEY_ACCOUNT)
  localStorage.removeItem(LS_KEY_IS_ADMIN)
}

export function getLocalAccount() {
  return localStorage.getItem(LS_KEY_ACCOUNT)
}

export function getLocalIsAdmin() {
  return localStorage.getItem(LS_KEY_IS_ADMIN) === "true"
}

export type Dashboard = {
  bid?: string
  commission?: number
  address?: string
}

export async function getDashboard(): Promise<Dashboard> {
  const contract = getContract()
  const address = (await contract.methods.getContractAddress().call()) as string

  if (/^(0x0)+$/.test(address))
    return {
      bid: Web3.utils.toWei("0.01", "ether"),
      commission: 10,
      address,
    } as Dashboard

  const bid = await contract.methods.getBid().call()
  const commission = await contract.methods.getCommission().call()

  return {
    bid,
    commission,
    address,
  } as Dashboard
}

export async function upgrade(newContract: string) {
  const contract = getContract()
  const tx = await contract.methods.upgrade(newContract).send()
  return tx.transactionHash
}

export async function setCommission(newCommission: number) {
  const contract = getContract()
  const tx = await contract.methods.setCommission(newCommission).send()
  return tx.transactionHash
}

export async function setBid(newBid: string) {
  const contract = getContract()
  const tx = await contract.methods.setBid(newBid).send()
  return tx.transactionHash
}
