package mongo

import (
	"context"
	"errors"
	"time"

	"flybook-server/internal/domain"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type LayoutRepository interface {
	GetLayoutByCode(ctx context.Context, layoutCode string) (*domain.AircraftLayout, error)
}

type layoutRepository struct {
	collection *mongo.Collection
}

func NewLayoutRepository(db *mongo.Database) LayoutRepository {
	return &layoutRepository{
		collection: db.Collection("aircraft_layouts"),
	}
}

func (r *layoutRepository) GetLayoutByCode(ctx context.Context, layoutCode string) (*domain.AircraftLayout, error) {
	ctxWithTimeout, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	var layout domain.AircraftLayout
	err := r.collection.FindOne(ctxWithTimeout, bson.M{"layout_code": layoutCode}).Decode(&layout)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &layout, nil
}
