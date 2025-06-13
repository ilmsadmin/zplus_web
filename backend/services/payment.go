package services

import (
	"database/sql"
	"fmt"
	"time"

	"zplus_web/backend/models"
	"zplus_web/backend/utils"
)

type PaymentService struct {
	db *sql.DB
}

func NewPaymentService(db *sql.DB) *PaymentService {
	return &PaymentService{db: db}
}

// GetWallet retrieves user's wallet information
func (s *PaymentService) GetWallet(userID int) (*models.CustomerWallet, error) {
	var wallet models.CustomerWallet
	
	err := s.db.QueryRow(`
		SELECT id, user_id, balance, total_deposited, total_spent, created_at, updated_at
		FROM customer_wallets WHERE user_id = $1`, userID).Scan(
		&wallet.ID, &wallet.UserID, &wallet.Balance, &wallet.TotalDeposited, &wallet.TotalSpent,
		&wallet.CreatedAt, &wallet.UpdatedAt)

	if err == sql.ErrNoRows {
		// Create wallet if it doesn't exist
		return s.createWallet(userID)
	} else if err != nil {
		return nil, fmt.Errorf("failed to get wallet: %w", err)
	}

	return &wallet, nil
}

// CreateDepositTransaction creates a deposit transaction
func (s *PaymentService) CreateDepositTransaction(userID int, amount float64, paymentMethod string) (*models.WalletTransaction, error) {
	// Get current wallet
	wallet, err := s.GetWallet(userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get wallet: %w", err)
	}

	// Generate reference ID
	referenceID := fmt.Sprintf("DEP_%d_%s", userID, utils.GenerateRandomString(8))

	// Create transaction record
	var transaction models.WalletTransaction
	err = s.db.QueryRow(`
		INSERT INTO wallet_transactions (user_id, transaction_type, amount, balance_after, description, reference_id, status, created_at)
		VALUES ($1, 'deposit', $2, $3, $4, $5, 'pending', CURRENT_TIMESTAMP)
		RETURNING id, user_id, transaction_type, amount, balance_after, description, reference_id, status, created_at`,
		userID, amount, wallet.Balance, fmt.Sprintf("Wallet deposit via %s", paymentMethod), referenceID).Scan(
		&transaction.ID, &transaction.UserID, &transaction.TransactionType, &transaction.Amount,
		&transaction.BalanceAfter, &transaction.Description, &transaction.ReferenceID,
		&transaction.Status, &transaction.CreatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create deposit transaction: %w", err)
	}

	return &transaction, nil
}

// CompleteDepositTransaction completes a deposit transaction
func (s *PaymentService) CompleteDepositTransaction(transactionID int) error {
	// Start transaction
	tx, err := s.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to start transaction: %w", err)
	}
	defer tx.Rollback()

	// Get transaction details
	var userID int
	var amount float64
	var status string
	err = tx.QueryRow(`
		SELECT user_id, amount, status FROM wallet_transactions WHERE id = $1`, transactionID).Scan(
		&userID, &amount, &status)
	
	if err != nil {
		return fmt.Errorf("failed to get transaction: %w", err)
	}

	if status != "pending" {
		return fmt.Errorf("transaction is not pending")
	}

	// Update wallet balance
	var newBalance float64
	err = tx.QueryRow(`
		UPDATE customer_wallets 
		SET balance = balance + $1, total_deposited = total_deposited + $1, updated_at = CURRENT_TIMESTAMP
		WHERE user_id = $2
		RETURNING balance`, amount, userID).Scan(&newBalance)

	if err != nil {
		return fmt.Errorf("failed to update wallet: %w", err)
	}

	// Update transaction status
	_, err = tx.Exec(`
		UPDATE wallet_transactions 
		SET status = 'completed', balance_after = $1 
		WHERE id = $2`, newBalance, transactionID)

	if err != nil {
		return fmt.Errorf("failed to update transaction: %w", err)
	}

	// Commit transaction
	if err = tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

// ProcessPayment processes a payment for an order
func (s *PaymentService) ProcessPayment(userID int, amount float64, paymentMethod string, orderID *int) (*models.WalletTransaction, error) {
	// Start transaction
	tx, err := s.db.Begin()
	if err != nil {
		return nil, fmt.Errorf("failed to start transaction: %w", err)
	}
	defer tx.Rollback()

	// Get current wallet
	var currentBalance float64
	err = tx.QueryRow(`SELECT balance FROM customer_wallets WHERE user_id = $1`, userID).Scan(&currentBalance)
	if err != nil {
		return nil, fmt.Errorf("failed to get wallet balance: %w", err)
	}

	// Check if user has sufficient funds
	if currentBalance < amount {
		return nil, fmt.Errorf("insufficient funds: balance %.2f, required %.2f", currentBalance, amount)
	}

	// Deduct from wallet
	newBalance := currentBalance - amount
	_, err = tx.Exec(`
		UPDATE customer_wallets 
		SET balance = $1, total_spent = total_spent + $2, updated_at = CURRENT_TIMESTAMP
		WHERE user_id = $3`, newBalance, amount, userID)

	if err != nil {
		return nil, fmt.Errorf("failed to update wallet: %w", err)
	}

	// Create transaction record
	var referenceID string
	if orderID != nil {
		referenceID = fmt.Sprintf("ORDER_%d", *orderID)
	} else {
		referenceID = fmt.Sprintf("PAY_%d_%s", userID, utils.GenerateRandomString(8))
	}

	var transaction models.WalletTransaction
	err = tx.QueryRow(`
		INSERT INTO wallet_transactions (user_id, transaction_type, amount, balance_after, description, reference_id, status, created_at)
		VALUES ($1, 'purchase', $2, $3, $4, $5, 'completed', CURRENT_TIMESTAMP)
		RETURNING id, user_id, transaction_type, amount, balance_after, description, reference_id, status, created_at`,
		userID, amount, newBalance, fmt.Sprintf("Payment via %s", paymentMethod), referenceID).Scan(
		&transaction.ID, &transaction.UserID, &transaction.TransactionType, &transaction.Amount,
		&transaction.BalanceAfter, &transaction.Description, &transaction.ReferenceID,
		&transaction.Status, &transaction.CreatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create transaction: %w", err)
	}

	// Commit transaction
	if err = tx.Commit(); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	return &transaction, nil
}

// GetWalletTransactions retrieves user's wallet transaction history
func (s *PaymentService) GetWalletTransactions(userID, page, limit int, transactionType string) ([]models.WalletTransaction, int, error) {
	offset := (page - 1) * limit

	// Build query conditions
	conditions := []string{"user_id = $1"}
	args := []interface{}{userID}
	argCount := 1

	if transactionType != "" {
		argCount++
		conditions = append(conditions, fmt.Sprintf("transaction_type = $%d", argCount))
		args = append(args, transactionType)
	}

	whereClause := fmt.Sprintf("WHERE %s", fmt.Sprintf("%s", conditions[0]))
	if len(conditions) > 1 {
		whereClause = fmt.Sprintf("WHERE %s", fmt.Sprintf("%s AND %s", conditions[0], conditions[1]))
	}

	// Get total count
	var total int
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM wallet_transactions %s", whereClause)
	err := s.db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count transactions: %w", err)
	}

	// Get transactions with pagination
	args = append(args, limit, offset)
	query := fmt.Sprintf(`
		SELECT id, user_id, transaction_type, amount, balance_after, description, reference_id, status, created_at
		FROM wallet_transactions %s
		ORDER BY created_at DESC
		LIMIT $%d OFFSET $%d`, whereClause, len(args)-1, len(args))

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get transactions: %w", err)
	}
	defer rows.Close()

	var transactions []models.WalletTransaction
	for rows.Next() {
		var transaction models.WalletTransaction
		err := rows.Scan(
			&transaction.ID, &transaction.UserID, &transaction.TransactionType, &transaction.Amount,
			&transaction.BalanceAfter, &transaction.Description, &transaction.ReferenceID,
			&transaction.Status, &transaction.CreatedAt)

		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan transaction: %w", err)
		}

		transactions = append(transactions, transaction)
	}

	return transactions, total, nil
}

// GetUserPoints retrieves user's points information
func (s *PaymentService) GetUserPoints(userID int) (*models.CustomerPoints, error) {
	var points models.CustomerPoints
	
	err := s.db.QueryRow(`
		SELECT id, user_id, total_points, available_points, used_points, created_at, updated_at
		FROM customer_points WHERE user_id = $1`, userID).Scan(
		&points.ID, &points.UserID, &points.TotalPoints, &points.AvailablePoints, &points.UsedPoints,
		&points.CreatedAt, &points.UpdatedAt)

	if err == sql.ErrNoRows {
		// Create points record if it doesn't exist
		return s.createPoints(userID)
	} else if err != nil {
		return nil, fmt.Errorf("failed to get points: %w", err)
	}

	return &points, nil
}

// AddPoints adds points to user account
func (s *PaymentService) AddPoints(userID, points int, reason string, referenceID *string) error {
	tx, err := s.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to start transaction: %w", err)
	}
	defer tx.Rollback()

	// Update points
	_, err = tx.Exec(`
		UPDATE customer_points 
		SET total_points = total_points + $1, available_points = available_points + $1, updated_at = CURRENT_TIMESTAMP
		WHERE user_id = $2`, points, userID)

	if err != nil {
		return fmt.Errorf("failed to update points: %w", err)
	}

	// Create points transaction
	expiresAt := time.Now().AddDate(1, 0, 0) // Points expire in 1 year
	_, err = tx.Exec(`
		INSERT INTO point_transactions (user_id, points, transaction_type, reason, reference_id, expires_at, created_at)
		VALUES ($1, $2, 'earned', $3, $4, $5, CURRENT_TIMESTAMP)`,
		userID, points, reason, referenceID, expiresAt)

	if err != nil {
		return fmt.Errorf("failed to create points transaction: %w", err)
	}

	return tx.Commit()
}

// Helper methods

func (s *PaymentService) createWallet(userID int) (*models.CustomerWallet, error) {
	var wallet models.CustomerWallet
	
	err := s.db.QueryRow(`
		INSERT INTO customer_wallets (user_id, balance, total_deposited, total_spent, created_at, updated_at)
		VALUES ($1, 0.00, 0.00, 0.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		RETURNING id, user_id, balance, total_deposited, total_spent, created_at, updated_at`,
		userID).Scan(
		&wallet.ID, &wallet.UserID, &wallet.Balance, &wallet.TotalDeposited, &wallet.TotalSpent,
		&wallet.CreatedAt, &wallet.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create wallet: %w", err)
	}

	return &wallet, nil
}

func (s *PaymentService) createPoints(userID int) (*models.CustomerPoints, error) {
	var points models.CustomerPoints
	
	err := s.db.QueryRow(`
		INSERT INTO customer_points (user_id, total_points, available_points, used_points, created_at, updated_at)
		VALUES ($1, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		RETURNING id, user_id, total_points, available_points, used_points, created_at, updated_at`,
		userID).Scan(
		&points.ID, &points.UserID, &points.TotalPoints, &points.AvailablePoints, &points.UsedPoints,
		&points.CreatedAt, &points.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create points: %w", err)
	}

	return &points, nil
}