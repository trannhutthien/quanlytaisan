-- Thêm cột created_at và updated_at vào bảng dotkiemke
ALTER TABLE dotkiemke
ADD COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP;
