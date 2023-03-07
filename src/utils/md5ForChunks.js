import CryptoJS from 'crypto-js';

export const md5ForChunks = (chunk) => {
    return new Promise((resolve,reject)=>{
        let reader = new FileReader();
        reader.onload = () => {
            let wordArray = CryptoJS.lib.WordArray.create(reader.result);
            let hash = CryptoJS.MD5(wordArray).toString();
            resolve(hash);
        }
        reader.onerror = () => {
            reject(new Error('Unable to calculate MD5 hash'))
        }
        reader.readAsArrayBuffer(chunk)
    })
}