// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

interface ILightGenerator {

    function withdraw() external;

    function getProductPriceInETH(uint256 productId) external view returns(uint256);

    function getETHUSDConversionRate() external view returns(uint256);

    function changeProductPrice(uint256 _id, uint256 _priceUSD) external;

    function fund() payable external;


}
