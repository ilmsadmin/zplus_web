package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/google/uuid"
)

// Order holds the schema definition for the Order entity.
type Order struct {
	ent.Schema
}

// Fields of the Order.
func (Order) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			StorageKey("id"),
		field.String("order_number").
			Unique().
			NotEmpty(),
		field.Enum("status").
			Values("pending", "processing", "shipped", "delivered", "cancelled", "refunded").
			Default("pending"),
		field.Float("subtotal").
			Min(0),
		field.Float("tax_amount").
			Default(0).
			Min(0),
		field.Float("shipping_amount").
			Default(0).
			Min(0),
		field.Float("discount_amount").
			Default(0).
			Min(0),
		field.Float("total_amount").
			Min(0),
		field.String("currency").
			Default("USD"),
		field.JSON("billing_address", map[string]interface{}{}).
			Optional(),
		field.JSON("shipping_address", map[string]interface{}{}).
			Optional(),
		field.String("payment_method").
			Optional(),
		field.Enum("payment_status").
			Values("pending", "paid", "failed", "refunded").
			Default("pending"),
		field.String("shipping_method").
			Optional(),
		field.String("tracking_number").
			Optional(),
		field.Text("notes").
			Optional(),
		field.Time("shipped_at").
			Optional(),
		field.Time("delivered_at").
			Optional(),
		field.Time("created_at").
			Default(time.Now).
			Immutable(),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

// Edges of the Order.
func (Order) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("customer", User.Type).
			Ref("orders").
			Unique().
			Required(),
		edge.To("order_items", OrderItem.Type),
		edge.To("payments", Payment.Type),
	}
}

// Indexes of the Order.
func (Order) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("order_number"),
		index.Fields("status"),
		index.Fields("payment_status"),
		index.Fields("created_at"),
	}
}
