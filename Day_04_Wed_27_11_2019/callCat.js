Web3 = require('web3');
web3 = new Web3('https://mainnet.infura.io');
const TestPlayAddress = "0x126778CB92c4de5247747b7CB35dBAa5061Fed73";

const abi=[
  {
      "constant": true,
      "inputs": [
      {
          "internalType": "address",
          "name": "",
          "type": "address"
      },
      {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
      }
      ],
      "name": "boxes",
      "outputs": [
      {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
      },
      {
          "internalType": "enum SchrodingersCat.CatState",
          "name": "cat_state",
          "type": "uint8"
      },
      {
          "internalType": "enum SchrodingersCat.BoxState",
          "name": "box_state",
          "type": "uint8"
      }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [],
      "name": "createBox",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "catIsAlive",
      "outputs": [
      {
          "internalType": "bool",
          "name": "",
          "type": "bool"
      }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "lastId",
      "outputs": [
      {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
      }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [],
      "name": "openBox",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "anonymous": false,
      "inputs": [
      {
          "indexed": false,
          "internalType": "bool",
          "name": "is_alive",
          "type": "bool"
      }
      ],
      "name": "Observed",
      "type": "event"
  }
]

async function create(){
  var result = await SchrodingersCat.methods.createBox().call();
  //shouldn't return anything
  console.log(`Create: ${result.json}`);
}

async function open(){
    var account0;
    web3.eth.getAccounts().then(function(result){
        account0 = result[0];
    })
    console.log(`Adderess: ${account0}`)
    var result = await SchrodingersCat.methods.openBox().send({from: account0}).catch(console.log)
    console.log(`Open: ${result.json}`);
}

async function alive(){
    const SchrodingersCat = new web3.eth.Contract(abi, TestPlayAddress);
    var result = await SchrodingersCat.methods.catIsAlive().call();
    //should return true or false
    console.log(`${result ? 'Congratulations! ' : 'I am sorry to inform you, that '}Schrodingers' Cat is ${result ? 'alive!' : 'dead...'}`);
}

async function run(){
  await create();
  await open();
  await alive();
}
const SchrodingersCat = new web3.eth.Contract(abi, TestPlayAddress);
run();