import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { expect } from "chai"
import { ethers } from "hardhat"

describe("JoKenPo Tests", function () {
  enum Options {
    NONE,
    ROCK,
    PAPER,
    SCISSORS,
  }

  const DEFAULT_BID = ethers.parseEther("0.01")

  async function deployFixture() {
    const [owner, player1, player2] = await ethers.getSigners()

    const JoKenPo = await ethers.getContractFactory("JoKenPo")
    const jokenpo = await JoKenPo.deploy()

    return { jokenpo, owner, player1, player2 }
  }

  it("Should get leaderboard", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(
      deployFixture
    )

    const player1Instance = jokenpo.connect(player1)
    await player1Instance.play(Options.PAPER, { value: DEFAULT_BID })

    const player2Instance = jokenpo.connect(player2)
    await player2Instance.play(Options.ROCK, { value: DEFAULT_BID })

    const leaderboard = await jokenpo.getLeaderboard()

    expect(leaderboard.length).to.equal(1)
    expect(leaderboard[0].wins).to.equal(1n)
    expect(leaderboard[0].wallet).to.equal(player1.address)
  })

  describe("Bid", () => {
    it("Should set bid", async function () {
      const { jokenpo, owner, player1, player2 } = await loadFixture(
        deployFixture
      )

      const newBid = ethers.parseEther("0.02")

      await jokenpo.setBid(newBid)
      const updatedBid = await jokenpo.getBid()

      expect(updatedBid).to.equal(newBid)
    })

    it("Should NOT set bid (permission)", async function () {
      const { jokenpo, owner, player1, player2 } = await loadFixture(
        deployFixture
      )

      const instace = jokenpo.connect(player1)
      const newBid = ethers.parseEther("0.01")

      await expect(instace.setBid(newBid)).to.be.revertedWith(
        "You do not have permission"
      )
    })

    it("Should NOT set bid (game in progress)", async function () {
      const { jokenpo, owner, player1, player2 } = await loadFixture(
        deployFixture
      )

      const instace = jokenpo.connect(player1)
      await instace.play(Options.PAPER, { value: DEFAULT_BID })

      const newBid = ethers.parseEther("0.01")
      await expect(jokenpo.setBid(newBid)).to.be.revertedWith(
        "You cannot change the bid with a game in progress"
      )
    })
  })

  describe("Commision", () => {
    it("Should set commission", async function () {
      const { jokenpo, owner, player1, player2 } = await loadFixture(
        deployFixture
      )

      const newCommission = 11n

      await jokenpo.setCommission(newCommission)
      const updatedCommission = await jokenpo.getCommission()

      expect(updatedCommission).to.equal(newCommission)
    })

    it("Should NOT set commission (permission)", async function () {
      const { jokenpo, owner, player1, player2 } = await loadFixture(
        deployFixture
      )

      const instace = jokenpo.connect(player1)
      const newCommission = 11n

      await expect(instace.setCommission(newCommission)).to.be.revertedWith(
        "You do not have permission"
      )
    })

    it("Should NOT set commission (game in progress)", async function () {
      const { jokenpo, owner, player1, player2 } = await loadFixture(
        deployFixture
      )

      const instace = jokenpo.connect(player1)
      await instace.play(Options.PAPER, { value: DEFAULT_BID })

      const newCommission = 11n

      await expect(jokenpo.setCommission(newCommission)).to.be.revertedWith(
        "You cannot change the commission with a game in progress"
      )
    })
  })

  describe("Play", () => {
    it("Should play alone", async function () {
      const { jokenpo, owner, player1, player2 } = await loadFixture(
        deployFixture
      )

      const player1Instance = jokenpo.connect(player1)
      await player1Instance.play(Options.PAPER, { value: DEFAULT_BID })

      const result = await jokenpo.getResult()
      expect(result).to.equal(
        "Player 1 choose his/her option. Waiting player 2"
      )
    })

    it("Should play along", async function () {
      const { jokenpo, owner, player1, player2 } = await loadFixture(
        deployFixture
      )

      const player1Instance = jokenpo.connect(player1)
      await player1Instance.play(Options.PAPER, { value: DEFAULT_BID })

      const player2Instance = jokenpo.connect(player2)
      await player2Instance.play(Options.ROCK, { value: DEFAULT_BID })

      const result = await jokenpo.getResult()
      expect(result).to.equal("Paper wraps rock. Player 1 won")
    })

    it("Should NOT play alone (owner)", async function () {
      const { jokenpo, owner, player1, player2 } = await loadFixture(
        deployFixture
      )

      await expect(
        jokenpo.play(Options.PAPER, { value: DEFAULT_BID })
      ).to.revertedWith("The owner cannot play")
    })

    it("Should NOT play alone (invalid choice)", async function () {
      const { jokenpo, owner, player1, player2 } = await loadFixture(
        deployFixture
      )

      const instance = jokenpo.connect(player1)

      await expect(
        instance.play(Options.NONE, { value: DEFAULT_BID })
      ).to.revertedWith("Invalid choice")
    })

    it("Should NOT play alone (twice in a row)", async function () {
      const { jokenpo, owner, player1, player2 } = await loadFixture(
        deployFixture
      )

      const instance = jokenpo.connect(player1)
      await instance.play(Options.PAPER, { value: DEFAULT_BID })

      await expect(
        instance.play(Options.PAPER, { value: DEFAULT_BID })
      ).to.revertedWith("Wait the another player")
    })

    it("Should NOT play alone (invalid bid)", async function () {
      const { jokenpo, owner, player1, player2 } = await loadFixture(
        deployFixture
      )

      const instance = jokenpo.connect(player1)
      const newBid = ethers.parseEther("0.001")

      expect(newBid).to.be.lessThan(DEFAULT_BID)
      await expect(
        instance.play(Options.PAPER, { value: newBid })
      ).to.revertedWith("Invalid bid")
    })
  })
})
