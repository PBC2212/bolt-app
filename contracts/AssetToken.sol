// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./chainlink/interfaces/AggregatorV3Interface.sol";

contract AssetToken is ERC20Burnable, AccessControl, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    string public assetType;
    string public assetDescription;

    mapping(string => address) public assetTypeToOracle;
    mapping(address => uint256) public pledgedValue;
    mapping(address => PledgeStatus) public pledgeStatus;

    enum PledgeStatus { Pending, Approved, Rejected }

    event AssetPledged(address indexed user, string assetType, uint256 value);
    event PledgeStatusChanged(address indexed user, PledgeStatus status);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount); // ✅ Burn log for all burns
    event OracleUpdated(string indexed assetType, address indexed oracleAddress);

    constructor(
        string memory name_,
        string memory symbol_,
        address admin_,
        string memory _assetType,
        string memory _assetDescription
    ) ERC20(name_, symbol_) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(ADMIN_ROLE, admin_);
        _grantRole(MINTER_ROLE, admin_);

        assetType = _assetType;
        assetDescription = _assetDescription;
    }

    function setOracle(string memory _assetType, address _oracleAddress)
        external
        onlyRole(ADMIN_ROLE)
    {
        require(_oracleAddress != address(0), "Invalid oracle address");
        assetTypeToOracle[_assetType] = _oracleAddress;
        emit OracleUpdated(_assetType, _oracleAddress);
    }

    function getLatestPrice(string memory _assetType) public view returns (int256) {
        address oracleAddress = assetTypeToOracle[_assetType];
        require(oracleAddress != address(0), "Oracle not set for asset type");

        AggregatorV3Interface priceFeed = AggregatorV3Interface(oracleAddress);
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }

    function pledgeAsset(address user, string memory _assetType)
        external
        onlyRole(ADMIN_ROLE)
    {
        int256 livePrice = getLatestPrice(_assetType);
        require(livePrice > 0, "Invalid live price");

        uint256 pledgeValueInDollars = uint256(livePrice) / 1e8;
        pledgedValue[user] = pledgeValueInDollars;
        pledgeStatus[user] = PledgeStatus.Pending;

        emit AssetPledged(user, _assetType, pledgeValueInDollars);
    }

    function approvePledge(address user)
        external
        onlyRole(ADMIN_ROLE)
        nonReentrant
    {
        require(pledgeStatus[user] == PledgeStatus.Pending, "Pledge not pending");

        uint256 tokensToMint = pledgedValue[user] * 1e18;
        require(tokensToMint > 0, "Nothing to mint");

        pledgeStatus[user] = PledgeStatus.Approved;
        delete pledgedValue[user];

        _mint(user, tokensToMint);

        emit PledgeStatusChanged(user, PledgeStatus.Approved);
        emit TokensMinted(user, tokensToMint);
    }

    function mint(address to, uint256 amount)
        external
        onlyRole(ADMIN_ROLE)
    {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function burnTokens(address from, uint256 amount)
        external
        onlyRole(ADMIN_ROLE)
        nonReentrant
    {
        require(balanceOf(from) >= amount, "Insufficient balance");
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }

    // ✅ Secure burn used by SwapFacility with balance check
    function secureBurnFrom(address from, uint256 amount)
        external
        onlyRole(MINTER_ROLE)
    {
        require(balanceOf(from) >= amount, "Insufficient balance to burn");
        emit TokensBurned(from, amount);
        _burn(from, amount);
    }
}
