import React, { useState, useEffect } from 'react';
import './App.css';
import Web3 from "web3";

function App() {
  const [boxId, setBoxId] = useState("");
  const [SchrodingersCat, setSchrodingersCat] = useState();
  const [image, setImage] = useState("./closed.jpg");
  
  var web3 = new Web3(window.ethereum);
  const myAddress = "0x4F0Bd406c78426e3beaF933B068f45606B29E286";
  const playAddress = "0x69ad5b63d0Bb0A9f5C28E57a6Db9B7Dd6c509b2E";
  const imgs =  new Map();
  const abi = [
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
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "boxNr",
          "type": "uint256"
        }
      ],
      "name": "catIsAlive",
      "outputs": [
        {
          "internalType": "bool",
          "name": "alive",
          "type": "bool"
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
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "boxNr",
          "type": "uint256"
        }
      ],
      "name": "openBox",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
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
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "Created",
      "type": "event"
    }
  ]

  imgs.set(0, "./closed.jpg");
  imgs.set(1, "./full.jpg")
  imgs.set(2, "./empty.jpg")


  useEffect(() => {
    run();
  }, []);

  async function run() {
    await window.ethereum.enable();
    setSchrodingersCat(new web3.eth.Contract(abi, playAddress));
  }

  async function create(){
    var box = await SchrodingersCat.methods
      .createBox()
      .send({from: myAddress, gas: 3000000, value: 0});
    var boxId = box.events.Created.returnValues.id;
    console.log(boxId)
    setBoxId(boxId);
  }

  async function open(){
    console.log(`BoxId: ${boxId}`)
    console.log(`Acc: ${myAddress}`);
    var opened = await SchrodingersCat.methods
          .openBox(boxId)
          .send({'from': myAddress, 'gas': 3000000, 'value': 10});
    const alive = opened.events.Observed.returnValues.is_alive;
    console.log(alive);
    setImage(imgs.get(alive ? 1: 2));
    console.log(`Acc: ${myAddress}`);
  }

  function reload(){
    setImage(imgs.get(0))
    setBoxId("")
  }

  return (
    <div className="card">
        
        <div className="card-body">
            <img className="card-img-top" src={image} alt="Card image cap"/>
            <div className="form-group">
              <label for="boxId">Number of the box:</label>
              <input id="boxId" type="number" className="form-control" value={boxId} onChange={(e) => setBoxId(e.target.value)}  aria-describedby="emailHelp" ></input>
              <small id="emailHelp" className="form-text text-muted">Enter the code of unopened box or click create to obtain new code.</small>
            </div>
            <button className="btn btn-primary mr-2" title="Create a box." onClick={() => create()}>Create</button>
            <button className={`btn btn-primary mr-2 ${(boxId == "") ? "disabled": "hello"}`} onClick={() => open()}>Open</button>
            <button className="btn btn-primary" onClick={() => reload()}>Next</button>
        </div>
    </div>
  );
}

export default App;
