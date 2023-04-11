// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ERC721AppStoreStorageUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract AppStoreNFTUpgradeable is Initializable, ERC721Upgradeable, ERC721EnumerableUpgradeable, 
                    ERC721URIStorageUpgradeable, PausableUpgradeable, OwnableUpgradeable, 
                        ERC721BurnableUpgradeable, UUPSUpgradeable, ERC721AppStoreStorageUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;
    event AppStoreNameSet(address indexed owner, uint256 indexed tokenId, string appStoreName, string uri);
    event UpdatedTokenURI(uint256 indexed tokenId, string uri);

    // mapping to store blocked apps for each appStore ex isBlocked[appStoreTokenId][appTokenId]
    mapping(uint256 => mapping(uint256 => bool)) public isBlocked;
    /// @custom:oz-upgrades-unsafe-allow constructor    
    constructor() {
        _disableInitializers();
    }
    function initialize() initializer public {
        __ERC721_init(".appStoreNFT", ".appStoreNFT");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __Pausable_init();
        __Ownable_init();
        __ERC721Burnable_init();
        __UUPSUpgradeable_init();
        __ERC721AppStoreStorage_init();


        _tokenIdCounter.increment();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to, string memory uri, string calldata appStoreName) external onlyOwner {
        require(balanceOf(to)==0, "provided wallet already used to create app");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        string memory validatedAppStoreName = _validateAppStoreName(appStoreName);
        _setTokensAppStoreName(tokenId, validatedAppStoreName);
        emit AppStoreNameSet(to, tokenId, validatedAppStoreName, uri);
    }

    function safeMintAppStoreNFT(address to, string memory uri, string calldata appStoreName) external whenNotPaused {
        require(balanceOf(to)==0, "provided wallet already used to create app");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        string memory validatedAppStoreName = _validateAppStoreName(appStoreName);
        _setTokensAppStoreName(tokenId, validatedAppStoreName);
        emit AppStoreNameSet(to, tokenId, validatedAppStoreName, uri);
    }

    function updateTokenURI(uint256 _tokenId, string memory _tokenURI) external {
        require(_isApprovedOrOwner(msg.sender, _tokenId), "ERC721: caller is not owner nor approved");
        _setTokenURI(_tokenId, _tokenURI);
        emit UpdatedTokenURI(_tokenId, _tokenURI);
    }

    function getDataURI(uint256 _tokenId) external view returns (string memory) {
        return string(abi.encodePacked(tokenURI(_tokenId), "/data.json"));
    }

    function getSchemaURI(uint256 _tokenId) external view returns (string memory) {
        return string(abi.encodePacked(tokenURI(_tokenId), "/schema.json"));
    }

    function blockApp(uint256 _appStoreTokenId, uint256 _appTokenId) external {
        require(_isApprovedOrOwner(msg.sender, _appStoreTokenId), "ERC721: function caller is not owner nor approved");
        isBlocked[_appStoreTokenId][_appTokenId] = true;
    }

    function feesWithdraw(address payable _to) external onlyOwner{
        uint256 amount = (address(this)).balance;
        require(_to.send(amount), 'Fee Transfer to Owner failed.');
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable, ERC721AppStoreStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
