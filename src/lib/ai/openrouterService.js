import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://neo-sapiens.app',
        'X-Title': 'NEO-SAPIENS AI Intelligence Platform',
    },
});

/**
 * Analyze blockchain data using OpenRouter AI
 */
export async function analyzeWithAI(prompt, context) {
    try {
        const completion = await openRouter.chat.send({
            model: 'openai/gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content: 'You are a NEO-SAPIENS AI agent analyzing blockchain data for economic signals. Provide concise, actionable insights based on on-chain activity. Focus on economic intent and market impact.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            stream: false,
            temperature: 0.7,
            max_tokens: 300,
        });

        return {
            analysis: completion.choices[0].message.content,
            success: true,
        };
    } catch (error) {
        console.error('OpenRouter AI analysis error:', error);
        return {
            analysis: null,
            success: false,
            error: error.message,
        };
    }
}

/**
 * Generate AI-powered signal explanation
 */
export async function generateSignalExplanation(transactionData) {
    const prompt = `Analyze this Ethereum transaction:
- Value: ${transactionData.value} ETH
- From: ${transactionData.from}
- To: ${transactionData.to}
- Gas Price: ${transactionData.gasPrice} Gwei

Provide a 2-3 sentence analysis of the economic intent and potential market impact. Be specific and actionable.`;

    const result = await analyzeWithAI(prompt);
    return result.analysis;
}

/**
 * Evaluate AI agent performance
 */
export async function evaluateAgentPrediction(signal, actualOutcome) {
    const prompt = `Evaluate this AI prediction:
Signal Type: ${signal.type}
Intent Score: ${signal.intentScore}
Prediction: ${signal.explanation}
Actual Outcome: ${actualOutcome}

Was the prediction accurate? Respond with just "accurate" or "inaccurate" and a brief 1-sentence why.`;

    const result = await analyzeWithAI(prompt);

    if (result.success) {
        const isAccurate = result.analysis.toLowerCase().includes('accurate') &&
            !result.analysis.toLowerCase().includes('inaccurate');
        return {
            accurate: isAccurate,
            reasoning: result.analysis,
        };
    }

    return { accurate: null, reasoning: null };
}

/**
 * Generate market insight summary
 */
export async function generateMarketInsight(signals) {
    if (!signals || signals.length === 0) {
        return 'No recent signals to analyze.';
    }

    const signalSummary = signals.slice(0, 5).map(s =>
        `${s.type.toUpperCase()}: ${s.explanation.substring(0, 100)}...`
    ).join('\n');

    const prompt = `Based on these recent on-chain signals:
${signalSummary}

Provide a concise 2-3 sentence market outlook. What's the overall economic sentiment?`;

    const result = await analyzeWithAI(prompt);
    return result.analysis || 'Unable to generate market insight.';
}
