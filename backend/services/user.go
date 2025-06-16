package services

import (
	"database/sql"
	"fmt"
	"time"

	"zplus_web/backend/models"
	"zplus_web/backend/utils"
)

type UserService struct {
	db *sql.DB
}

func NewUserService(db *sql.DB) *UserService {
	return &UserService{db: db}
}

// CreateUser creates a new user with hashed password
func (s *UserService) CreateUser(req models.RegisterRequest) (*models.User, error) {
	// Hash the password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	// Check if user already exists
	var existingID int
	err = s.db.QueryRow("SELECT id FROM users WHERE email = $1 OR username = $2", req.Email, req.Username).Scan(&existingID)
	if err == nil {
		return nil, fmt.Errorf("user with email or username already exists")
	} else if err != sql.ErrNoRows {
		return nil, fmt.Errorf("failed to check existing user: %w", err)
	}

	// Create the user
	var user models.User
	err = s.db.QueryRow(`
		INSERT INTO users (username, email, password_hash, full_name, phone, role, is_active, email_verified, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, 'user', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		RETURNING id, username, email, role, full_name, phone, avatar_url, is_active, email_verified, created_at, updated_at`,
		req.Username, req.Email, hashedPassword, req.FullName, req.Phone).Scan(
		&user.ID, &user.Username, &user.Email, &user.Role, &user.FullName, &user.Phone,
		&user.AvatarURL, &user.IsActive, &user.EmailVerified, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return &user, nil
}

// AuthenticateUser validates user credentials and returns user info
func (s *UserService) AuthenticateUser(email, password string) (*models.User, error) {
	var user models.User
	err := s.db.QueryRow(`
		SELECT id, username, email, password_hash, role, full_name, phone, avatar_url, is_active, email_verified, created_at, updated_at
		FROM users WHERE email = $1`, email).Scan(
		&user.ID, &user.Username, &user.Email, &user.PasswordHash, &user.Role,
		&user.FullName, &user.Phone, &user.AvatarURL, &user.IsActive, &user.EmailVerified,
		&user.CreatedAt, &user.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	} else if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	// Check if user is active
	if !user.IsActive {
		return nil, fmt.Errorf("user account is deactivated")
	}

	// Verify password
	if !utils.CheckPasswordHash(password, user.PasswordHash) {
		return nil, fmt.Errorf("invalid password")
	}

	return &user, nil
}

// CreateSession creates a new user session
func (s *UserService) CreateSession(userID int, token string, expiresAt time.Time) error {
	_, err := s.db.Exec(`
		INSERT INTO user_sessions (user_id, token, expires_at, created_at)
		VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
		userID, token, expiresAt)
	return err
}

// InvalidateSession removes a user session
func (s *UserService) InvalidateSession(token string) error {
	_, err := s.db.Exec("DELETE FROM user_sessions WHERE token = $1", token)
	return err
}

// GetUserByID retrieves a user by ID
func (s *UserService) GetUserByID(id int) (*models.User, error) {
	var user models.User
	err := s.db.QueryRow(`
		SELECT id, username, email, role, full_name, phone, avatar_url, is_active, email_verified, created_at, updated_at
		FROM users WHERE id = $1`, id).Scan(
		&user.ID, &user.Username, &user.Email, &user.Role,
		&user.FullName, &user.Phone, &user.AvatarURL, &user.IsActive, &user.EmailVerified,
		&user.CreatedAt, &user.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	} else if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	return &user, nil
}

// UpdateUser updates user profile information
func (s *UserService) UpdateUser(userID int, req models.UpdateProfileRequest) (*models.User, error) {
	var user models.User
	err := s.db.QueryRow(`
		UPDATE users SET full_name = $1, phone = $2, avatar_url = $3, updated_at = CURRENT_TIMESTAMP
		WHERE id = $4
		RETURNING id, username, email, role, full_name, phone, avatar_url, is_active, email_verified, created_at, updated_at`,
		req.FullName, req.Phone, req.AvatarURL, userID).Scan(
		&user.ID, &user.Username, &user.Email, &user.Role,
		&user.FullName, &user.Phone, &user.AvatarURL, &user.IsActive, &user.EmailVerified,
		&user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}

	return &user, nil
}

// ChangePassword changes user password
func (s *UserService) ChangePassword(userID int, currentPassword, newPassword string) error {
	// Get current password hash
	var currentHash string
	err := s.db.QueryRow("SELECT password_hash FROM users WHERE id = $1", userID).Scan(&currentHash)
	if err != nil {
		return fmt.Errorf("failed to get current password: %w", err)
	}

	// Verify current password
	if !utils.CheckPasswordHash(currentPassword, currentHash) {
		return fmt.Errorf("current password is incorrect")
	}

	// Hash new password
	newHash, err := utils.HashPassword(newPassword)
	if err != nil {
		return fmt.Errorf("failed to hash new password: %w", err)
	}

	// Update password
	_, err = s.db.Exec("UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", newHash, userID)
	if err != nil {
		return fmt.Errorf("failed to update password: %w", err)
	}

	return nil
}

// GetAllUsers retrieves all users from the database
func (s *UserService) GetAllUsers() ([]models.User, error) {
	rows, err := s.db.Query(`
		SELECT id, username, email, role, full_name, phone, avatar_url, 
		       is_active, email_verified, created_at, updated_at
		FROM users ORDER BY created_at DESC`)
	if err != nil {
		return nil, fmt.Errorf("failed to query users: %w", err)
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		err := rows.Scan(
			&user.ID, &user.Username, &user.Email, &user.Role,
			&user.FullName, &user.Phone, &user.AvatarURL, &user.IsActive, 
			&user.EmailVerified, &user.CreatedAt, &user.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan user: %w", err)
		}
		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating users: %w", err)
	}

	return users, nil
}

// DeleteUser deletes a user by ID
func (s *UserService) DeleteUser(userID int) error {
	result, err := s.db.Exec("DELETE FROM users WHERE id = $1", userID)
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}

// UpdateUserRole updates a user's role
func (s *UserService) UpdateUserRole(userID int, role string) error {
	result, err := s.db.Exec(`
		UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP 
		WHERE id = $2`, role, userID)
	if err != nil {
		return fmt.Errorf("failed to update user role: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}