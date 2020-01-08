pragma solidity >=0.4.0 <0.6.0;
      import "remix_tests.sol";
      import "./Untitled.sol";

      contract schrCatGeneralFlow {

        SchrodingersCat catContract;
        uint boxId;

        function beforeAll() public {
          catContract = new SchrodingersCat();
        }

        function createBox() public {
          boxId = catContract.createBox();
          Assert.equal(boxId, uint(1), "error message");
        }

        function checkBoxState() public payable {
            boxId = catContract.createBox();
            string memory boxState = catContract.getBoxState(boxId);
            Assert.equal(boxState, "Closed", "Box state has to be equal \"Closed\"");
            catContract.openBox.value(msg.value)(boxId);
            boxState = catContract.getBoxState(boxId);
            Assert.equal(boxState, "Open", "Box state has to be equal \"Open\"");
        }

        function checkCatState() public payable {
            boxId = catContract.createBox();
            string memory catState = catContract.getBoxState(boxId);
            Assert.equal(catState, "Superposition", "Cat state has to be equal \"Superposition\"");
            catContract.openBox.value(msg.value)(boxId);
            catState = catContract.getBoxState(boxId);
            bool boolCatState = (compareStrings(catState, "Alive") || compareStrings(catState, "Dead"));
            Assert.ok(boolCatState, "Cat state has to be equal \"Alive\" or \"Dead\"");
        }

        function compareStrings (string memory a, string memory b) public pure returns (bool) {
          return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
        }

        function getRandom() public {
           bool random = catContract.getRandom();
           Assert.ok(random || !random, "");
        }

        function catIsAlive() public {
            boxId = catContract.createBox();
            bool alive = catContract.catIsAlive(boxId);
            Assert.ok(!alive, "Cat shouldn't be alive at this stage.");
        }
}