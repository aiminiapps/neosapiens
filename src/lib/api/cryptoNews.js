/**
 * Crypto News Service - Free tier CryptoPanic API
 * Get crypto news and sentiment data
 */

const CRYPTOPANIC_API_BASE = 'https://cryptopanic.com/api/v1';
const CRYPTOPANIC_API_KEY = process.env.NEXT_PUBLIC_CRYPTOPANIC_API_KEY || 'free'; // Free tier

/**
 * Fetch latest crypto news
 */
export async function getCryptoNews(currencies = 'BTC,ETH', limit = 20) {
    try {
        const params = new URLSearchParams({
            auth_token: CRYPTOPANIC_API_KEY,
            currencies,
            kind: 'news',
            filter: 'rising',
            public: 'true',
        });

        const response = await fetch(`${CRYPTOPANIC_API_BASE}/posts/?${params}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.warn('CryptoPanic API response not OK:', response.status);
            throw new Error(`Failed to fetch crypto news: ${response.status}`);
        }

        const data = await response.json();

        return {
            news: data.results || [],
            success: true,
        };
    } catch (error) {
        console.error('Error fetching crypto news:', error.message);
        return {
            news: [],
            success: false,
            error: error.message,
        };
    }
}

/**
 * Analyze news sentiment and generate signals
 */
export function analyzeNewsSentiment(newsItems) {
    const signals = [];

    newsItems.forEach((item, index) => {
        if (index >= 10) return; // Limit to 10 news-based signals

        const votes = item.votes || {};
        const positive = votes.positive || 0;
        const negative = votes.negative || 0;
        const important = votes.important || 0;

        // Calculate sentiment score
        const sentimentScore = positive - negative;
        const totalVotes = positive + negative + important;

        let signalType = 'observation';
        let intentScore = 5.0;

        if (important > 5 || totalVotes > 20) {
            signalType = 'risk';
            intentScore = 7.5 + (important / 10);
        } else if (sentimentScore > 3) {
            signalType = 'opportunity';
            intentScore = 6.5 + (sentimentScore / 5);
        } else if (sentimentScore < -3) {
            signalType = 'risk';
            intentScore = 7.0 + Math.abs(sentimentScore) / 5;
        }

        signals.push({
            id: `news-${item.id}`,
            type: signalType,
            timestamp: new Date(item.published_at).getTime(),
            intentScore: Math.min(intentScore, 10).toFixed(1),
            title: item.title,
            source: item.source?.title || 'Crypto News',
            url: item.url,
            sentiment: sentimentScore > 0 ? 'positive' : sentimentScore < 0 ? 'negative' : 'neutral',
            votes: totalVotes,
            currencies: item.currencies?.map(c => c.code) || [],
            explanation: generateNewsExplanation(item, sentimentScore, important),
            agent: selectAgentForNews(item),
            category: 'news',
        });
    });

    return signals;
}

function generateNewsExplanation(newsItem, sentiment, importance) {
    const coins = newsItem.currencies?.map(c => c.code).join(', ') || 'Market';

    if (importance > 5) {
        return `🔴 High-impact news detected: "${newsItem.title}". ${importance} users flagged as important. ${coins} may experience significant volatility. Monitor for rapid price movements.`;
    } else if (sentiment > 3) {
        return `🟢 Positive sentiment signal: "${newsItem.title}". Community reaction is ${sentiment > 5 ? 'strongly' : 'moderately'} bullish on ${coins}. Potential accumulation opportunity.`;
    } else if (sentiment < -3) {
        return `🔴 Negative sentiment detected: "${newsItem.title}". Risk indicator for ${coins}. Consider defensive positions or reduced exposure.`;
    } else {
        return `📰 Market update: "${newsItem.title}". Related to ${coins}. Neutral sentiment - continue monitoring for directional bias.`;
    }
}

function selectAgentForNews(newsItem) {
    const title = newsItem.title.toLowerCase();

    if (title.includes('whale') || title.includes('billion') || title.includes('million')) {
        return 'Titan';
    } else if (title.includes('gas') || title.includes('network') || title.includes('congestion')) {
        return 'Pulse';
    } else if (title.includes('volume') || title.includes('liquidity') || title.includes('dex')) {
        return 'Flow';
    }

    // Default rotation
    return ['Titan', 'Pulse', 'Flow'][Math.floor(Math.random() * 3)];
}

/**
 * Get market data from CoinGecko
 */
export async function getMarketData() {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h',
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            console.warn('CoinGecko API response not OK:', response.status);
            throw new Error(`Failed to fetch market data: ${response.status}`);
        }

        const data = await response.json();
        return { data, success: true };
    } catch (error) {
        console.error('Error fetching market data:', error.message);
        return { data: [], success: false };
    }
}

/**
 * Generate signals from market data
 */
export function generateMarketSignals(marketData) {
    const signals = [];

    marketData.forEach((coin) => {
        const priceChange = parseFloat(coin.price_change_percentage_24h || 0);

        let signalType = 'observation';
        let intentScore = 5.0;
        let explanation = '';

        if (Math.abs(priceChange) > 10) {
            signalType = 'risk';
            intentScore = 8.5;
            explanation = `${coin.name} (${coin.symbol.toUpperCase()}) experiencing ${priceChange > 0 ? 'surge' : 'drop'} of ${Math.abs(priceChange).toFixed(1)}% in 24h. Price: $${coin.current_price.toLocaleString()}. Market cap: $${(coin.market_cap / 1e9).toFixed(2)}B. High volatility indicates strong directional move.`;
        } else if (Math.abs(priceChange) > 5) {
            signalType = priceChange > 0 ? 'opportunity' : 'action';
            intentScore = 6.5;
            explanation = `${coin.name} showing ${priceChange > 0 ? 'upward' : 'downward'} momentum: ${priceChange > 0 ? '+' : ''}${priceChange.toFixed(1)}% (24h). Current price $${coin.current_price.toLocaleString()}. Volume $${(coin.total_volume / 1e9).toFixed(2)}B indicates ${priceChange > 0 ? 'buying' : 'selling'} pressure.`;
        } else {
            return; // Skip low volatility coins
        }

        signals.push({
            id: `market-${coin.id}-${Date.now()}`,
            type: signalType,
            timestamp: Date.now(),
            intentScore: intentScore.toFixed(1),
            title: `${coin.symbol.toUpperCase()} ${priceChange > 0 ? 'Surge' : 'Drop'}: ${Math.abs(priceChange).toFixed(1)}%`,
            explanation,
            agent: 'Flow',
            category: 'market',
            data: {
                coin: coin.symbol.toUpperCase(),
                price: coin.current_price,
                priceChange: priceChange,
                volume: coin.total_volume,
                marketCap: coin.market_cap,
            },
        });
    });

    return signals;
}
