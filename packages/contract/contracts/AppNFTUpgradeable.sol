// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ERC721NameStorageUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

interface IDappNameList {
    function isAppNameAvailable(string memory appName) external view returns (bool);
}

/**
*  @title AppNFT Upgradeable smart contract
*  @notice This contract can be used for creating NFTs for .app names
*  @dev This contract includes minting, burning, pausing, URI updates, and other functions
*  @dev All function calls are currently implement without side effects
*/
contract AppNFTUpgradeable is Initializable, ERC721Upgradeable, ERC721EnumerableUpgradeable, 
                    ERC721URIStorageUpgradeable, PausableUpgradeable, OwnableUpgradeable, 
                        ERC721BurnableUpgradeable, UUPSUpgradeable, ERC721NameStorageUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;
    event AppNameSet(address indexed owner, uint256 indexed tokenId, string appName, string uri);
    event SaleCreated(uint256 indexed tokenId, uint256 price);
    event UpdatedTokenURI(uint256 indexed tokenId, string uri);
    
    uint128 public fees;    // fees in Gwei
    // flag to prevent specific app name length
    bool public mintSpecialFlag;
    // flag to prevent minting multiple app names from one account
    bool public mintManyFlag;
    // flag to prevent minting app names from the whitelisted apps
    bool public checkDappNamesListFlag;
    // (Max)Length of special names
    uint128 public constant SPL_MAX_LENGTH = 3;

    // mapping for storing price of .app NFTs when on sale
    mapping(uint256 => uint256) public priceOf;
    // mapping for storing onSale status of .app NFTs
    mapping(uint256 => bool) public onSale;

    IERC721Upgradeable public devNFTAddress;
    IDappNameList public dappNameListAddress;

    //string variable for storing the schema URI
    string public schemaURI;

    /// @custom:oz-upgrades-unsafe-allow constructor    
    constructor() {
        _disableInitializers();
    }
    function initialize(address devNFTAddress_, address dappNameListAddress_) initializer public {
        __ERC721_init("appNFT", "appNFT");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __Pausable_init();
        __Ownable_init();
        __ERC721Burnable_init();
        __UUPSUpgradeable_init();
        __ERC721NameStorage_init(".app");

        fees = 2000000000; //2Gwei = 2%;
        devNFTAddress = IERC721Upgradeable(devNFTAddress_);
        dappNameListAddress = IDappNameList(dappNameListAddress_);
        checkDappNamesListFlag=true;
        _tokenIdCounter.increment();//because we want it to start NFT list index from 1 & not 0
    }

    /**
     * @notice pauses all token transfers and approvals 
     * @dev onlyOwner modifier is applied to the pause function
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @notice unpauses all token transfers and approvals 
     * @dev onlyOwner modifier is applied to the unpause function
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, string memory uri, string memory validatedAppName) internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _setTokensName(tokenId, validatedAppName);
        emit AppNameSet(to, tokenId, validatedAppName, uri);
    }

    /**
     * @notice mints new .app NFT but its for onlyOwner
     * @dev checks validations for app name and emit AppNameSet event on successful minting
     * @param to the address to mint the token to
     * @param uri the uri to set for the token
     * @param appName the name of app to set for the token
     */
    function safeMint(address to, string memory uri, string calldata appName) external onlyOwner {
        if(!mintManyFlag){
            require(balanceOf(to)==0, "provided wallet already used to create app");
        }

        string memory validatedAppName = _validateName(appName);
        if (bytes(validatedAppName).length <= SPL_MAX_LENGTH+suffixLength) {
            require(mintSpecialFlag, "Minting of such names is restricted currently");
        }

        mint(to, uri, validatedAppName);
    }

    /**
     * @notice mints new .app NFT
     * @dev checks validations for app name and emit AppNameSet event on successful minting
     * @param to the address to mint the token to
     * @param appName the name of app to set for the token
     */
    function safeMintAppNFT(address to, string calldata appName) external whenNotPaused {
        if(checkDappNamesListFlag){
            require(!dappNameListAddress.isAppNameAvailable(appName), "App name reserved");
        }
        if(!mintManyFlag){
            require(balanceOf(to)==0, "provided wallet already used to create app");
        }

        string memory validatedAppName = _validateName(appName);
        if (bytes(validatedAppName).length <= SPL_MAX_LENGTH+suffixLength) {
            require(mintSpecialFlag, "Minting of such names is restricted currently");
        }

        mint(to, "", validatedAppName);
    }

    /**
     * @notice creates sale for a .app NFT
     * @dev checks if caller is owner of that NFT and set the price for the NFT
     * @param _tokenID the tokenId of the NFT to set on sale
     * @param _amount the price amount to set for the token
     */
    function createSale(uint256 _tokenID, uint256 _amount) external {
        require(_amount>0, "Set some amount");
        require(msg.sender == _ownerOf(_tokenID), "Not the owner of this tokenId");

        priceOf[_tokenID] = _amount;
        onSale[_tokenID] = true;
        emit SaleCreated(_tokenID, _amount);
    }

    /**
     * @notice ends sale for a .app NFT
     * @dev checks if caller is owner of that NFT and sets the price to 0
     * @param _tokenID the tokenId of the NFT to end sale
     */
    function endSale(uint256 _tokenID) external {
        require(msg.sender == _ownerOf(_tokenID), "Not the owner of this tokenId");

        priceOf[_tokenID] = 0;
        onSale[_tokenID] = false;
    }

    /**
     * @notice buy a .app NFT which is on sale
     * @dev checks if token is on sale and caller has paid the price of the token
     * @dev on successful buy, transfer the token to the caller and transfer the price to the owner of the token after deducting fees
     * @param _tokenID the tokenId of the NFT to be bought
     */
    function buyAppNFT(uint256 _tokenID) external payable {
        uint256 price = priceOf[_tokenID];
        require(msg.value >= price,"Paid less than price");
        require(onSale[_tokenID], "This NFT is not on sale");
        priceOf[_tokenID] = 0;
        onSale[_tokenID] = false;
        require(payable(_ownerOf(_tokenID)).send(price-price*fees/100000000000),"payment transfer failed");
        _safeTransfer( _ownerOf(_tokenID),msg.sender,_tokenID,"");
    }

    /**
     * @notice toggles the mintSpecialFlag by onlyOwner
     * @dev this flag is used to check if the app name's length is valid ie more than SPL_MAX_LENGTH
     * @param _mintSpecialFlag bool value to set the flag
     */
    function setMintSpecialFlag(bool _mintSpecialFlag) external onlyOwner {
        mintSpecialFlag = _mintSpecialFlag;
    }

    /**
     * @notice toggles the mintManyFlag by onlyOwner
     * @dev this flag is used to check if the caller is allowed to mint many apps under a single wallet accoount
     * @param _mintManyFlag bool value to set the flag
     */
    function setMintManyFlag(bool _mintManyFlag) external onlyOwner {
        mintManyFlag = _mintManyFlag;
    }

    /**
     * @notice toggles checkDappNamesListFlag by onlyOwner
     * @dev this flag is used to check if the app name is available in the dappNameList contract
     * @param _checkDappNamesListFlag bool value to set the flag
     */
    function setCheckDappNamesListFlag(bool _checkDappNamesListFlag) external onlyOwner {
        checkDappNamesListFlag = _checkDappNamesListFlag;
    }


    /**
     * @notice set platform fees for the sale of .app NFT
     * @dev this is the fees deducted whenever a sale is completed by the buyer
     * @param _fees uint128 value which is fees in percentage (add 10^9)
     */
    function setFees(uint128 _fees) external onlyOwner {
        fees = _fees;
    }

    /**
     * @notice updates the tokenURI for the given token ID
     * @dev checks that the caller is the owner or approved for the token and emits an UpdatedTokenURI event after URI update
     * @param _tokenId uint256 token ID to update the URI for
     * @param _tokenURI string URI to set for the given token ID
     */
    function updateTokenURI(uint256 _tokenId, string memory _tokenURI) external {
        require(_isApprovedOrOwner(msg.sender, _tokenId), "ERC721: caller is not owner nor approved");
        _setTokenURI(_tokenId, _tokenURI);
        emit UpdatedTokenURI(_tokenId, _tokenURI);
    }

    /**
     * @notice used to set/update the scehmaURI for .app NFT
     * @dev schemaURI is used to validate the metadata of the NFT and can be updated by onlyOwner
     * @param _schemaURI string URI
     */
    function setSchemaURI(string memory _schemaURI) external onlyOwner {
        schemaURI = _schemaURI;
    }

    /**
     * @notice function to withdraw fees to owner
     * @dev only owner can call this function
     * @param _to the address to withdraw fees to
     */
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
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable, ERC721NameStorageUpgradeable)
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
