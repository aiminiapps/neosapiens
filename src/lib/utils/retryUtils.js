/**
 * Retry Utilities
 * Exponential backoff and circuit breaker patterns
 */

/**
 * Exponential backoff with jitter
 */
export function calculateBackoff(attemptIndex, baseDelay = 1000, maxDelay = 30000) {
    const exponentialDelay = Math.min(baseDelay * (2 ** attemptIndex), maxDelay);
    const jitter = Math.random() * 0.3 * exponentialDelay; // Add 0-30% jitter
    return exponentialDelay + jitter;
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff(fn, options = {}) {
    const {
        maxRetries = 3,
        baseDelay = 1000,
        maxDelay = 30000,
        shouldRetry = () => true,
        onRetry = () => { },
    } = options;

    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Don't retry if we've exhausted attempts
            if (attempt >= maxRetries) {
                break;
            }

            // Check if we should retry this error
            if (!shouldRetry(error)) {
                break;
            }

            // Calculate delay and wait
            const delay = calculateBackoff(attempt, baseDelay, maxDelay);
            onRetry(attempt + 1, delay, error);

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

/**
 * Circuit Breaker
 * Prevents repeated calls to failing services
 */
export class CircuitBreaker {
    constructor(options = {}) {
        this.failureThreshold = options.failureThreshold || 5;
        this.resetTimeout = options.resetTimeout || 60000; // 1 minute
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.failures = 0;
        this.lastFailureTime = null;
    }

    async execute(fn) {
        if (this.state === 'OPEN') {
            // Check if we should try resetting
            if (Date.now() - this.lastFailureTime >= this.resetTimeout) {
                this.state = 'HALF_OPEN';
            } else {
                throw new Error('Circuit breaker is OPEN - service temporarily unavailable');
            }
        }

        try {
            const result = await fn();

            // Success - reset if we were recovering
            if (this.state === 'HALF_OPEN') {
                this.state = 'CLOSED';
                this.failures = 0;
            }

            return result;
        } catch (error) {
            this.failures++;
            this.lastFailureTime = Date.now();

            if (this.failures >= this.failureThreshold) {
                this.state = 'OPEN';
            }

            throw error;
        }
    }

    reset() {
        this.state = 'CLOSED';
        this.failures = 0;
        this.lastFailureTime = null;
    }

    getState() {
        return {
            state: this.state,
            failures: this.failures,
            lastFailureTime: this.lastFailureTime,
        };
    }
}
