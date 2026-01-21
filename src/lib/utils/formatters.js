import { ethers } from 'ethers';

/**
 * Validate Ethereum address
 */
export function isValidAddress(address) {
    try {
        return ethers.isAddress(address);
    } catch {
        return false;
    }
}

/**
 * Format address for display
 */
export function formatAddress(address) {
    if (!address || !isValidAddress(address)) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Format number with commas
 */
export function formatNumber(num) {
    if (!num) return '0';
    return parseFloat(num).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}

/**
 * Format currency value
 */
export function formatCurrency(value, currency = 'USD') {
    if (!value) return '$0.00';

    const num = parseFloat(value);
    if (num >= 1e9) {
        return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
        return `$${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
        return `$${(num / 1e3).toFixed(2)}K`;
    }

    return `$${num.toFixed(2)}`;
}

/**
 * Format large numbers with K/M/B suffixes
 */
export function formatLargeNumber(num) {
    if (!num) return '0';

    const n = parseFloat(num);
    if (n >= 1e9) {
        return `${(n / 1e9).toFixed(2)}B`;
    } else if (n >= 1e6) {
        return `${(n / 1e6).toFixed(2)}M`;
    } else if (n >= 1e3) {
        return `${(n / 1e3).toFixed(2)}K`;
    }

    return n.toFixed(2);
}

/**
 * Format percentage
 */
export function formatPercentage(value) {
    if (value === null || value === undefined) return '0%';
    const num = parseFloat(value);
    return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
}

/**
 * Get percentage color class
 */
export function getPercentageColor(value) {
    const num = parseFloat(value);
    if (num > 0) return 'text-intent-green';
    if (num < 0) return 'text-critical-red';
    return 'text-text-muted';
}
