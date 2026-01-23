/**
 * Error Handler Utility
 * Centralized error classification and user-friendly messages
 */

export class AppError extends Error {
    constructor(message, type = 'UNKNOWN', retryable = true) {
        super(message);
        this.type = type;
        this.retryable = retryable;
        this.name = 'AppError';
    }
}

export const ErrorTypes = {
    NETWORK: 'NETWORK',
    RPC: 'RPC',
    RATE_LIMIT: 'RATE_LIMIT',
    INVALID_ADDRESS: 'INVALID_ADDRESS',
    API_ERROR: 'API_ERROR',
    UNKNOWN: 'UNKNOWN',
};

/**
 * Classify error and return user-friendly message
 */
export function classifyError(error) {
    if (!error) {
        return {
            type: ErrorTypes.UNKNOWN,
            message: 'An unknown error occurred',
            retryable: true,
        };
    }

    const errorMessage = error.message?.toLowerCase() || '';

    // Network errors
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        return {
            type: ErrorTypes.NETWORK,
            message: 'Network connection failed. Please check your internet connection.',
            retryable: true,
        };
    }

    // RPC errors
    if (errorMessage.includes('rpc') || errorMessage.includes('provider')) {
        return {
            type: ErrorTypes.RPC,
            message: 'Blockchain connection failed. Trying backup provider...',
            retryable: true,
        };
    }

    // Rate limiting
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        return {
            type: ErrorTypes.RATE_LIMIT,
            message: 'Too many requests. Please wait a moment.',
            retryable: true,
        };
    }

    // Invalid address
    if (errorMessage.includes('invalid address') || errorMessage.includes('address')) {
        return {
            type: ErrorTypes.INVALID_ADDRESS,
            message: 'Invalid wallet address. Please check and try again.',
            retryable: false,
        };
    }

    // API errors
    if (errorMessage.includes('api') || errorMessage.includes('400') || errorMessage.includes('500')) {
        return {
            type: ErrorTypes.API_ERROR,
            message: 'Service temporarily unavailable. Please try again.',
            retryable: true,
        };
    }

    return {
        type: ErrorTypes.UNKNOWN,
        message: error.message || 'Something went wrong. Please try again.',
        retryable: true,
    };
}

/**
 * Get retry strategy based on error type
 */
export function getRetryStrategy(error) {
    const classified = classifyError(error);

    switch (classified.type) {
        case ErrorTypes.RATE_LIMIT:
            return {
                shouldRetry: true,
                delay: 5000, // Wait 5 seconds
                maxRetries: 2,
            };

        case ErrorTypes.NETWORK:
        case ErrorTypes.RPC:
            return {
                shouldRetry: true,
                delay: 1000, // Start with 1 second
                maxRetries: 3,
            };

        case ErrorTypes.INVALID_ADDRESS:
            return {
                shouldRetry: false,
                delay: 0,
                maxRetries: 0,
            };

        default:
            return {
                shouldRetry: true,
                delay: 2000,
                maxRetries: 2,
            };
    }
}
