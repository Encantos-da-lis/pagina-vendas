const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { productId } = event.queryStringParameters;
    const priceMap = {
      '1': 2500,
      '2': 3000,
      '3': 3700,
      '4': 2000,
      '5': 3000,
    };
    const amount = priceMap[productId];
    if (!amount) throw new Error('Produto inválido');

    const res = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transaction_amount: amount / 100,
        description: `Colete ${productId}`,
        payment_method_id: 'pix'
      })
    });
    const payment = await res.json();
    if (payment.error) throw payment;

    return {
      statusCode: 200,
      body: JSON.stringify({ qr_code: payment.point_of_interaction.transaction_data.qr_code })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
