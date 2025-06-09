// netlify/functions/generateQr.js
import fetch from "node-fetch";
import { MercadoPago } from "mercadopago";

// Inicializa o client com seu token
const mp = new MercadoPago({
  access_token: process.env.MP_ACCESS_TOKEN,
});

export const handler = async (event) => {
  try {
    const { amount } = event.queryStringParameters || {};
    if (!amount) {
      return { statusCode: 400, body: JSON.stringify({ error: "`amount` é obrigatório." }) };
    }

    // 1) Cria a preferência (checkout)
    const prefResponse = await mp.preferences.create({
      items: [{ title: "Coletes Country", quantity: 1, currency_id: "BRL", unit_price: Number(amount) }],
    });
    const preference = prefResponse.body;

    // 2) Cria o pagamento PIX (nova API v2)
    const paymentResponse = await mp.payment.create({
      transaction_amount: Number(amount),
      description: "Coletes Country",
      payment_method_id: "pix",
      external_reference: preference.id,
    });
    const payment = paymentResponse.body;

    // 3) Extrai o QR Code (base64 ou URL)
    const qrCode = payment.point_of_interaction.transaction_data.qr_code;
    // se precisar do base64: payment.point_of_interaction.transaction_data.qr_code_base64

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qr: qrCode }),
    };
  } catch (err) {
    console.error("Erro na função generateQr:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
