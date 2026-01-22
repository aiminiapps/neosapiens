/**
 * Portfolio Analysis Service
 * Analyzes user's wallet and provides AI-driven insights
 */

import { ethers } from 'ethers';
import { getProvider } from '../web3/providers';
import { getTokenPriceData } from '../data/priceService';

/**
 * Get comprehensive wallet portfolio
 */
export async function analyzeWalletPortfolio(walletAddress) {
    try {
        const provider = getProvider();

        // Get ETH balance
        const ethBalance = await provider.getBalance(walletAddress);
        const ethBalanceFormatted = parseFloat(ethers.formatEther(ethBalance));

        // Common ERC-20 tokens to check
        const COMMON_TOKENS = [
            { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', symbol: 'USDT', decimals: 6 },
            { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', symbol: 'USDC', decimals: 6 },
            { address: '0x6b175474e89094c44da98b954eedeac495271d0f', symbol: 'DAI', decimals: 18 },
            { address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', symbol: 'WETH', decimals: 18 },
            { address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', symbol: 'UNI', decimals: 18 },
            { address: '0x514910771af9ca656af840dff83e8264ecf986ca', symbol: 'LINK', decimals: 18 },
        ];

        // Get token balances
        const tokenBalances = await Promise.all(
            COMMON_TOKENS.map(async (token) => {
                try {
                    const contract = new ethers.Contract(
                        token.address,
                        ['function balanceOf(address) view returns (uint256)'],
                        provider
                    );
                    const balance = await contract.balanceOf(walletAddress);
                    const balanceFormatted = parseFloat(ethers.formatUnits(balance, token.decimals));

                    if (balanceFormatted > 0) {
                        // Get price data
                        const priceData = await getTokenPriceData(token.address);
                        return {
                            symbol: token.symbol,
                            balance: balanceFormatted,
                            address: token.address,
                            price: priceData.price || 0,
                            value: balanceFormatted * (priceData.price || 0),
                            priceChange24h: priceData.priceChange24h || 0,
                        };
                    }
                    return null;
                } catch (error) {
                    return null;
                }
            })
        );

        // Filter out null values
        const validTokens = tokenBalances.filter(t => t !== null);

        // Get ETH price
        const ethPriceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true');
        const ethPriceData = await ethPriceResponse.json();
        const ethPrice = ethPriceData.ethereum?.usd || 0;
        const ethPriceChange = ethPriceData.ethereum?.usd_24h_change || 0;

        // Calculate portfolio metrics
        const ethValue = ethBalanceFormatted * ethPrice;
        const tokenValue = validTokens.reduce((sum, t) => sum + t.value, 0);
        const totalValue = ethValue + tokenValue;

        const portfolio = {
            address: walletAddress,
            totalValue,
            eth: {
                balance: ethBalanceFormatted,
                price: ethPrice,
                value: ethValue,
                priceChange24h: ethPriceChange,
                percentage: totalValue > 0 ? (ethValue / totalValue) * 100 : 0,
            },
            tokens: validTokens.map(t => ({
                ...t,
                percentage: totalValue > 0 ? (t.value / totalValue) * 100 : 0,
            })),
            metrics: {
                assetCount: 1 + validTokens.length,
                diversification: calculateDiversification(ethValue, validTokens, totalValue),
                risk: calculateRiskScore(ethValue, validTokens, totalValue),
            },
        };

        return portfolio;
    } catch (error) {
        console.error('Error analyzing portfolio:', error);
        return null;
    }
}

/**
 * Calculate diversification score (0-100)
 */
function calculateDiversification(ethValue, tokens, totalValue) {
    if (totalValue === 0) return 0;

    const positions = [ethValue, ...tokens.map(t => t.value)];
    const percentages = positions.map(p => p / totalValue);

    // Higher score = more diversified
    // Use Herfindahl index inverse
    const herfindahl = percentages.reduce((sum, p) => sum + (p * p), 0);
    const diversification = (1 - herfindahl) * 100;

    return Math.min(diversification * 2, 100); // Scale up for UX
}

/**
 * Calculate risk score (0-100, higher = riskier)
 */
function calculateRiskScore(ethValue, tokens, totalValue) {
    if (totalValue === 0) return 0;

    // Factors: volatility, concentration, stablecoin ratio
    const stablecoins = tokens.filter(t => ['USDT', 'USDC', 'DAI'].includes(t.symbol));
    const stableValue = stablecoins.reduce((sum, t) => sum + t.value, 0);
    const stableRatio = totalValue > 0 ? stableValue / totalValue : 0;

    // Concentration risk
    const maxPosition = Math.max(ethValue, ...tokens.map(t => t.value));
    const concentration = totalValue > 0 ? maxPosition / totalValue : 0;

    // Risk score: high concentration = high risk, high stables = low risk
    const risk = (concentration * 50) + ((1 - stableRatio) * 50);

    return Math.min(Math.max(risk, 0), 100);
}

/**
 * Generate AI recommendations for portfolio
 */
export function generatePortfolioRecommendations(portfolio) {
    const recommendations = [];

    if (!portfolio) return recommendations;

    // Diversification recommendations
    if (portfolio.metrics.diversification < 30) {
        recommendations.push({
            type: 'warning',
            category: 'diversification',
            title: 'Low Portfolio Diversification',
            message: `Your portfolio has a diversification score of ${portfolio.metrics.diversification.toFixed(0)}/100. Consider spreading your investments across more assets to reduce risk.`,
            action: 'Explore DeFi protocols and blue-chip altcoins',
        });
    }

    // Risk management
    if (portfolio.metrics.risk > 70) {
        recommendations.push({
            type: 'risk',
            category: 'risk',
            title: 'High Risk Portfolio',
            message: `Your portfolio has a risk score of ${portfolio.metrics.risk.toFixed(0)}/100. Consider allocating some funds to stablecoins for stability.`,
            action: 'Add USDC or DAI to balance risk',
        });
    }

    // Concentration risk
    const largestPosition = portfolio.eth.percentage > 50
        ? { symbol: 'ETH', percentage: portfolio.eth.percentage }
        : portfolio.tokens.find(t => t.percentage > 50);

    if (largestPosition && largestPosition.percentage > 50) {
        recommendations.push({
            type: 'info',
            category: 'concentration',
            title: `Heavy Concentration in ${largestPosition.symbol}`,
            message: `${largestPosition.symbol} represents ${largestPosition.percentage.toFixed(0)}% of your portfolio. Consider rebalancing to reduce concentration risk.`,
            action: 'Gradually reduce position and diversify',
        });
    }

    // Opportunity recommendations
    if (portfolio.totalValue > 1000 && portfolio.metrics.diversification > 50) {
        recommendations.push({
            type: 'opportunity',
            category: 'growth',
            title: 'Well-Balanced Portfolio',
            message: 'Your portfolio shows good diversification. Consider exploring yield farming opportunities to maximize returns.',
            action: 'Research DeFi yield strategies',
        });
    }

    return recommendations;
}

/**
 * Get portfolio strength analysis
 */
export function getPortfolioStrength(portfolio) {
    if (!portfolio) return { score: 0, grade: 'F', strengths: [], weaknesses: [] };

    const strengths = [];
    const weaknesses = [];

    // Analyze diversification
    if (portfolio.metrics.diversification > 60) {
        strengths.push('Well-diversified across multiple assets');
    } else if (portfolio.metrics.diversification < 30) {
        weaknesses.push('Low diversification increases risk');
    }

    // Analyze risk
    if (portfolio.metrics.risk < 40) {
        strengths.push('Conservative risk profile');
    } else if (portfolio.metrics.risk > 70) {
        weaknesses.push('High-risk allocation');
    }

    // Analyze stablecoin holdings
    const stablecoins = portfolio.tokens.filter(t => ['USDT', 'USDC', 'DAI'].includes(t.symbol));
    const stableRatio = stablecoins.reduce((sum, t) => sum + t.percentage, 0);

    if (stableRatio > 20 && stableRatio < 60) {
        strengths.push('Healthy stablecoin allocation');
    } else if (stableRatio < 10) {
        weaknesses.push('Low stablecoin holdings for volatility protection');
    }

    // Analyze asset count
    if (portfolio.metrics.assetCount >= 5) {
        strengths.push('Multiple asset holdings');
    } else if (portfolio.metrics.assetCount <= 2) {
        weaknesses.push('Limited asset variety');
    }

    // Calculate overall score
    const diversificationScore = portfolio.metrics.diversification * 0.4;
    const riskScore = (100 - portfolio.metrics.risk) * 0.3;
    const assetScore = Math.min(portfolio.metrics.assetCount * 10, 30);
    const totalScore = diversificationScore + riskScore + assetScore;

    // Determine grade
    let grade = 'F';
    if (totalScore >= 80) grade = 'A';
    else if (totalScore >= 70) grade = 'B';
    else if (totalScore >= 60) grade = 'C';
    else if (totalScore >= 50) grade = 'D';

    return {
        score: Math.round(totalScore),
        grade,
        strengths,
        weaknesses,
    };
}
