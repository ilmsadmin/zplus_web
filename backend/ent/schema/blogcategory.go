package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/google/uuid"
)

// BlogCategory holds the schema definition for the BlogCategory entity.
type BlogCategory struct {
	ent.Schema
}

// Fields of the BlogCategory.
func (BlogCategory) Fields() []ent.Field {
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
			Optional(),
		field.String("color").
			Optional(),
		field.String("icon").
			Optional(),
		field.Int("sort_order").
			Default(0),
		field.Bool("is_active").
			Default(true),
		field.Time("created_at").
			Default(time.Now).
			Immutable(),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

// Edges of the BlogCategory.
func (BlogCategory) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("blog_posts", BlogPost.Type),
	}
}

// Indexes of the BlogCategory.
func (BlogCategory) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("slug"),
		index.Fields("is_active"),
		index.Fields("sort_order"),
	}
}
