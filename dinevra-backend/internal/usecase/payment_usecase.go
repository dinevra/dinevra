package usecase

import (
	"context"
	"fmt"
	"os"

	"github.com/google/uuid"
	"github.com/stripe/stripe-go/v78"
	"github.com/stripe/stripe-go/v78/paymentintent"
	"dinevra-backend/internal/domain"
)

type PaymentUsecase interface {
	CreatePaymentIntent(ctx context.Context, orderID uuid.UUID, amount float64) (*string, error)
	HandleStripeWebhook(ctx context.Context, payload []byte, signature string) error
}

type paymentUsecase struct {
	orderRepo   domain.OrderRepository
	broadcaster EventBroadcaster
}

func NewPaymentUsecase(orderRepo domain.OrderRepository, broadcaster EventBroadcaster) PaymentUsecase {
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")
	return &paymentUsecase{
		orderRepo:   orderRepo,
		broadcaster: broadcaster,
	}
}

func (u *paymentUsecase) CreatePaymentIntent(ctx context.Context, orderID uuid.UUID, amount float64) (*string, error) {
	// Stripe expects amount in cents
	amountCents := int64(amount * 100)

	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(amountCents),
		Currency: stripe.String(string(stripe.CurrencyUSD)),
		PaymentMethodTypes: stripe.StringSlice([]string{"card_present"}), // BBPOS terminal requirement
		CaptureMethod: stripe.String(string(stripe.PaymentIntentCaptureMethodManual)),
	}
	// Attach internal OrderID as metadata to retrieve during webhook
	params.AddMetadata("order_id", orderID.String())

	pi, err := paymentintent.New(params)
	if err != nil {
		return nil, fmt.Errorf("failed to create Stripe PaymentIntent: %w", err)
	}

	return &pi.ClientSecret, nil
}

func (u *paymentUsecase) HandleStripeWebhook(ctx context.Context, payload []byte, signature string) error {
	// In a real app we would use webhook.ConstructEvent to verify the signature
	// Here we simulate the logic assuming the signature is valid.
	
	// event, err := webhook.ConstructEvent(payload, signature, os.Getenv("STRIPE_WEBHOOK_SECRET"))
	// if err != nil { return err }

	// For demonstration, we simply log it or unmarshal if we had real test payloads.
	// Normally we intercept the 'payment_intent.amount_capturable_updated'
	// and update our DB status to 'paid', then broadcast it via WebSockets.
	
	// mock Order id extraction
	orderIDStr := "mocked_order_id_from_metadata"
	orderID, err := uuid.Parse(orderIDStr)
	if err == nil {
		_ = u.orderRepo.UpdateStatus(ctx, orderID, "paid")
		if u.broadcaster != nil {
			// Find kitendID safely... assuming we got it from the order
			// _ = u.broadcaster.BroadcastOrderStatusUpdated(ctx, kitchenID, orderID, "paid")
		}
	}

	return nil
}
