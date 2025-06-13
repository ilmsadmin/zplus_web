package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/google/uuid"
)

// Payment holds the schema definition for the Payment entity.
type Payment struct {
	ent.Schema
}

// Fields of the Payment.
func (Payment) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			StorageKey("id"),
		field.String("transaction_id").
			Unique().
			NotEmpty(),
		field.Float("amount").
			Min(0.01),
		field.String("currency").
			Default("USD"),
		field.Enum("payment_method").
			Values("credit_card", "paypal", "bank_transfer", "crypto", "wallet").
			Default("credit_card"),
		field.Enum("status").
			Values("pending", "processing", "completed", "failed", "cancelled", "refunded").
			Default("pending"),
		field.String("gateway").
			Optional(),
		field.String("gateway_transaction_id").
			Optional(),
		field.JSON("gateway_response", map[string]interface{}{}).
			Optional(),
		field.String("failure_reason").
			Optional(),
		field.Time("processed_at").
			Optional(),
		field.Time("created_at").
			Default(time.Now).
			Immutable(),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

// Edges of the Payment.
func (Payment) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("payments").
			Unique().
			Required(),
		edge.From("order", Order.Type).
			Ref("payments").
			Unique(),
	}
}

// Indexes of the Payment.
func (Payment) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("transaction_id"),
		index.Fields("status"),
		index.Fields("payment_method"),
		index.Fields("created_at"),
	}
}
