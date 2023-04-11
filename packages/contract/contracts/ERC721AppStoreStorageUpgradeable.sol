// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @dev ERC721 token with storage based appStore Name management.
 */
abstract contract ERC721AppStoreStorageUpgradeable is Initializable, ERC721Upgradeable {
    function __ERC721AppStoreStorage_init() internal onlyInitializing {
        appStoreSuffix = ".appStore";
    }

    function __ERC721AppStoreStorage_init_unchained() internal onlyInitializing {
    }
    using StringsUpgradeable for uint256;

    // Mapping for AppStore Names
    mapping(uint256 => string) private _tokensAppStoreNames;
    // Mapping for AppStore Names to ids
    mapping(string => uint256) private _tokenIdForAppStoreNames;
    // storing the suffix of the AppStore name
    bytes public appStoreSuffix;

    function tokensAppStoreName(uint256 tokenId) public view virtual returns (string memory) {
        _requireMinted(tokenId);
        string memory _appStoreName = _tokensAppStoreNames[tokenId];
        return _appStoreName;
    }
    function tokenIdForAppStoreName(string memory _appStoreName) public view virtual returns (uint256) {
        uint256 _tokenId = _tokenIdForAppStoreNames[_appStoreName];
        _requireMinted(_tokenId);
        return _tokenId;
    }

    /**
     * @dev Validates `_appStoreName` and returns a valid appStore Name ie(should end with .appStore)
     *
     * Requirements:
     *
     * - `_appStoreName` must be valid.
     */
    function _validateAppStoreName(string calldata str) internal virtual returns (string memory) {
        bytes calldata strBytes = bytes(str);
        if (strBytes.length < 4) {
            return string(abi.encodePacked(string(strBytes),string(appStoreSuffix)));
        }
        uint256 strBytesLength = strBytes.length;
        bytes memory strBytesSuffix = strBytes[strBytesLength-4:strBytesLength];
        if(strBytes.length == 4 && keccak256(strBytesSuffix) == keccak256(appStoreSuffix)){
            revert("Validation error: name is empty");
        }else if(keccak256(strBytesSuffix) == keccak256(appStoreSuffix)){
           return string(strBytes);
        }else{
            return string(abi.encodePacked(string(strBytes),string(appStoreSuffix)));
        }
    }

    /**
     * @dev Sets `_appStoreName` as the appStoreName of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokensAppStoreName(uint256 tokenId, string memory _appStoreName) internal virtual {
        require(_exists(tokenId), "ERC721AppStoreStorage: appStore Name set of nonexistent token");
        uint256 checkTokenId = _tokenIdForAppStoreNames[_appStoreName];
        if(tokenId != 0){
            require(!_exists(checkTokenId), "ERC721AppStoreStorage: this appStore Name already in use");
        }
        _tokensAppStoreNames[tokenId] = _appStoreName;
        _tokenIdForAppStoreNames[_appStoreName] = tokenId;
    }

    /**
     * @dev See {ERC721-_burn}. This override additionally checks to see if a
     * token-specific appStore name was set for the token, and if so, it deletes the token's AppStore Name from
     * the storage mapping.
     */
    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);

        if (bytes(_tokensAppStoreNames[tokenId]).length != 0) {
            delete _tokenIdForAppStoreNames[_tokensAppStoreNames[tokenId]];
            delete _tokensAppStoreNames[tokenId];
        }
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}
