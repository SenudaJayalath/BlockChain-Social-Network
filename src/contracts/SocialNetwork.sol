pragma solidity ^0.5.0;

contract SocialNetwork {
    string public name;
    uint256 public postCount = 0;
    mapping(uint256 => Post) public posts;
    struct Post {
        uint256 id;
        string content;
        uint256 tipAmount;
        address author;
    }

    event PostCreated(
        uint256 id,
        string content,
        uint256 tipAmount,
        address author
    );

    constructor() public {
        name = "Dapp Uniersity Social Network";
    }

    function createPost(string memory _content) public {
        require(bytes(_content).length > 0);
        postCount++;
        posts[postCount] = Post(postCount, _content, 0, msg.sender);

        //Trigger an event

        emit PostCreated(postCount, _content, 0, msg.sender);
    }
}
