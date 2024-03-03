import Web3 from "web3"
import ABI from "./abi.json"

type LoginResult = {
  account: string
  isAdmin: boolean
}

async function doLogin(): Promise<LoginResult> {
  if (!window.ethereum) throw new Error("No MetaMask found.")

  const web3 = new Web3(window.ethereum)
  const accounts = await web3.eth.requestAccounts()

  if (!accounts || !accounts.length)
    throw new Error("Wallet not found/allowed.")

  const contract = new web3.eth.Contract(
    ABI,
    process.env.REACT_APP_CONTRACT_ADDRESS,
    { from: accounts[0] }
  )
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
