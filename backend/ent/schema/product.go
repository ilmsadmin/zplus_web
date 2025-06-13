package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/google/uuid"
)

// Product holds the schema definition for the Product entity.
type Product struct {
	ent.Schema
}

// Fields of the Product.
func (Product) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			StorageKey("id"),
		field.String("name").
			NotEmpty(),
		field.String("slug").
			Unique().
			NotEmpty(),
		field.Text("description").
			NotEmpty(),
		field.Text("short_description").
			Optional(),
		field.String("featured_image").
			Optional(),
		field.JSON("gallery", []string{}).
			Optional(),
		field.Float("price").
			Min(0),
		field.Float("sale_price").
			Optional().
			Min(0),
		field.String("sku").
			Unique().
			Optional(),
		field.Int("stock_quantity").
			Default(0).
			Min(0),
		field.Bool("manage_stock").
			Default(true),
		field.Enum("stock_status").
			Values("in_stock", "out_of_stock", "on_backorder").
			Default("in_stock"),
		field.Enum("status").
			Values("draft", "published", "archived").
			Default("draft"),
		field.JSON("attributes", map[string]interface{}{}).
			Optional(),
		field.Float("weight").
			Optional().
			Min(0),
		field.JSON("dimensions", map[string]float64{}).
			Optional(),
		field.String("download_url").
			Optional(),
		field.Bool("is_digital").
			Default(false),
		field.Bool("featured").
			Default(false),
		field.Int("sales_count").
			Default(0),
		field.Time("created_at").
			Default(time.Now).
			Immutable(),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

// Edges of the Product.
func (Product) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("order_items", OrderItem.Type),
	}
}

// Indexes of the Product.
func (Product) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("slug"),
		index.Fields("sku"),
		index.Fields("status"),
		index.Fields("featured"),
		index.Fields("price"),
		index.Fields("created_at"),
	}
}
