// netlify/functions/generateQr.js
const mercadopago = require("mercadopago");

exports.handler = async (event) => {
  try {
    const { amount } = event.queryStringParameters || {};
    if (!amount) {
      return { statusCode: 400, body: "Parâmetro `amount` é obrigatório" };
    }

    mercadopago.configure({
      access_token: process.env.MP_ACCESS_TOKEN,
    });

    const { point_of_interaction } = await mercadopago.qr.create({
      transaction_amount: Number(amount),
    });
    const qrBase64 = point_of_interaction.transaction_data.qr_code_base64;
    return {
      statusCode: 200,
      body: JSON.stringify({ qr: qrBase64 }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.message };
  }
};
