import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { expect } from "chai"
import { ethers } from "hardhat"

describe("JoKenPo Adapter Tests", function () {
  enum Options {
    NONE,
    ROCK,
    PAPER,
    SCISSORS,
  }

  const DEFAULT_BID = ethers.parseEther("0.01")
  const DEFAULT_COMMISSION = 10n

  async function deployFixture() {
    const [owner, player1, player2] = await ethers.getSigners()

    const JoKenPo = await ethers.getContractFactory("JoKenPo")
    const jokenpo = await JoKenPo.deploy()

    const JKPAdapter = await ethers.getContractFactory("JKPAdapter")
    const jkpAdapter = await JKPAdapter.deploy()

    return { jokenpo, jkpAdapter, owner, player1, player2 }
  }

  it("Should get contract implementation address", async function () {
    const { jokenpo, jkpAdapter, owner, player1, player2 } = await loadFixture(
      deployFixture
    )

    const address = await jokenpo.getAddress()
    await jkpAdapter.upgrade(address)
    const implementationAddress = await jkpAdapter.getContractAddress()

    expect(address).to.equal(implementationAddress)
  })

  it("Should get bid", async function () {
    const { jokenpo, jkpAdapter, owner, player1, player2 } = await loadFixture(
      deployFixture
    )

    const address = await jokenpo.getAddress()
    await jkpAdapter.upgrade(address)

    const bid = await jkpAdapter.getBid()
    expect(bid).to.equal(DEFAULT_BID)
  })

  it("Should NOT get bid (upgraded) ", async function () {
    const { jokenpo, jkpAdapter, owner, player1, player2 } = await loadFixture(
      deployFixture
    )

    const address = await jokenpo.getAddress()
    await expect(jkpAdapter.getBid()).to.be.revertedWith(
      "You must upgrade first"
    )
  })

  it("Should get commission", async function () {
    const { jokenpo, jkpAdapter, owner, player1, player2 } = await loadFixture(
      deployFixture
    )

    const address = await jokenpo.getAddress()
    await jkpAdapter.upgrade(address)

    const commission = await jkpAdapter.getCommission()
    expect(commission).to.equal(DEFAULT_COMMISSION)
  })

  it("Should NOT get commission (upgraded) ", async function () {
    const { jokenpo, jkpAdapter, owner, player1, player2 } = await loadFixture(
      deployFixture
    )

    const address = await jokenpo.getAddress()
    await expect(jkpAdapter.getCommission()).to.be.revertedWith(
      "You must upgrade first"
    )
  })

  it("Should NOT upgrade (permission) ", async function () {
    const { jokenpo, jkpAdapter, owner, player1, player2 } = await loadFixture(
      deployFixture
    )

    const instace = jkpAdapter.connect(player1)
    await expect(instace.upgrade(jokenpo)).to.be.revertedWith(
      "You do not have permission"
    )
  })

  it("Should NOT upgrade (address) ", async function () {
    const { jokenpo, jkpAdapter, owner, player1, player2 } = await loadFixture(
      deployFixture
    )

    await expect(jkpAdapter.upgrade(ethers.ZeroAddress)).to.be.revertedWith(
      "Empty address is not permitted"
    )
  })

  it("Should play alone by adapter  ", async function () {
    const { jokenpo, jkpAdapter, owner, player1, player2 } = await loadFixture(
      deployFixture
    )

    await jkpAdapter.upgrade(jokenpo)

    const instance = jkpAdapter.connect(player1)
    await instance.play(Options.PAPER, { value: DEFAULT_BID })

    const result = await instance.getResult()
    expect(result).to.be.equal(
      "Player 1 choose his/her option. Waiting player 2"
    )
  })

  it("Should play along by adapter  ", async function () {
    const { jokenpo, jkpAdapter, owner, player1, player2 } = await loadFixture(
      deployFixture
    )

    await jkpAdapter.upgrade(jokenpo)

    const instance1 = jkpAdapter.connect(player1)
    await instance1.play(Options.PAPER, { value: DEFAULT_BID })

    const instance2 = jkpAdapter.connect(player2)
    await instance2.play(Options.ROCK, { value: DEFAULT_BID })

    const result = await instance1.getResult()

    expect(result).to.be.equal("Paper wraps rock. Player 1 won")
  })
})
