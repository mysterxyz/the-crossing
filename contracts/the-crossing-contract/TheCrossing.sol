// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract TheCrossing is ERC721, Ownable, EIP712 {
    using ECDSA for bytes32;

    /*
     * Tier system:
     *
     * Tier 1 = MASTER     = GOLD
     * Tier 2 = WAYFINDER  = SILVER
     * Tier 3 = PATHFINDER = BRONZE
     */

    bytes32 private constant MINT_TYPEHASH =
        keccak256("Mint(address to,uint8 tier)");

    uint256 private _nextTokenId = 1;

    address public authorizedSigner;

    // Wallet can mint only once.
    mapping(address => bool) public hasMinted;

    // Token ID => Tier
    mapping(uint256 => uint8) public tokenTier;

    // Tier => metadata URI
    mapping(uint8 => string) private _tierURIs;

    event NFTMinted(
        address indexed recipient,
        uint256 indexed tokenId,
        uint8 indexed tier
    );

    event AuthorizedSignerUpdated(
        address indexed oldSigner,
        address indexed newSigner
    );

    event TierURIUpdated(
        uint8 indexed tier,
        string newURI
    );

    constructor(
        address initialSigner
    )
        ERC721("The Crossing", "CROSSING")
        Ownable(msg.sender)
        EIP712("The Crossing", "2")
    {
        require(
            initialSigner != address(0),
            "Invalid signer"
        );

        authorizedSigner = initialSigner;
    }

    /**
     * @notice Mint NFT after successfully completing The Crossing.
     *
     * Tier:
     * 1 = MASTER
     * 2 = WAYFINDER
     * 3 = PATHFINDER
     *
     * The tier is protected by the authorized signer's EIP-712 signature.
     */
    function mint(
        uint8 tier,
        bytes calldata signature
    ) external {
        address recipient = msg.sender;

        require(
            !hasMinted[recipient],
            "Wallet already owns The Crossing NFT"
        );

        require(
            tier >= 1 && tier <= 3,
            "Invalid tier"
        );

        bytes32 structHash = keccak256(
            abi.encode(
                MINT_TYPEHASH,
                recipient,
                tier
            )
        );

        bytes32 digest = _hashTypedDataV4(structHash);

        address recoveredSigner = digest.recover(signature);

        require(
            recoveredSigner == authorizedSigner,
            "Invalid completion signature"
        );

        hasMinted[recipient] = true;

        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        tokenTier[tokenId] = tier;

        _safeMint(recipient, tokenId);

        emit NFTMinted(
            recipient,
            tokenId,
            tier
        );
    }

    /**
     * @notice Set metadata URI for a specific tier.
     *
     * Tier 1 = MASTER / GOLD
     * Tier 2 = WAYFINDER / SILVER
     * Tier 3 = PATHFINDER / BRONZE
     */
    function setTierURI(
        uint8 tier,
        string calldata newURI
    ) external onlyOwner {
        require(
            tier >= 1 && tier <= 3,
            "Invalid tier"
        );

        _tierURIs[tier] = newURI;

        emit TierURIUpdated(
            tier,
            newURI
        );
    }

    /**
     * @notice Get metadata URI assigned to a tier.
     */
    function tierURI(
        uint8 tier
    ) external view returns (string memory) {
        require(
            tier >= 1 && tier <= 3,
            "Invalid tier"
        );

        return _tierURIs[tier];
    }

    /**
     * @notice Return NFT metadata URI based on its tier.
     */
    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override
        returns (string memory)
    {
        require(
            _ownerOf(tokenId) != address(0),
            "URI query for nonexistent token"
        );

        uint8 tier = tokenTier[tokenId];

        return _tierURIs[tier];
    }

    /**
     * @notice Change the authorized signer.
     */
    function setAuthorizedSigner(
        address newSigner
    ) external onlyOwner {
        require(
            newSigner != address(0),
            "Invalid signer"
        );

        address oldSigner = authorizedSigner;

        authorizedSigner = newSigner;

        emit AuthorizedSignerUpdated(
            oldSigner,
            newSigner
        );
    }

    /**
     * @notice Returns the next token ID.
     */
    function nextTokenId()
        external
        view
        returns (uint256)
    {
        return _nextTokenId;
    }

    /**
     * @notice Check whether wallet can mint.
     */
    function canMint(
        address wallet
    ) external view returns (bool) {
        return !hasMinted[wallet];
    }

    /**
     * @notice Get tier of an NFT.
     */
    function getTokenTier(
        uint256 tokenId
    ) external view returns (uint8) {
        require(
            _ownerOf(tokenId) != address(0),
            "Token does not exist"
        );

        return tokenTier[tokenId];
    }
}