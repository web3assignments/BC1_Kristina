Web3 = require('web3');
web3 = new Web3();
var i = 0;
var find = "54321";
var find_len = find.length+2;
var prefix;
do {
    newAddr = web3.eth.accounts.create();
    prefix = newAddr.address.slice(2, find_len).toLowerCase();
    if(++i % 1000 == 0) console.log(i);

} while (prefix != find);
console.log(`prefix = ${prefix}`)
console.log(`address = ${newAddr.address}`)
console.log(`pk = ${newAddr.privateKey}`)
console.log(`nr of iterations: ${i}`) 