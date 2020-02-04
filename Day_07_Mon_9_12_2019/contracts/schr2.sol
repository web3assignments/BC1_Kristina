pragma solidity >=0.5.11;
pragma experimental ABIEncoderV2;
import "github.com/provable-things/ethereum-api/provableAPI.sol";

/*
* This is the contract that imitates the Copenhagen interpretation of Schrodinger's Cat problem.
* The key difference is that the observer pays to create a box and when the box is opened and cat
* appears to be alive, observer is rewarded with her/his fee.
**/
contract SchrodingersCat is usingProvable {

    event Observed(bool is_alive);
  	event Created(uint id);
    event LogQueryProvable(string description);
    event LogNewKrakenPriceTicker(uint price);

    enum CatState {Superposition, Alive, Dead}
    enum BoxState {Open, Closed}

    uint public priceETHXBT;

    constructor()
        public
    {
        provable_setProof(proofType_Android | proofStorage_IPFS);
        update(); // Update price on contract creation...
    }

    struct Box {
        CatState cat_state;
        BoxState box_state;
    }

    mapping(address => mapping (uint => Box)) public boxes;

    uint public lastId;

    /**
    * Create a box that is mapped to the sender address.
    * Initially the box is closed and the cat is in the superposition.
    * Only one box per sender address is possible.
    */
    function createBox() public returns(uint id) {
        lastId = lastId + 1;
        boxes[msg.sender][lastId] = Box(CatState.Superposition, BoxState.Closed);
      	emit Created(lastId);
        return lastId;
    }

    /**
    * Opens the box and observes the contents of the box.
    */
    function openBox (uint boxNr) public payable boxIsClosed(boxNr) {
        address payable observer = address(msg.sender);
        uint fee = msg.value;
         __callback(fee);
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

    /**
    * Checks whether the box is in the closed state.
    */
    modifier boxIsClosed(uint boxNr) {
        require(boxes[msg.sender][boxNr].box_state == BoxState.Closed, "Box has already been opened");
        _;
    }

    /**
    * Returns True if the cat is alive, otherwise False.
    */
    function catIsAlive(uint boxNr) public view returns(bool alive){
        return boxes[msg.sender][boxNr].cat_state == CatState.Alive;
    }

    /**
    * Returns a random boolean.
    */
    function getRandom() private view returns(bool) {
        return bool(uint256(keccak256(abi.encodePacked(block.difficulty, block.coinbase, block.timestamp)))%2 == 0);
    }

    function __callback(uint _result) public {
        require(msg.sender == provable_cbAddress());
        update(); // Recursively update the price stored in the contract...
        priceETHXBT = _result;
        emit LogNewKrakenPriceTicker(priceETHXBT);
    }

    function update() public payable {
        if (provable_getPrice("URL") > address(this).balance) {
            emit LogQueryProvable("Provable query was NOT sent, please add some ETH to cover for the query fee!");
        } else {
            emit LogQueryProvable("Provable query was sent, standing by for the answer...");
            provable_query(60, "URL", "json(https://api.kraken.com/0/public/Ticker?pair=ETHXBT).result.XETHXXBT.c.0");
        }
    }

}
