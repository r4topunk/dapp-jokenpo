// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IJoKenPo.sol";

contract JKPAdapter {
    IJoKenPo private joKenPo;
    address public immutable owner;

    constructor() {
        owner = msg.sender;
    }

    function upgrade(address _contract) external {
        require(msg.sender == owner, "You do not have permission");
        require(_contract != address(0), "Empty address is not permitted");
        joKenPo = IJoKenPo(_contract);
    }
}
