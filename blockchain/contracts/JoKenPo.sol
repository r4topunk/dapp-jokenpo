// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IJoKenPo.sol";

contract JoKenPo is IJoKenPo {
    Options private choice1 = Options.NONE;
    address private player1;
    string private result = "";
    uint256 private bid = 0.01 ether;
    uint8 private comission = 10; // percent

    address payable private immutable owner;

    Player[] public players;

    constructor() {
        owner = payable(msg.sender);
    }

    function getResult() external view returns (string memory) {
        return result;
    }

    function getBid() external view returns (uint256) {
        return bid;
    }

    function getComission() external view returns (uint8) {
        return comission;
    }

    function setBid(uint256 _bid) external {
        require(msg.sender == owner, "You do not have permission");
        require(
            player1 == address(0),
            "You cannot change the bid with a game in progress"
        );
        bid = _bid;
    }

    function setComission(uint8 _comission) external {
        require(msg.sender == owner, "You do not have permission");
        require(
            player1 == address(0),
            "You cannot change the comission with a game in progress"
        );
        comission = _comission;
    }

    function updateWinner(address winner) private {
        for (uint i = 0; i < players.length; i++) {
            if (players[i].wallet == winner) {
                players[i].wins++;
                return;
            }
        }

        players.push(Player(winner, 1));
    }

    function finishGame(string memory newResult, address winner) private {
        address contractAddress = address(this);
        payable(winner).transfer(
            (contractAddress.balance / 100) * (100 - comission)
        );
        owner.transfer(contractAddress.balance);

        updateWinner(winner);

        result = newResult;
        player1 = address(0);
        choice1 = Options.NONE;
    }

    function getBalance() external view returns (uint) {
        require(owner == msg.sender, "You do not have this permission");
        return address(this).balance;
    }

    function play(Options newChoice) external payable {
        require(msg.sender != owner, "The owner cannot play");
        require(newChoice != Options.NONE, "Invalid choice");
        require(player1 != msg.sender, "Wait the another player");
        require(msg.value >= bid, "Invalid bid");

        if (choice1 == Options.NONE) {
            player1 = msg.sender;
            choice1 = newChoice;
            result = "Player 1 choose his/her option. Waiting player 2";
        } else if (choice1 == Options.ROCK && newChoice == Options.SCISSORS)
            finishGame("Rock breaks scissors. Player 1 won", player1);
        else if (choice1 == Options.PAPER && newChoice == Options.ROCK)
            finishGame("Paper wraps rock. Player 1 won", player1);
        else if (choice1 == Options.SCISSORS && newChoice == Options.PAPER)
            finishGame("Scissors cuts paper. Player 1 won", player1);
        else if (choice1 == Options.SCISSORS && newChoice == Options.ROCK)
            finishGame("Rock breaks scissors. Player 2 won", msg.sender);
        else if (choice1 == Options.ROCK && newChoice == Options.PAPER)
            finishGame("Paper wraps rock. Player 2 won", msg.sender);
        else if (choice1 == Options.PAPER && newChoice == Options.SCISSORS)
            finishGame("Scissors cuts paper. Player 2 won", msg.sender);
        else {
            result = "Draw game. The prize was doubled";
            player1 = address(0);
            choice1 = Options.NONE;
        }
    }

    function getLeaderboard() external view returns (Player[] memory) {
        if (players.length <= 1) return players;

        Player[] memory arr = new Player[](players.length);
        for (uint i = 0; i < players.length; i++) arr[i] = players[i];

        for (uint i = 0; i < arr.length - 1; i++) {
            for (uint j = 1; j < arr.length; j++) {
                if (arr[i].wins < arr[j].wins) {
                    Player memory change = arr[i];
                    arr[i] = arr[j];
                    arr[j] = change;
                }
            }
        }

        return arr;
    }
}
