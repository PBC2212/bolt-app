// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AssetToken.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AssetTokenFactory
 * @dev Factory contract for creating asset tokens
 */
contract AssetTokenFactory is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    mapping(address => bool) public assetTokens;
    address[] public assetTokensList;
    mapping(address => address[]) public userAssets;

    event AssetTokenCreated(
        address indexed tokenAddress, 
        string name, 
        string symbol,
        string assetType,
        address indexed owner
    );

    constructor(address admin_) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(ADMIN_ROLE, admin_);
    }

    function createAssetToken(
        string memory name,
        string memory symbol,
        string memory assetType,
        string memory assetDescription,
        address user
    ) 
        external 
        onlyRole(ADMIN_ROLE)
        nonReentrant
        returns (address)
    {
        // Deploy new asset token
        AssetToken newToken = new AssetToken(
            name,
            symbol,
            _msgSender(),
            assetType,
            assetDescription
        );

        address tokenAddress = address(newToken);
        assetTokens[tokenAddress] = true;
        assetTokensList.push(tokenAddress);
        userAssets[user].push(tokenAddress);

        // Pledge the asset using the assetType string
        newToken.pledgeAsset(user, assetType);

        emit AssetTokenCreated(
            tokenAddress,
            name,
            symbol,
            assetType,
            user
        );

        return tokenAddress;
    }

    function approvePledge(address tokenAddress, address user) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(assetTokens[tokenAddress], "Token does not exist");
        AssetToken(tokenAddress).approvePledge(user);
    }

    function getAssetTokensCount() external view returns (uint256) {
        return assetTokensList.length;
    }

    function getUserAssets(address user) external view returns (address[] memory) {
        return userAssets[user];
    }

    function getUserAssetsCount(address user) external view returns (uint256) {
        return userAssets[user].length;
    }
}
