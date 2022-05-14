// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TechTalkTicket is ERC721 {
  using EnumerableSet for EnumerableSet.UintSet;

  address public contractOwnerAddress;
  address public erc20Address;
  uint256 public eventCreationFee;
  uint256 public ticketPrice;
  mapping(uint256 => TechTalkEvent) public techTalkEvents;

  mapping(address => EnumerableSet.UintSet) private _creatorEventIds;
  IERC20 private _erc20;
  uint256 private _eventIdCounter;
  uint256 private _ticketIdCounter;
  mapping(uint256 => uint256) private _ticketCheckInCodes;
  mapping(uint256 => EnumerableSet.UintSet) private _eventTicketIds;
  mapping(uint256 => EnumerableSet.UintSet) private _eventCheckedInTicketIds;

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

  event TicketCheckedIn (
    uint256 eventId,
    uint256 ticketId,
    address owner,
    uint256 payback
  );

  constructor(address _erc20Address, uint256 _eventCreationFee, uint256 _ticketPrice) ERC721("Tech Talk Ticket", "TTT") {
    require(_erc20Address != address(0), "ERC20 address is required!");

    contractOwnerAddress = msg.sender;
    erc20Address = _erc20Address;
    eventCreationFee = _eventCreationFee;
    ticketPrice = _ticketPrice;

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

  function editEvent(uint256 eventId, string memory name, uint256 maxTickets, uint256 startTime) public {
    TechTalkEvent storage currentEvent = techTalkEvents[eventId];
    EnumerableSet.UintSet storage ticketIds = _eventTicketIds[eventId];

    require(currentEvent.creator == msg.sender, "You don't have permission to edit this event!");
    require(maxTickets > 0, "Max tickets needs to be greater than 0!");
    require(maxTickets > ticketIds.length(), "Max tickets needs to be greater than booked tickets!");
    require(startTime > block.timestamp, "Start time cannot be in the past!");

    currentEvent.name = name;
    currentEvent.startTime = startTime;
    currentEvent.maxTickets = maxTickets;
  }

  function buyTicket(uint256 eventId) public {
    TechTalkEvent memory currentEvent = techTalkEvents[eventId];
    require(eventId > 0 && eventId <= _eventIdCounter, "Event is not valid");
    require(currentEvent.startTime > block.timestamp, "Event has ended!");
    require(_eventTicketIds[eventId].length() < currentEvent.maxTickets, "All tickets are sold out!");

    _erc20.transferFrom(msg.sender, contractOwnerAddress, ticketPrice / 4);
    _erc20.transferFrom(msg.sender, currentEvent.creator, ticketPrice * 5 / 8);
    _erc20.transferFrom(msg.sender, address(this), ticketPrice / 8);

    _ticketIdCounter++;
    _mint(msg.sender, _ticketIdCounter);
    _eventTicketIds[eventId].add(_ticketIdCounter);

    _ticketCheckInCodes[_ticketIdCounter] = _rand();
  }

  function getCheckInCode(uint256 ticketId) public view returns (uint256) {
    require(ownerOf(ticketId) == msg.sender, "You don't own this ticket!");
    return _ticketCheckInCodes[ticketId];
  }

  function verifyTicket(uint256 eventId, uint256 ticketId, uint256 checkInCode) public view returns (bool) {
    TechTalkEvent memory currentEvent = techTalkEvents[eventId];
    require(msg.sender == currentEvent.creator, "You don't have permission to verify the check-in code!");

    return _eventTicketIds[eventId].contains(ticketId)
    && !_eventCheckedInTicketIds[eventId].contains(ticketId)
    && _ticketCheckInCodes[ticketId] == checkInCode;
  }

  function checkInTicket(uint256 eventId, uint256 ticketId, uint256 checkInCode) public {
    TechTalkEvent memory currentEvent = techTalkEvents[eventId];
    require(msg.sender == currentEvent.creator, "You don't have permission to verify the check-in code!");
    require(verifyTicket(eventId, ticketId, checkInCode) == true, "Ticket is not valid!");

    uint256 payback = ticketPrice / 8;
    address owner = ownerOf(ticketId);
    _erc20.transfer(owner, payback);

    _eventCheckedInTicketIds[eventId].add(ticketId);

    emit TicketCheckedIn(eventId, ticketId, owner, payback);
  }

  function getOwnedTicketIds(uint256 eventId) public view returns (uint256[] memory) {
    EnumerableSet.UintSet storage ticketIds = _eventTicketIds[eventId];
    uint256[] memory ownedTicketIds = new uint256[](ticketIds.length());
    for (uint256 i = 0; i < ticketIds.length(); i++) {
      uint256 ticketId = ticketIds.at(i);
      if (ownerOf(ticketId) == msg.sender) {
        ownedTicketIds[i] = ticketId;
      }
    }
    return ownedTicketIds;
  }

  function getOwnedCheckedInTicketIds(uint256 eventId) public view returns (uint256[] memory) {
    EnumerableSet.UintSet storage checkedInTicketIds = _eventCheckedInTicketIds[eventId];
    uint256[] memory ownedCheckedInTicketIds = new uint256[](checkedInTicketIds.length());
    for (uint256 i = 0; i < checkedInTicketIds.length(); i++) {
      uint256 ticketId = checkedInTicketIds.at(i);
      if (ownerOf(ticketId) == msg.sender) {
        ownedCheckedInTicketIds[i] = ticketId;
      }
    }
    return ownedCheckedInTicketIds;
  }

  function getCreatedEventIds() public view returns (uint256[] memory) {
    EnumerableSet.UintSet storage eventIds = _creatorEventIds[msg.sender];
    return eventIds.values();
  }

  function getCreatedEvents() public view returns (TechTalkEvent[] memory) {
    EnumerableSet.UintSet storage eventIds = _creatorEventIds[msg.sender];
    TechTalkEvent[] memory events = new TechTalkEvent[](eventIds.length());
    for (uint256 i = 0; i < eventIds.length(); i++) {
      events[i] = techTalkEvents[eventIds.at(i)];
    }
    return events;
  }

  function countTickets(uint256 eventId) public view returns (uint256) {
    return _eventTicketIds[eventId].length();
  }

  function countCheckedInTickets(uint256 eventId) public view returns (uint256) {
    return _eventCheckedInTicketIds[eventId].length();
  }

  function _transfer(address from, address to, uint256 tokenId) internal override(ERC721) {
    super._transfer(from, to, tokenId);
    _ticketCheckInCodes[tokenId] = _rand();
  }

  function _rand() private view returns(uint256) {
    uint256 seed = uint256(keccak256(abi.encodePacked(
        block.timestamp + block.difficulty + block.gaslimit
        + ((uint256(keccak256(abi.encodePacked(block.coinbase)))) / (block.timestamp))
        + ((uint256(keccak256(abi.encodePacked(msg.sender)))) / (block.timestamp)) + block.number)));

    return (block.timestamp * 100000) + (seed - ((seed / 1000000) * 1000000));
  }
}
