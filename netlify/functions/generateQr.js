const mercadopago = require("mercadopago");

exports.handler = async (event) => {
  try {
    const { product } = event.queryStringParameters || {};
    const prices = {
      "1": 25.0,
      "2": 30.0,
      "3": 37.0,
      "4": 20.0,
      "5": 30.0
    };
    const price = prices[product];
    if (!price) {
      return { statusCode: 400, body: "Produto inválido" };
    }

    mercadopago.configure({
      access_token: process.env.MP_ACCESS_TOKEN
    });

    const preference = await mercadopago.payment.create({
      transaction_amount: price,
      description: `Produto ${product}`,
      payment_method_id: "pix"
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        qrCode: preference.body.point_of_interaction.transaction_data.qr_code,
        qrImage: preference.body.point_of_interaction.transaction_data.qr_code_base64
      })
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};