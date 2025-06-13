package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/google/uuid"
)

// WordPressSite holds the schema definition for the WordPressSite entity.
type WordPressSite struct {
	ent.Schema
}

// Fields of the WordPressSite.
func (WordPressSite) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			StorageKey("id"),
		field.String("name").
			NotEmpty(),
		field.String("url").
			NotEmpty(),
		field.String("username").
			NotEmpty(),
		field.String("password").
			NotEmpty().
			Sensitive(),
		field.String("api_key").
			Optional().
			Sensitive(),
		field.Bool("is_active").
			Default(true),
		field.Time("last_sync").
			Optional(),
		field.Enum("sync_status").
			Values("idle", "syncing", "error").
			Default("idle"),
		field.Text("sync_logs").
			Optional(),
		field.JSON("settings", map[string]interface{}{}).
			Optional(),
		field.Time("created_at").
			Default(time.Now).
			Immutable(),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

// Edges of the WordPressSite.
func (WordPressSite) Edges() []ent.Edge {
	return nil
}

// Indexes of the WordPressSite.
func (WordPressSite) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("url"),
		index.Fields("is_active"),
		index.Fields("sync_status"),
	}
}
