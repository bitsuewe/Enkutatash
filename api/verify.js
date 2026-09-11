/**
 * VERCEL SERVERLESS FUNCTION: /api/verify
 * 
 * Secure backend verification endpoint for Verify.ET on Vercel.
 * Environment Variables needed in Vercel Project Settings:
 *   - VERIFY_ET_API_KEY: Your Verify.ET API key (e.g. VERIFY_BANK_ET_...)
 *   - MERCHANT_PHONE: (Optional) 0933894394
 *   - MERCHANT_NAME: (Optional) Bitsue Wolde
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Please use POST.'
    });
  }

  try {
    const { transactionNumber, amount } = req.body || {};

    if (!transactionNumber || !transactionNumber.trim()) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'እባክዎ ትክክለኛ የቴሌብር ግብይት ቁጥር ያስገቡ። (Please enter a Telebirr transaction number)'
      });
    }

    const cleanReference = transactionNumber.trim().toUpperCase();
    const apiKey = process.env.VERIFY_ET_API_KEY;
    const merchantPhone = process.env.MERCHANT_PHONE || '0933894394';
    const merchantName = process.env.MERCHANT_NAME || 'Bitsue Wolde';
    const baseUrl = process.env.VERIFY_ET_BASE_URL || 'https://verify.et';

    // If no API key is provided in environment variables (e.g. testing mode)
    if (!apiKey || apiKey.includes('your_key_here')) {
      // Allow clean simulation for testing if key not set yet
      console.warn('VERIFY_ET_API_KEY is not set in environment variables. Falling back to test mode.');
      
      // Basic length check for test codes
      if (cleanReference.length < 6) {
        return res.status(400).json({
          success: false,
          verified: false,
          message: 'የተሳሳተ የቴሌብር ግብይት ቁጥር! እባክዎ ከደረሰኝዎ ላይ ትክክለኛውን ቁጥር ያስገቡ።'
        });
      }

      return res.status(200).json({
        success: true,
        verified: true,
        demoMode: true,
        message: 'Transaction verified (Test mode - add VERIFY_ET_API_KEY in Vercel for live bank validation)',
        data: {
          bank: 'telebirr',
          status: 'success',
          referenceNumber: cleanReference,
          receiverName: merchantName,
          receiverAccount: merchantPhone
        }
      });
    }

    // Call live Verify.ET gateway
    const targetUrl = `${baseUrl}/api/verify?waitMs=5000`;
    const verifyPayload = {
      bank: 'telebirr',
      transactionNumber: cleanReference,
      settlementAccount: merchantPhone
    };

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey.trim(),
        'Accept': 'application/json'
      },
      body: JSON.stringify(verifyPayload)
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        verified: false,
        message: responseData.message || 'ክፍያው በቴሌብር ኔትወርክ ላይ አልተረጋገጠም። እባክዎ ቁጥሩን አስተካክለው እንደገና ይሞክሩ።',
        raw: responseData
      });
    }

    const dataItem = Array.isArray(responseData?.data) && responseData.data.length > 0
      ? responseData.data[0]
      : (responseData?.data || {});

    const isVerified = Boolean(
      dataItem.verified ||
      (dataItem.status === 'success' && dataItem.verified !== false)
    );

    if (!isVerified) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'ይህ የግብይት ቁጥር አልተረጋገጠም ወይም ክፍያው አልተጠናቀቀም። እባክዎ ደግመው ይሞክሩ።',
        details: dataItem
      });
    }

    // Optional amount validation
    if (amount && Number(amount) > 0 && dataItem.amount) {
      const verifiedAmount = Number(dataItem.amount);
      if (verifiedAmount < Number(amount)) {
        return res.status(400).json({
          success: false,
          verified: false,
          message: `የተላከው መጠን (${verifiedAmount} ETB) ከተመረጠው የስጦታ መጠን (${amount} ETB) ያነሰ ነው።`
        });
      }
    }

    return res.status(200).json({
      success: true,
      verified: true,
      message: 'ክፍያው በተሳካ ሁኔታ ተረጋግጧል!',
      data: {
        bank: 'telebirr',
        referenceNumber: cleanReference,
        amount: dataItem.amount,
        senderName: dataItem.senderName,
        receiverName: merchantName,
        receiverPhone: merchantPhone
      }
    });

  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({
      success: false,
      verified: false,
      message: 'የመረጋገጥ ስህተት አጋጥሟል። እባክዎ ከጥቂት ደቂቃዎች በኋላ ይሞክሩ።'
    });
  }
}
