// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IJoKenPo.sol";

contract JKPAdapter {
    IJoKenPo private joKenPo;
    address public immutable owner;

    constructor() {
        owner = msg.sender;
    }

    function getContractAddress() external view returns (address) {
        return address(joKenPo);
    }

    function getResult() external view returns (string memory) {
        return joKenPo.getResult();
    }

    function getBid() external view upgraded returns (uint256) {
        return joKenPo.getBid();
    }

    function getCommission() external view upgraded returns (uint8) {
        return joKenPo.getCommission();
    }

    function setBid(uint256 _bid) external restricted upgraded {
        return joKenPo.setBid(_bid);
    }

    function setCommission(uint8 _commission) external restricted upgraded {
        return joKenPo.setCommission(_commission);
    }

    function getBalance() external view upgraded returns (uint) {
        return joKenPo.getBalance();
    }

    function play(JKPLibrary.Options newChoice) external payable {
        return joKenPo.play{value: msg.value}(newChoice);
    }

    function getLeaderboard()
        external
        view
        upgraded
        returns (JKPLibrary.Player[] memory)
    {
        return joKenPo.getLeaderboard();
    }

    function upgrade(address _contract) external restricted {
        require(_contract != address(0), "Empty address is not permitted");
        joKenPo = IJoKenPo(_contract);
    }

    modifier upgraded() {
        require(address(joKenPo) != address(0), "You must upgrade first");
        _;
    }

    modifier restricted() {
        require(msg.sender == owner, "You do not have permission");
        _;
    }
}
