import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { expect } from "chai"
import { ethers } from "hardhat"

describe("JoKenPo Tests", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners()

    const JoKenPo = await ethers.getContractFactory("JoKenPo")
    const jokenpo = await JoKenPo.deploy()

    return { jokenpo, owner, otherAccount }
  }

  it("Should test", async function () {
    const { jokenpo, owner, otherAccount } = await loadFixture(deployFixture)
    expect(true).to.equal(true)
  })
})
