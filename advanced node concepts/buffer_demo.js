// buffer deal with binary data only 

const bufferOne=Buffer.alloc(10);
console.log(bufferOne);

// we can conver string into buffer and store it
const bufferFromString =Buffer.from("Hello");
console.log(bufferFromString);

const bufferFromArray=Buffer.from([2,3,5,6])
console.log(bufferFromArray);

bufferOne.write("Node.js");
console.log('After writing node.js to bufferone',bufferOne,bufferOne.toString());

console.log(bufferFromString[0]);
console.log(bufferFromString.slice(0,3));

const concatBuffs=Buffer.concat([bufferOne,bufferFromString]);
console.log(concatBuffs,concatBuffs.toString());

console.log(concatBuffs.toJSON());



