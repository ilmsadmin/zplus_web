package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.Int("id").
			Positive(),
		field.String("email").
			Unique().
			NotEmpty(),
		field.String("username").
			Unique().
			NotEmpty(),
		field.String("password_hash").
			NotEmpty().
			Sensitive(),
		field.String("full_name").
			Optional(),
		field.String("phone").
			Optional(),
		field.String("avatar_url").
			Optional(),
		field.Enum("role").
			Values("admin", "user").
			Default("user"),
		field.Bool("is_active").
			Default(true),
		field.Bool("email_verified").
			Default(false),
		field.Time("created_at").
			Default(time.Now).
			Immutable(),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return nil
}

// Indexes of the User.
func (User) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("email"),
		index.Fields("username"),
	}
}
