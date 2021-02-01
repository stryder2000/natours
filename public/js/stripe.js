import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'sk_test_51H8TgkGn4dG3D9SdasKbVTzaH1LGjcrfuagNafcR7tQrItqm7zxNLZbUiwb0xXlj05xOuOi6riuLPI3Vib940MrG00RlUsj2Bn'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    //        console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err.message);
  }
};
