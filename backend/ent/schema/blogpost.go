package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/google/uuid"
)

// BlogPost holds the schema definition for the BlogPost entity.
type BlogPost struct {
	ent.Schema
}

// Fields of the BlogPost.
func (BlogPost) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			StorageKey("id"),
		field.String("title").
			NotEmpty(),
		field.String("slug").
			Unique().
			NotEmpty(),
		field.Text("content").
			NotEmpty(),
		field.Text("excerpt").
			Optional(),
		field.String("featured_image").
			Optional(),
		field.JSON("meta_tags", []string{}).
			Optional(),
		field.String("meta_description").
			Optional(),
		field.Enum("status").
			Values("draft", "published", "archived").
			Default("draft"),
		field.Bool("featured").
			Default(false),
		field.Int("view_count").
			Default(0),
		field.Int("like_count").
			Default(0),
		field.Time("published_at").
			Optional(),
		field.Time("created_at").
			Default(time.Now).
			Immutable(),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

// Edges of the BlogPost.
func (BlogPost) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("author", User.Type).
			Ref("blog_posts").
			Unique(),
		edge.From("category", BlogCategory.Type).
			Ref("blog_posts").
			Unique(),
	}
}

// Indexes of the BlogPost.
func (BlogPost) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("slug"),
		index.Fields("status"),
		index.Fields("published_at"),
		index.Fields("created_at"),
		index.Fields("featured"),
	}
}
