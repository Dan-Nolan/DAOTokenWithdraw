//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IDAOToken {
  function balanceOf(address member) external view returns(uint);
  function approve(address spender, uint amount) external returns(bool);
  function allowance(address owner, address spender) external view returns(uint);
}
