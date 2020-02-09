pragma solidity >=0.5.11;
import "github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/ownership/Ownable.sol";

/// @title Schrodingers Cat
/// @author Kristina Prusinskaite
/// @notice This is the contract that imitates the Copenhagen interpretation of Schrodinger's Cat problem. The key difference is that the observer pays to create a box and when the box is opened and cat appears to be alive, observer is rewarded with her/his fee.
/// @dev All function calls are currently implemented without side effects
contract SchrodingersCat is Ownable {

    event Observed(bool is_alive);
    event Created(uint id);

    enum CatState {Superposition, Alive, Dead}
    enum BoxState {Open, Closed}

    struct Box {
        CatState cat_state;
        BoxState box_state;
    }

    mapping(address => mapping (uint => Box)) public boxes;

    uint public lastId;
    bytes32 sealedSeed;
    bool seedSet = false;
    uint storedBlockNumber;

    /**
    * Checks whether the box is in the closed state.
    */
    modifier boxIsClosed(uint boxNr) {
        require(boxes[msg.sender][boxNr].box_state == BoxState.Closed, "Box has already been opened");
        _;
    }

    function destroyContract() public onlyOwner {
        selfdestruct(msg.sender);
    }

   function setSealedSeed(bytes32 _sealedSeed) public onlyOwner {
        require(!seedSet);
        sealedSeed = _sealedSeed;
        storedBlockNumber = block.number + 1;
        seedSet = true;
    }


    /// @author Kristina Prusinskaite
    /// @notice Create a box that is mapped to the sender address. Initially the box is closed and the cat is in the superposition. Only one box per sender address is possible.
    /// @dev Adds the box to the mapping, emits "Created" event.
    /// @return The id of the box
    function createBox() public returns(uint id) {
        lastId = lastId + 1;
        boxes[msg.sender][lastId] = Box(CatState.Superposition, BoxState.Closed);
        emit Created(lastId);
        return lastId;
    }

    /// @author Kristina Prusinskaite
    /// @notice Returns a current state of the cat, that is "Superposition" if box was not opened yet, else "Alive" or "Dead".
    /// @dev Returns a current state of the cat, that is "Superposition" if box was not opened yet, else "Alive" or "Dead".
    /// @param boxNr Box id
    /// @return Returns the state of the box, that is either "Superposition", "Alive" or "Dead".
    function getCatState(uint boxNr) public view returns(string memory catstate){
        return (boxes[msg.sender][boxNr]).cat_state == CatState.Superposition ?
        "Superposition" : ((boxes[msg.sender][boxNr]).cat_state == CatState.Alive ? "Alive" : "Dead");
    }

    /// @author Kristina Prusinskaite
    /// @notice Returns the state of the box, that is either "Closed" or "Open".
    /// @dev Returns the state of the box, that is either "Closed" or "Open".
    /// @param boxNr Box id
    /// @return Returns the state of the box, that is either "Closed" or "Open".
    function getBoxState(uint boxNr) public view returns(string memory boxstate){
        return (boxes[msg.sender][boxNr]).box_state == BoxState.Open ? "Open" : "Closed";
    }

    /// @author Kristina Prusinskaite
    /// @notice Opens the box and observes the contents of the box if the box is in the state "Closed".
    /// @dev Determines the cat state by random, transfers a fee amount back to the sender on cats "Alive" state, emits "Observed" event.
    /// @param boxNr Box id
    function openBox (uint boxNr) public payable boxIsClosed(boxNr){
        address payable observer = address(msg.sender);
        uint fee = msg.value;
        require(fee > 0, "Value must be higher than 0.");
        Box memory myBox = boxes[msg.sender][boxNr];
        myBox.box_state = BoxState.Open;
        if(getRandom()) {
            myBox.cat_state = CatState.Alive;
            // if the cat is alive when the box is open -> give reward to observer
            observer.transfer(fee);
        } else{
            myBox.cat_state = CatState.Dead;
        }
        boxes[msg.sender][boxNr] = myBox;
        emit Observed(catIsAlive(boxNr));
    }

    /// @author Kristina Prusinskaite
    /// @notice Returns True if the cat is alive, otherwise False.
    /// @dev Returns True if the cat is alive, otherwise False.
    /// @param boxNr Box id
    /// @return Returns True if the cat is alive, otherwise False.
    function catIsAlive(uint boxNr) public view returns(bool alive){
        return boxes[msg.sender][boxNr].cat_state == CatState.Alive;
    }

    /// @author Kristina Prusinskaite
    /// @notice Returns a random boolean.
    /// @dev Returns a random boolean, that depends on the sealedSeed.
    /// @return Returns a random boolean.
    function getRandom() private returns(bool) {
        require(seedSet);
        require(storedBlockNumber < block.number);
        uint random = uint(keccak256(abi.encodePacked(sealedSeed, blockhash(storedBlockNumber))));
        seedSet = false;
        return bool(random % 2 == 0);
    }
}

