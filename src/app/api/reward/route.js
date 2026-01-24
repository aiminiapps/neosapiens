import { NextResponse } from 'next/server';

// ✅ NEOS Token Transaction API - Updated for NEO-SAPIENS Ecosystem

const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
const TOKEN_CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS;
const BSC_RPC_URL = 'https://bsc-dataseed1.binance.org';

console.log('🔧 NEOS Transaction API Configuration:');
console.log('- Admin Key:', ADMIN_PRIVATE_KEY ? '✅ Present' : '❌ Missing');
console.log('- Token Address:', TOKEN_CONTRACT_ADDRESS ? '✅ Present' : '❌ Missing');

const TRANSFER_FUNCTION_SIGNATURE = '0xa9059cbb';

// Nonce tracking to prevent replay attacks
const processedNonces = new Set();
// Clear nonces every 10 minutes to manage memory
setInterval(() => processedNonces.clear(), 600000);

// ✅ Direct RPC call helper
async function directRPCCall(method, params = []) {
  const response = await fetch(BSC_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: Date.now()
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(`RPC error: ${data.error.message}`);
  return data.result;
}

// ✅ Create BEP-20 transfer data manually
function createTransferData(recipientAddress, tokenAmountWei) {
  const cleanAddress = recipientAddress.replace('0x', '').toLowerCase();
  const paddedAddress = cleanAddress.padStart(64, '0');
  const amountHex = BigInt(tokenAmountWei).toString(16);
  const paddedAmount = amountHex.padStart(64, '0');
  const data = TRANSFER_FUNCTION_SIGNATURE + paddedAddress + paddedAmount;
  
  // Debug log (optional, can be removed in prod)
  // console.log('🔍 Transfer Data Construction:');
  // console.log('- Function Sig:', TRANSFER_FUNCTION_SIGNATURE);
  // console.log('- Address:', recipientAddress, '→', paddedAddress);
  // console.log('- Amount Wei:', tokenAmountWei, '→', paddedAmount);
  
  return data;
}

export async function POST(request) {
  const startTime = Date.now();
  console.log('\n🎯 NEOS Transaction API called at:', new Date().toISOString());

  try {
    // Environment validation
    if (!ADMIN_PRIVATE_KEY || !TOKEN_CONTRACT_ADDRESS) {
      console.error('❌ Server Config Error: Missing Env Variables');
      return NextResponse.json({
        error: 'Server misconfiguration: Missing environment variables'
      }, { status: 500 });
    }

    // Parse request
    const body = await request.json();
    const { taskId, address, message, signature, nonce, expiry, reward, isWelcomeBonus } = body;

    console.log('📦 Processing:', isWelcomeBonus ? 'Welcome Bonus' : `Task: ${taskId}`);
    console.log('👤 To User:', address);
    console.log('💰 Amount:', reward, 'NEOS');

    // Load ethers v6
    const ethers = await import('ethers');
    const ethersLib = ethers.default || ethers;

    // Create wallet from private key
    const adminWallet = new ethersLib.Wallet(ADMIN_PRIVATE_KEY);

    // Validate recipient is not admin
    if (address.toLowerCase() === adminWallet.address.toLowerCase()) {
      console.error('❌ Self-transfer detected!');
      return NextResponse.json({
        error: 'Invalid recipient: cannot send to admin wallet'
      }, { status: 400 });
    }

    // Basic validation
    if (!address || !message || !signature || !reward) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate address format
    if (!ethersLib.isAddress(address)) {
      return NextResponse.json({ error: 'Invalid address format' }, { status: 400 });
    }

    // Verify signature
    try {
      const recoveredAddress = ethersLib.verifyMessage(message, signature);
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        console.error('❌ Signature mismatch');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
      console.log('✅ Signature verified');
    } catch (sigError) {
      console.error('Signature error:', sigError);
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 });
    }

    // Expiry and nonce checks
    const now = Math.floor(Date.now() / 1000);
    if (now > parseInt(expiry)) {
      return NextResponse.json({ error: 'Request expired' }, { status: 400 });
    }

    const nonceKey = `${address}_${nonce}`;
    if (processedNonces.has(nonceKey)) {
      return NextResponse.json({ error: 'Nonce already used' }, { status: 409 });
    }

    processedNonces.add(nonceKey);

    // ✅ Task validation - Updated for NEO-SAPIENS Task Center
    const validTasks = {
      followX: 100,
      likeX: 50,
      commentX: 75,
      retweetX: 60,
      joinTelegram: 80,
      shareX: 90,
      welcomeBonus: 10
    };

    if (!isWelcomeBonus) {
      if (!validTasks[taskId]) {
        return NextResponse.json({ error: 'Invalid Task ID' }, { status: 400 });
      }
      if (reward !== validTasks[taskId]) {
        console.warn(`⚠️ Reward mismatch. Req: ${reward}, Expected: ${validTasks[taskId]}`);
        return NextResponse.json({ error: 'Invalid reward amount for this task' }, { status: 400 });
      }
    } else {
      // Validate welcome bonus amount
      if (reward !== validTasks.welcomeBonus) {
         return NextResponse.json({ error: 'Invalid welcome bonus amount' }, { status: 400 });
      }
    }

    console.log('✅ All validations passed');

    // Test RPC connection
    const blockNumber = await directRPCCall('eth_blockNumber');
    console.log('✅ RPC working, block:', parseInt(blockNumber, 16));

    // Get admin nonce and gas price
    const [adminNonce, gasPrice] = await Promise.all([
      directRPCCall('eth_getTransactionCount', [adminWallet.address, 'pending']),
      directRPCCall('eth_gasPrice')
    ]);

    // Add 20% buffer to gas price for faster inclusion
    const bufferedGasPrice = Math.floor(parseInt(gasPrice, 16) * 1.2);

    // Token amount calculation (18 decimals standard for BEP-20)
    const decimals = 18;
    const tokenAmountWei = ethersLib.parseUnits(reward.toString(), decimals);
    console.log('💰 Token amount (wei):', tokenAmountWei.toString());

    // Transaction data encoding
    const transactionData = createTransferData(address, tokenAmountWei.toString());

    // Build raw transaction
    const rawTransaction = {
      nonce: adminNonce,
      gasPrice: '0x' + bufferedGasPrice.toString(16),
      gasLimit: '0x186A0', // 100,000 gas limit (usually enough for transfer)
      to: TOKEN_CONTRACT_ADDRESS,
      value: '0x0',
      data: transactionData,
      chainId: 56 // 56 for BSC Mainnet
    };

    console.log('🔨 Transaction built');

    // Sign and broadcast
    const signedTx = await adminWallet.signTransaction(rawTransaction);
    const txHash = await directRPCCall('eth_sendRawTransaction', [signedTx]);
    console.log('📤 Transaction sent:', txHash);

    // Wait for confirmation (polling loop - max 30s)
    let receipt = null;
    let attempts = 0;

    while (!receipt && attempts < 30) {
      try {
        receipt = await directRPCCall('eth_getTransactionReceipt', [txHash]);
        if (receipt) break;
      } catch (error) {
        // Receipt not available yet, continue waiting
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // If still no receipt after 30s, return pending status
    if (!receipt) {
      return NextResponse.json({
        success: true,
        txHash,
        amount: reward,
        recipient: address,
        status: 'pending',
        explorer: `https://bscscan.com/tx/${txHash}`,
        message: 'Transaction sent, confirmation pending on chain'
      });
    }

    // Check receipt status (0x1 = success)
    const status = parseInt(receipt.status, 16);
    if (status !== 1) {
      console.error('❌ Transaction failed on chain');
      return NextResponse.json({
        error: 'Transaction reverted on blockchain',
        txHash,
        explorer: `https://bscscan.com/tx/${txHash}`
      }, { status: 500 });
    }

    const processingTime = Date.now() - startTime;

    console.log('🎉 NEOS TRANSACTION SUCCESSFUL!');
    console.log('✅ Sent', reward, 'NEOS from', adminWallet.address, 'to', address);
    console.log('✅ TX Hash:', txHash);
    console.log('⏱️ Processing time:', processingTime, 'ms');

    return NextResponse.json({
      success: true,
      txHash,
      blockNumber: parseInt(receipt.blockNumber, 16),
      gasUsed: parseInt(receipt.gasUsed, 16),
      amount: reward,
      symbol: 'NEOS',
      recipient: address,
      sender: adminWallet.address,
      processingTime,
      explorer: `https://bscscan.com/tx/${txHash}`,
      timestamp: new Date().toISOString(),
      mode: 'REAL_TRANSACTION_BSC'
    });

  } catch (error) {
    console.error('❌ Transaction Error:', error);
    return NextResponse.json({
      error: 'Transaction failed: ' + error.message,
      details: error.toString()
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const ethers = await import('ethers');
    const ethersLib = ethers.default || ethers;
    const adminWallet = new ethersLib.Wallet(ADMIN_PRIVATE_KEY);
    const blockNumber = await directRPCCall('eth_blockNumber');

    return NextResponse.json({
      status: 'healthy',
      system: 'NEOS-SAPIENS Reward Gateway',
      mode: 'REAL_TRANSACTIONS_BSC',
      blockNumber: parseInt(blockNumber, 16),
      adminWallet: adminWallet.address,
      tokenContract: TOKEN_CONTRACT_ADDRESS,
      tokenSymbol: 'NEOS',
      network: 'Binance Smart Chain (Mainnet)',
      chainId: 56,
      rpcUrl: BSC_RPC_URL,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message
    }, { status: 503 });
  }
}