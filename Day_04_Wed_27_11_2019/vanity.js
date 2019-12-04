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
console.log(`address = ${newAddr.address}`) //0x543211C5D0Fc20a01f74CD45912F921848C834A1
console.log(`pk = ${newAddr.privateKey}`) //0x69dd363db009fc26f8b1dee4bfa47f17d91ecc6a1a8df3101344ca888950d255
console.log(`nr of iterations: ${i}`) // 235,753