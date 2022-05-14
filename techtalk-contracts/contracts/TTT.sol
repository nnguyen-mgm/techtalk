// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TechTalkTicket {
  using EnumerableSet for EnumerableSet.UintSet;

  address public contractOwnerAddress;
  address public erc20Address;
  uint256 public eventCreationFee;
  mapping(uint256 => TechTalkEvent) public techTalkEvents;

  mapping(address => EnumerableSet.UintSet) private _creatorEventIds;
  IERC20 private _erc20;
  uint256 private _eventIdCounter;

  struct TechTalkEvent {
    uint256 id;
    string name;
    uint256 maxTickets;
    uint256 startTime; // in seconds
    uint256 createdAt;
    address creator;
  }

  event EventCreated (
    TechTalkEvent createdEvent
  );

  constructor(address _erc20Address, uint256 _eventCreationFee) {
    require(_erc20Address != address(0), "ERC20 address is required!");

    contractOwnerAddress = msg.sender;
    erc20Address = _erc20Address;
    eventCreationFee = _eventCreationFee;

    _erc20 = IERC20(_erc20Address);
  }

  function createEvent(string memory name, uint256 maxTickets, uint256 startTime) public {
    require(maxTickets > 0, "Max tickets needs to be greater than 0!");
    require(startTime > block.timestamp, "Start time cannot be in the past!");

    _erc20.transferFrom(msg.sender, address(contractOwnerAddress), eventCreationFee);

    _eventIdCounter++;
    TechTalkEvent storage newEvent = techTalkEvents[_eventIdCounter];
    newEvent.id = _eventIdCounter;
    newEvent.name = name;
    newEvent.maxTickets = maxTickets;
    newEvent.startTime = startTime;
    newEvent.createdAt = block.timestamp;
    newEvent.creator = msg.sender;

    _creatorEventIds[msg.sender].add(_eventIdCounter);

    emit EventCreated(newEvent);
  }
}
