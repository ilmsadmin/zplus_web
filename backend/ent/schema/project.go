package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/google/uuid"
)

// Project holds the schema definition for the Project entity.
type Project struct {
	ent.Schema
}

// Fields of the Project.
func (Project) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			StorageKey("id"),
		field.String("title").
			NotEmpty(),
		field.String("slug").
			Unique().
			NotEmpty(),
		field.Text("description").
			NotEmpty(),
		field.Text("content").
			Optional(),
		field.String("featured_image").
			Optional(),
		field.JSON("gallery", []string{}).
			Optional(),
		field.JSON("technologies", []string{}).
			Optional(),
		field.String("github_url").
			Optional(),
		field.String("demo_url").
			Optional(),
		field.String("client_name").
			Optional(),
		field.Enum("status").
			Values("planning", "in_progress", "completed", "on_hold").
			Default("planning"),
		field.Enum("project_type").
			Values("web", "mobile", "desktop", "api", "devops", "design").
			Default("web"),
		field.Float("price").
			Optional(),
		field.Time("start_date").
			Optional(),
		field.Time("end_date").
			Optional(),
		field.Bool("featured").
			Default(false),
		field.Int("view_count").
			Default(0),
		field.Time("created_at").
			Default(time.Now).
			Immutable(),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

// Edges of the Project.
func (Project) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("owner", User.Type).
			Ref("projects").
			Unique(),
	}
}

// Indexes of the Project.
func (Project) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("slug"),
		index.Fields("status"),
		index.Fields("project_type"),
		index.Fields("featured"),
		index.Fields("created_at"),
	}
}
