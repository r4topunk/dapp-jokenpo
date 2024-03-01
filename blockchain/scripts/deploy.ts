import { ethers } from "hardhat"

async function main() {
  const contract = await ethers.deployContract("JoKenPo")

  await contract.waitForDeployment()
  const address = await contract.getAddress()

  console.log(`Contract deployed at ${address}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
