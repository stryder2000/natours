import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51H8TgkGn4dG3D9SdQfijUzjxRbENvm3xxwrzByxg66rzoU4bI5wtd8cdXjbwWlOyIvCXDA5fM95SmHQxp8Q03I7S00Dnd7fjg2'
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
