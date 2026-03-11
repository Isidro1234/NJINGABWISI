import CryptoJS from 'crypto-js'



export const encryptdata = (data:object)=>{
    const convert_to_string = JSON.stringify(data);
    const key:string = process.env.NEXT_PUBLIC_SECRECT_ENCRYPTION || ''
    const encrypt = CryptoJS.AES.encrypt(convert_to_string, key).toString()
    return encrypt
}

export const decryptdata = (data:string)=>{
    const key:string = process.env.NEXT_PUBLIC_SECRECT_ENCRYPTION || ''
    const decrypt = CryptoJS.AES.decrypt(data, key )
    const decryptstring =  decrypt.toString(CryptoJS.enc.Utf8);
    const originalObject = JSON.parse(decryptstring);
    return originalObject 
}