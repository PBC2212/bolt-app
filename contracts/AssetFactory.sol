// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AssetToken.sol";

contract AssetFactory {
    address public owner;
    AssetToken[] public allTokens;

    event AssetTokenCreated(address tokenAddress, string name, string symbol, string assetType, string assetDescription);

    constructor() {
        owner = msg.sender;
    }

    function createAssetToken(
        string memory _name,
        string memory _symbol,
        address _admin,
        string memory _assetType,
        string memory _assetDescription
    ) external returns (address) {
        require(msg.sender == owner, "Only owner can create");
        AssetToken newToken = new AssetToken(_name, _symbol, _admin, _assetType, _assetDescription);
        allTokens.push(newToken);
        emit AssetTokenCreated(address(newToken), _name, _symbol, _assetType, _assetDescription);
        return address(newToken);
    }

    function getAllTokens() external view returns (AssetToken[] memory) {
        return allTokens;
    }
}

