import Stripe from "stripe";
import dotenv from 'dotenv'

dotenv.config()


export default class PaymentService {
    static async StripeIntent(totalPrice, user) {
        const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY);
        
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: parseInt(Math.round(totalPrice * 100)),
                currency: "aed",
                description: `Payment for ${user.email}`,
                automatic_payment_methods: { enabled: true },
                metadata: {
                    user_id: user._id,
                    email: user.email,
                    phone: user.phone || 'N/A'
                },
              })
              if (!paymentIntent.client_secret) {
                throw new Error('No client secret returned');
            }
            
            return { 
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id 
            };
        } catch (error) {
            console.error("Stripe checkout error:", error);
            throw error;
        }
    }
}

/* export default class PaymentService {
    static async StripeIntent(data) {
        const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY);
        
        try {
            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: { 
                            currency: 'aed',
                            product_data: { 
                                name: "T-Shirt" 
                            },
                            unit_amount: 2000,  // Changed from unitAmount to unit_amount
                        },
                        quantity: 1  // Don't forget to include quantity
                    }
                ],
                mode: 'payment',
                ui_mode: 'embedded',  // Changed from 'custom' to 'embedded' (if you're using the new embedded checkout)
                return_url: "http://localhost:3000"  // Replace with your actual return URL
            });
            
            return {
                clientSecret: session.client_secret,
                sessionId: session.id
            };
        } catch (error) {
            console.error("Error creating Stripe session:", error);
            throw error;
        }
    }
} */