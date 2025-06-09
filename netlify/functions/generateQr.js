// netlify/functions/generateQr.js
const mercadopago = require("mercadopago");

exports.handler = async (event) => {
  try {
    // captura o valor enviado na querystring
    const { amount } = event.queryStringParameters || {};
    if (!amount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "O parâmetro `amount` é obrigatório." }),
      };
    }

    // usa o método correto para setar o token
    mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

    // cria o pagamento PIX
    const response = await mercadopago.qr.create({
      transaction_amount: Number(amount),
    });

    const qrBase64 =
      response.body.point_of_interaction.transaction_data.qr_code_base64;

    return {
      statusCode: 200,
      body: JSON.stringify({ qr: qrBase64 }),
    };
  } catch (err) {
    console.error("Erro ao gerar QR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
