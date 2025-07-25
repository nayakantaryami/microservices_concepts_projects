//there are 4 types of stream
//readable ->> used for read
//writable ->> use for write into a file
//duplex->> can be used for both reaad and write (tcp socket)
// transform->> zlib steams

const fs=require('fs');
const zlib=require('zlib')//module used for compression gzip
const crypto=require('crypto')

const {Transform}=require('stream');
const { log } = require('console');

class EncryptStream extends Transform{
    constructor(key,vector){
        super();
        this.key=key;
        this.vector=vector;
    }


_transform(chunk,encoding,callback){
    const cipher=crypto.createCipheriv('aes-256-cbc',this.key,this.vector);
    const encrypted=Buffer.concat([cipher.update(chunk),cipher.final()])
    //encrypt the chunk data
    this.push(encrypted);
    callback();    
}
}

const key=crypto.randomBytes(32);
const vector=crypto.randomBytes(16);

const readableStream=fs.createReadStream('input.txt');

//now gzip object to compress the stream of data
const gzipStream=zlib.createGzip();

// console.log("compressed data",gzipStream);

const encryptStream=new EncryptStream(key,vector);

const writableStream=fs.createWriteStream('output.txt');


//read->compress->write

readableStream.pipe(gzipStream).pipe(encryptStream).pipe(writableStream);

console.log('streaming -> compressing ->writing data')