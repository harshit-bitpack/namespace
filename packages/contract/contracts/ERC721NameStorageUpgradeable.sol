// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @dev ERC721 token with storage based token Name management.
 */
abstract contract ERC721NameStorageUpgradeable is Initializable, ERC721Upgradeable {
    function __ERC721NameStorage_init(string memory suffix_) internal onlyInitializing {
        nameSuffix = bytes(suffix_);
    }

    function __ERC721NameStorage_init_unchained() internal onlyInitializing {
    }
    using StringsUpgradeable for uint256;

    // Mapping for Names
    mapping(uint256 => string) private _tokenName;
    // Mapping of names to ids
    mapping(string => uint256) private _tokenIdForNames;
    // storing the suffix of the name
    bytes public nameSuffix;

    function tokensName(uint256 tokenId) public view virtual returns (string memory) {
        _requireMinted(tokenId);
        string memory _name = _tokenName[tokenId];
        return _name;
    }
    function tokenIdForName(string memory _name) public view virtual returns (uint256) {
        uint256 _tokenId = _tokenIdForNames[_name];
        _requireMinted(_tokenId);
        return _tokenId;
    }

    /**
     * @dev Validates `_name` and returns a valid Name ie(should end with nameSuffix)
     *
     * Requirements:
     *
     * - `_name` must be valid.
     */
    function _validateName(string calldata str) internal virtual returns (string memory) {
        bytes calldata strBytes = bytes(str);
        if (strBytes.length < 4) {
            return string(abi.encodePacked(string(strBytes),string(nameSuffix)));
        }
        uint256 strBytesLength = strBytes.length;
        bytes memory strBytesSuffix = strBytes[strBytesLength-4:strBytesLength];
        if(strBytes.length == 4 && keccak256(strBytesSuffix) == keccak256(nameSuffix)){
            revert("ERC721NameStorage: Name not found");
        }else if(keccak256(strBytesSuffix) == keccak256(nameSuffix)){
           return string(strBytes);
        }else{
            return string(abi.encodePacked(string(strBytes),string(nameSuffix)));
        }
    }

    /**
     * @dev Sets `_name` as the name of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokensName(uint256 tokenId, string memory _name) internal virtual {
        require(_exists(tokenId), "ERC721NameStorage: Name set of nonexistent token");
        uint256 checkTokenId = _tokenIdForNames[_name];
        if(tokenId != 0){
            require(!_exists(checkTokenId), "ERC721NameStorage: this Name already in use");
        }
        _tokenName[tokenId] = _name;
        _tokenIdForNames[_name] = tokenId;
    }

    /**
     * @dev See {ERC721-_burn}. This override additionally checks to see if a
     * token-specific name was set for the token, and if so, it deletes the token's Name from
     * the storage mapping.
     */
    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);

        if (bytes(_tokenName[tokenId]).length != 0) {
            delete _tokenIdForNames[_tokenName[tokenId]];
            delete _tokenName[tokenId];
        }
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}
