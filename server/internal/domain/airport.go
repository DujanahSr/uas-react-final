package domain

type Airport struct {
	Code     string `gorm:"type:varchar(3);primaryKey" json:"code"` // IATA Code, e.g. CGK, DPS
	Name     string `gorm:"type:varchar(100);not null" json:"name"`
	City     string `gorm:"type:varchar(100);not null" json:"city"`
	Country  string `gorm:"type:varchar(100);not null" json:"country"`
	Timezone string `gorm:"type:varchar(50);not null" json:"timezone"` // e.g. Asia/Jakarta
}
