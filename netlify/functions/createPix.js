// netlify/functions/createPix.js
import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

export const handler = async (event) => {
  try {
    const { amount, title } = JSON.parse(event.body);

    const preference = {
      items: [
        {
          title,
          quantity: 1,
          currency_id: "BRL",
          unit_price: amount,
        },
      ],
      payment_methods: {
        excluded_payment_types: [{ id: "credit_card" }], // opcional
      },
    };

    const response = await mercadopago.preferences.create(preference);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        init_point: response.body.init_point,
        qr_code: response.body.point_of_interaction.transaction_data.qr_code, 
        qr_base64: response.body.point_of_interaction.transaction_data.qr_code_base64,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
