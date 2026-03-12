import CryptoJS from 'crypto-js'

const getKey = (): string => {
    const key = process.env.NEXT_PUBLIC_SECRECT_ENCRYPTION
    if (!key) console.warn('Encryption key is missing')
    return key || ''
}

export const encryptdata = (data: object): string => {
    try {
        const key = getKey()
        if (!key) return ''
        const convert_to_string = JSON.stringify(data)
        return CryptoJS.AES.encrypt(convert_to_string, key).toString()
    } catch (error) {
        console.error('Encrypt error:', error)
        return ''
    }
}

export const decryptdata = (data: string): any => {
    try {
        if (!data || typeof data !== 'string') return null
        
        const key = getKey()
        if (!key) return null

        const decrypt = CryptoJS.AES.decrypt(data, key)
        
        // ✅ Check bytes exist before converting
        if (!decrypt || decrypt.sigBytes <= 0) return null

        const decryptstring = decrypt.toString(CryptoJS.enc.Utf8)
        
        // ✅ Check string is valid before parsing
        if (!decryptstring || decryptstring.trim() === '') return null

        return JSON.parse(decryptstring)

    } catch (error) {
        console.error('Decrypt error:', error)
        return null  // ✅ never crash — return null instead
    }
}