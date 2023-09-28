// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract IdentityManagement {
    struct User {
        bytes32 username;
        bool exists;
    }

    mapping(address => User) public users;
    mapping(bytes32 => address) public usernames;

    event UserRegistered(address indexed userAddress, string username);

    modifier usernameAvailable(string memory username) {
        bytes32 usernameHash = keccak256(abi.encodePacked(username));
        require(!usernamesExist(usernameHash), "Username already exists");
        _;
    }

    modifier userNotRegistered() {
        require(!isUserRegistered(msg.sender), "User is already registered");
        _;
    }

    function registerUser(string memory username)
        public
        userNotRegistered
        usernameAvailable(username)
    {
        User storage user = users[msg.sender];
        user.username = keccak256(abi.encodePacked(username)); // Store the username as a hash
        user.exists = true;
        usernames[user.username] = msg.sender;
        emit UserRegistered(msg.sender, username);
    }

    function isUserRegistered(address userAddress) public view returns (bool) {
        return users[userAddress].exists;
    }

    function usernamesExist(bytes32 username) public view returns (bool) {
        return usernames[username] != address(0);
    }

    function authenticateUser() public view returns (string memory) {
        require(isUserRegistered(msg.sender), "User is not registered");
        return bytes32ToString(users[msg.sender].username);
    }

    function bytes32ToString(bytes32 data) internal pure returns (string memory) {
        bytes memory bytesData = new bytes(32);
        for (uint256 i = 0; i < 32; i++) {
            bytesData[i] = data[i];
        }
        return string(bytesData);
    }
}