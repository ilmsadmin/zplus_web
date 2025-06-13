package payment

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"zplus_web/backend/middleware"
	"zplus_web/backend/models"
	"zplus_web/backend/services"
)

type PaymentHandler struct {
	paymentService *services.PaymentService
	validator      *validator.Validate
}

func NewPaymentHandler(paymentService *services.PaymentService) *PaymentHandler {
	return &PaymentHandler{
		paymentService: paymentService,
		validator:      validator.New(),
	}
}

// Wallet Endpoints

// GET /wallet - Get current user's wallet information
func (h *PaymentHandler) GetWallet(c *fiber.Ctx) error {
	currentUser := middleware.GetCurrentUser(c)
	userID, ok := currentUser["id"].(int)
	if !ok {
		return c.Status(401).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid user information",
			Error: &models.ApiError{
				Code:    "AUTH_INVALID",
				Details: "User ID not found in token",
			},
		})
	}

	wallet, err := h.paymentService.GetWallet(userID)
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to get wallet information",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Wallet information retrieved successfully",
		Data:    wallet,
	})
}

// GET /wallet/transactions - Get wallet transaction history
func (h *PaymentHandler) GetWalletTransactions(c *fiber.Ctx) error {
	currentUser := middleware.GetCurrentUser(c)
	userID, ok := currentUser["id"].(int)
	if !ok {
		return c.Status(401).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid user information",
			Error: &models.ApiError{
				Code:    "AUTH_INVALID",
				Details: "User ID not found in token",
			},
		})
	}

	// Parse query parameters
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "20"))
	transactionType := c.Query("type")

	// Validate pagination
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	transactions, total, err := h.paymentService.GetWalletTransactions(userID, page, limit, transactionType)
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to get transaction history",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	// Calculate pagination info
	totalPages := (total + limit - 1) / limit
	hasNext := page < totalPages
	hasPrev := page > 1

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Transaction history retrieved successfully",
		Data: map[string]interface{}{
			"transactions": transactions,
			"pagination": map[string]interface{}{
				"current_page":   page,
				"total_pages":    totalPages,
				"total_items":    total,
				"items_per_page": limit,
				"has_next":       hasNext,
				"has_prev":       hasPrev,
			},
		},
	})
}

// POST /wallet/deposit - Request wallet deposit
func (h *PaymentHandler) RequestDeposit(c *fiber.Ctx) error {
	currentUser := middleware.GetCurrentUser(c)
	userID, ok := currentUser["id"].(int)
	if !ok {
		return c.Status(401).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid user information",
			Error: &models.ApiError{
				Code:    "AUTH_INVALID",
				Details: "User ID not found in token",
			},
		})
	}

	type DepositRequest struct {
		Amount        float64 `json:"amount" validate:"required,min=1000"`
		PaymentMethod string  `json:"payment_method" validate:"required,oneof=vnpay momo zalopay banking"`
	}

	var req DepositRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid request body",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: err.Error(),
			},
		})
	}

	// Validate request
	if err := h.validator.Struct(req); err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Validation failed",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: err.Error(),
			},
		})
	}

	// Create deposit transaction
	transaction, err := h.paymentService.CreateDepositTransaction(userID, req.Amount, req.PaymentMethod)
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to create deposit request",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	// TODO: Integrate with Vietnamese payment gateways
	// For now, return mock payment URL
	referenceID := ""
	if transaction.ReferenceID != nil {
		referenceID = *transaction.ReferenceID
	}
	paymentURL := h.generatePaymentURL(req.PaymentMethod, referenceID, req.Amount)

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Deposit request created successfully",
		Data: map[string]interface{}{
			"transaction":   transaction,
			"payment_url":   paymentURL,
			"redirect_info": "Please complete payment on the payment gateway page",
		},
	})
}

// POST /wallet/deposit/callback - Handle payment callback (webhook)
func (h *PaymentHandler) HandleDepositCallback(c *fiber.Ctx) error {
	// TODO: Implement proper payment gateway callback handling
	// This would validate the callback signature and process the payment result
	
	type CallbackRequest struct {
		TransactionID int    `json:"transaction_id"`
		Status        string `json:"status"`
		ReferenceID   string `json:"reference_id"`
		Signature     string `json:"signature"`
	}

	var req CallbackRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid callback data",
			Error: &models.ApiError{
				Code:    "VALIDATION_ERROR",
				Details: err.Error(),
			},
		})
	}

	// TODO: Verify signature with payment gateway

	if req.Status == "success" {
		err := h.paymentService.CompleteDepositTransaction(req.TransactionID)
		if err != nil {
			return c.Status(500).JSON(models.ApiResponse{
				Success: false,
				Message: "Failed to complete deposit",
				Error: &models.ApiError{
					Code:    "INTERNAL_ERROR",
					Details: err.Error(),
				},
			})
		}
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Callback processed successfully",
	})
}

// Points Endpoints

// GET /points - Get current user's points information
func (h *PaymentHandler) GetPoints(c *fiber.Ctx) error {
	currentUser := middleware.GetCurrentUser(c)
	userID, ok := currentUser["id"].(int)
	if !ok {
		return c.Status(401).JSON(models.ApiResponse{
			Success: false,
			Message: "Invalid user information",
			Error: &models.ApiError{
				Code:    "AUTH_INVALID",
				Details: "User ID not found in token",
			},
		})
	}

	points, err := h.paymentService.GetUserPoints(userID)
	if err != nil {
		return c.Status(500).JSON(models.ApiResponse{
			Success: false,
			Message: "Failed to get points information",
			Error: &models.ApiError{
				Code:    "INTERNAL_ERROR",
				Details: err.Error(),
			},
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Points information retrieved successfully",
		Data:    points,
	})
}

// Helper methods

func (h *PaymentHandler) generatePaymentURL(method, referenceID string, amount float64) string {
	// TODO: Implement actual payment gateway URL generation
	// This is a placeholder that would integrate with Vietnamese payment gateways
	
	switch method {
	case "vnpay":
		return "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=" + strconv.FormatFloat(amount*100, 'f', 0, 64) + "&vnp_TxnRef=" + referenceID
	case "momo":
		return "https://test-payment.momo.vn/pay?amount=" + strconv.FormatFloat(amount, 'f', 0, 64) + "&orderInfo=" + referenceID
	case "zalopay":
		return "https://sbgateway.zalopay.vn/api/getlistmerchantbanks?amount=" + strconv.FormatFloat(amount, 'f', 0, 64) + "&orderid=" + referenceID
	case "banking":
		return "https://portal.vietcombank.com.vn/Personal/Login?amount=" + strconv.FormatFloat(amount, 'f', 0, 64) + "&ref=" + referenceID
	default:
		return "https://payment.zplus.com/deposit?ref=" + referenceID
	}
}

// ProcessOrderPayment processes payment for an order
func (h *PaymentHandler) ProcessOrderPayment(userID int, amount float64, orderID int) (*models.WalletTransaction, error) {
	transaction, err := h.paymentService.ProcessPayment(userID, amount, "wallet", &orderID)
	if err != nil {
		if strings.Contains(err.Error(), "insufficient") {
			return nil, fmt.Errorf("insufficient wallet balance")
		}
		return nil, fmt.Errorf("payment processing failed: %w", err)
	}

	// Award points for purchase (1 point per 1000 VND)
	points := int(amount / 1000)
	if points > 0 {
		referenceID := ""
		if transaction.ReferenceID != nil {
			referenceID = *transaction.ReferenceID
		}
		h.paymentService.AddPoints(userID, points, "Purchase reward", &referenceID)
	}

	return transaction, nil
}