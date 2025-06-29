// Code generated by ent, DO NOT EDIT.

package ent

import (
	"time"
	"zplus_web/backend/ent/schema"
	"zplus_web/backend/ent/user"

	"github.com/google/uuid"
)

// The init function reads all schema descriptors with runtime code
// (default values, validators, hooks and policies) and stitches it
// to their package variables.
func init() {
	userFields := schema.User{}.Fields()
	_ = userFields
	// userDescEmail is the schema descriptor for email field.
	userDescEmail := userFields[1].Descriptor()
	// user.EmailValidator is a validator for the "email" field. It is called by the builders before save.
	user.EmailValidator = userDescEmail.Validators[0].(func(string) error)
	// userDescUsername is the schema descriptor for username field.
	userDescUsername := userFields[2].Descriptor()
	// user.UsernameValidator is a validator for the "username" field. It is called by the builders before save.
	user.UsernameValidator = userDescUsername.Validators[0].(func(string) error)
	// userDescPasswordHash is the schema descriptor for password_hash field.
	userDescPasswordHash := userFields[3].Descriptor()
	// user.PasswordHashValidator is a validator for the "password_hash" field. It is called by the builders before save.
	user.PasswordHashValidator = userDescPasswordHash.Validators[0].(func(string) error)
	// userDescEmailVerified is the schema descriptor for email_verified field.
	userDescEmailVerified := userFields[7].Descriptor()
	// user.DefaultEmailVerified holds the default value on creation for the email_verified field.
	user.DefaultEmailVerified = userDescEmailVerified.Default.(bool)
	// userDescPoints is the schema descriptor for points field.
	userDescPoints := userFields[8].Descriptor()
	// user.DefaultPoints holds the default value on creation for the points field.
	user.DefaultPoints = userDescPoints.Default.(int)
	// userDescWalletBalance is the schema descriptor for wallet_balance field.
	userDescWalletBalance := userFields[9].Descriptor()
	// user.DefaultWalletBalance holds the default value on creation for the wallet_balance field.
	user.DefaultWalletBalance = userDescWalletBalance.Default.(float64)
	// userDescCreatedAt is the schema descriptor for created_at field.
	userDescCreatedAt := userFields[10].Descriptor()
	// user.DefaultCreatedAt holds the default value on creation for the created_at field.
	user.DefaultCreatedAt = userDescCreatedAt.Default.(func() time.Time)
	// userDescUpdatedAt is the schema descriptor for updated_at field.
	userDescUpdatedAt := userFields[11].Descriptor()
	// user.DefaultUpdatedAt holds the default value on creation for the updated_at field.
	user.DefaultUpdatedAt = userDescUpdatedAt.Default.(func() time.Time)
	// user.UpdateDefaultUpdatedAt holds the default value on update for the updated_at field.
	user.UpdateDefaultUpdatedAt = userDescUpdatedAt.UpdateDefault.(func() time.Time)
	// userDescID is the schema descriptor for id field.
	userDescID := userFields[0].Descriptor()
	// user.DefaultID holds the default value on creation for the id field.
	user.DefaultID = userDescID.Default.(func() uuid.UUID)
}
