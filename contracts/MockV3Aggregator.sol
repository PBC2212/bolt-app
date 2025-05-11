// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockV3Aggregator {
    int256 public latestAnswer;

    constructor(int256 _initialAnswer) {
        latestAnswer = _initialAnswer;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80, int256, uint256, uint256, uint80
        )
    {
        return (0, latestAnswer, 0, 0, 0);
    }

    function updateAnswer(int256 _newAnswer) external {
        latestAnswer = _newAnswer;
    }
}
