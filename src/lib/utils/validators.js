import { isValidAddress } from './formatters';

/**
 * Validate Ethereum address
 */
export function validateEthereumAddress(address) {
    if (!address) {
        return { valid: false, error: 'Address is required' };
    }

    if (!address.startsWith('0x')) {
        return { valid: false, error: 'Address must start with 0x' };
    }

    if (address.length !== 42) {
        return { valid: false, error: 'Address must be 42 characters long' };
    }

    if (!isValidAddress(address)) {
        return { valid: false, error: 'Invalid Ethereum address format' };
    }

    return { valid: true };
}

/**
 * Validate token contract address
 */
export async function validateTokenAddress(address, provider) {
    const addressCheck = validateEthereumAddress(address);
    if (!addressCheck.valid) {
        return addressCheck;
    }

    try {
        // Check if address has code (is a contract)
        const code = await provider.getCode(address);
        if (code === '0x') {
            return { valid: false, error: 'Address is not a contract' };
        }

        return { valid: true };
    } catch (error) {
        return { valid: false, error: 'Failed to validate contract address' };
    }
}

/**
 * Validate network ID
 */
export function validateNetworkId(networkId) {
    const validNetworks = [1, 5, 11155111]; // mainnet, goerli, sepolia
    return validNetworks.includes(networkId);
}
