package usecase

import (
	"context"
	"errors"
	"time"

	"flybook-server/internal/domain"
	"flybook-server/internal/repository/postgres"
	"flybook-server/pkg/token"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AuthUsecase interface {
	Register(ctx context.Context, req domain.RegisterRequest) (*domain.AuthResponse, error)
	Login(ctx context.Context, req domain.LoginRequest) (*domain.AuthResponse, error)
	GetProfile(ctx context.Context, userID uuid.UUID) (*domain.UserDataResponse, error)
}

type authUsecase struct {
	userRepo  postgres.UserRepository
	jwtSecret string
}

func NewAuthUsecase(userRepo postgres.UserRepository, jwtSecret string) AuthUsecase {
	return &authUsecase{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
	}
}

func (u *authUsecase) Register(ctx context.Context, req domain.RegisterRequest) (*domain.AuthResponse, error) {
	existingUser, _ := u.userRepo.FindByEmail(ctx, req.Email)
	if existingUser != nil {
		return nil, errors.New("email sudah terdaftar, silakan gunakan email lain atau login")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("gagal mengenkripsi kata sandi")
	}

	newUser := &domain.User{
		ID:           uuid.New(),
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		Phone:        req.Phone,
		Role:         domain.RoleCustomer,
	}

	if err := u.userRepo.Create(ctx, newUser); err != nil {
		return nil, err
	}

	jwtToken, err := token.GenerateJWT(newUser.ID, newUser.Email, newUser.Role, u.jwtSecret, 7*24*time.Hour)
	if err != nil {
		return nil, errors.New("gagal membuat token otentikasi")
	}

	return &domain.AuthResponse{
		Token: jwtToken,
		User: domain.UserDataResponse{
			ID:        newUser.ID,
			Name:      newUser.Name,
			Email:     newUser.Email,
			Phone:     newUser.Phone,
			Role:      newUser.Role,
			AvatarURL: newUser.AvatarURL,
			CreatedAt: newUser.CreatedAt,
		},
	}, nil
}

func (u *authUsecase) Login(ctx context.Context, req domain.LoginRequest) (*domain.AuthResponse, error) {
	user, err := u.userRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, errors.New("kombinasi email atau kata sandi tidak valid")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("kombinasi email atau kata sandi tidak valid")
	}

	jwtToken, err := token.GenerateJWT(user.ID, user.Email, user.Role, u.jwtSecret, 7*24*time.Hour)
	if err != nil {
		return nil, errors.New("gagal membuat token otentikasi")
	}

	return &domain.AuthResponse{
		Token: jwtToken,
		User: domain.UserDataResponse{
			ID:        user.ID,
			Name:      user.Name,
			Email:     user.Email,
			Phone:     user.Phone,
			Role:      user.Role,
			AvatarURL: user.AvatarURL,
			CreatedAt: user.CreatedAt,
		},
	}, nil
}

func (u *authUsecase) GetProfile(ctx context.Context, userID uuid.UUID) (*domain.UserDataResponse, error) {
	user, err := u.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, errors.New("pengguna tidak ditemukan")
	}

	return &domain.UserDataResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Phone:     user.Phone,
		Role:      user.Role,
		AvatarURL: user.AvatarURL,
		CreatedAt: user.CreatedAt,
	}, nil
}
