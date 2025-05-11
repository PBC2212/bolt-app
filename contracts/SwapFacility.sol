// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./chainlink/interfaces/AggregatorV3Interface.sol";

contract SwapFacility is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    mapping(address => bool) public allowedTokens;
    mapping(address => AggregatorV3Interface) public tokenOracles;

    event Swapped(address indexed user, address indexed token, uint256 tokenAmount, uint256 bnbAmount);
    event TokenWhitelisted(address indexed token);
    event OracleSet(address indexed token, address indexed oracle);
    event TokenLocked(address indexed user, address indexed token, uint256 amount); // 🧊 Simulated burn

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    function addAllowedToken(address token) external onlyRole(ADMIN_ROLE) {
        require(token != address(0), "Invalid token address");
        allowedTokens[token] = true;
        emit TokenWhitelisted(token);
    }

    function setTokenOracle(address token, address oracle) external onlyRole(ADMIN_ROLE) {
        require(token != address(0), "Invalid token");
        require(oracle != address(0), "Invalid oracle");
        tokenOracles[token] = AggregatorV3Interface(oracle);
        emit OracleSet(token, oracle);
    }

    function getBNBAmountForToken(address token, uint256 tokenAmount) public view returns (uint256) {
        require(allowedTokens[token], "Token not allowed");
        AggregatorV3Interface oracle = tokenOracles[token];
        require(address(oracle) != address(0), "No oracle set");

        (, int256 price, , , ) = oracle.latestRoundData();
        require(price > 0, "Invalid price");

        uint256 price18 = uint256(price) * 1e10;

        return (tokenAmount * 1e18) / price18;
    }

    function swapTokenForBNB(address token, uint256 amount) external nonReentrant {
        require(allowedTokens[token], "Token not allowed");
        require(amount > 0, "Amount must be > 0");
        require(IERC20(token).allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");

        // 🔄 Transfer tokens from user to contract
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        // 🔒 Lock the tokens permanently in contract (no burn call)
        emit TokenLocked(msg.sender, token, amount);

        uint256 bnbAmount = getBNBAmountForToken(token, amount);
        require(address(this).balance >= bnbAmount, "Not enough BNB");

        // 💸 Send BNB to user
        (bool sent, ) = payable(msg.sender).call{value: bnbAmount}("");
        require(sent, "BNB transfer failed");

        emit Swapped(msg.sender, token, amount, bnbAmount);
    }

    receive() external payable {}
}
