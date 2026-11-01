DROP DATABASE IF EXISTS quanlytaisanqr;
CREATE DATABASE quanlytaisanqr
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE quanlytaisanqr;

-- 1. PHÂN QUYỀN & NGƯỜI DÙNG
CREATE TABLE vaitro (
    vaitro_id  TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mavaitro   VARCHAR(20) NOT NULL UNIQUE,
    tenvaitro  VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE donvi (
    donvi_id     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    madonvi      VARCHAR(30)  NOT NULL UNIQUE,
    tendonvi     VARCHAR(150) NOT NULL,
    donvicha_id  INT UNSIGNED NULL,
    CONSTRAINT fk_donvi_donvicha FOREIGN KEY (donvicha_id)
        REFERENCES donvi(donvi_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE nguoidung (
    nguoidung_id  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tendangnhap   VARCHAR(50)  NOT NULL UNIQUE,
    matkhaumahoa  VARCHAR(255) NOT NULL,
    hoten         VARCHAR(100) NOT NULL,
    email         VARCHAR(100) UNIQUE,
    vaitro_id     TINYINT UNSIGNED NOT NULL,
    donvi_id      INT UNSIGNED NULL,
    hoatdong      TINYINT(1) NOT NULL DEFAULT 1,
    CONSTRAINT fk_nguoidung_vaitro FOREIGN KEY (vaitro_id) REFERENCES vaitro(vaitro_id),
    CONSTRAINT fk_nguoidung_donvi  FOREIGN KEY (donvi_id)  REFERENCES donvi(donvi_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 2. DANH MỤC
CREATE TABLE vitri (
    vitri_id  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mavitri   VARCHAR(30)  NOT NULL UNIQUE,
    tenvitri  VARCHAR(150) NOT NULL,
    donvi_id  INT UNSIGNED NOT NULL,
    CONSTRAINT fk_vitri_donvi FOREIGN KEY (donvi_id) REFERENCES donvi(donvi_id)
) ENGINE=InnoDB;

CREATE TABLE loaitaisan (
    loaitaisan_id  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenloai        VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE trangthaitaisan (
    trangthaitaisan_id  TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    matrangthai         VARCHAR(20) NOT NULL UNIQUE,
    tentrangthai        VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

-- 3. TÀI SẢN & MÃ QR
CREATE TABLE taisan (
    taisan_id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mataisan            VARCHAR(50)  NOT NULL UNIQUE,
    tentaisan           VARCHAR(200) NOT NULL,
    loaitaisan_id       INT UNSIGNED NOT NULL,
    thongsokythuat      TEXT,
    ngaynhap            DATE NOT NULL,
    giatri              DECIMAL(15,2) NOT NULL DEFAULT 0,
    vitri_id            INT UNSIGNED NULL,
    trangthaitaisan_id  TINYINT UNSIGNED NOT NULL,
    nguoisudung_id      BIGINT UNSIGNED NULL,
    daxoa               TINYINT(1) NOT NULL DEFAULT 0,
    ngaytao             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_taisan_loaitaisan      FOREIGN KEY (loaitaisan_id)      REFERENCES loaitaisan(loaitaisan_id),
    CONSTRAINT fk_taisan_vitri           FOREIGN KEY (vitri_id)           REFERENCES vitri(vitri_id) ON DELETE SET NULL,
    CONSTRAINT fk_taisan_trangthaitaisan FOREIGN KEY (trangthaitaisan_id) REFERENCES trangthaitaisan(trangthaitaisan_id),
    CONSTRAINT fk_taisan_nguoisudung     FOREIGN KEY (nguoisudung_id)     REFERENCES nguoidung(nguoidung_id) ON DELETE SET NULL,
    INDEX idx_taisan_ten (tentaisan),
    INDEX idx_taisan_vitri (vitri_id),
    INDEX idx_taisan_trangthai (trangthaitaisan_id)
) ENGINE=InnoDB;

CREATE TABLE lichsuquet (
    lichsuquet_id  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    taisan_id      BIGINT UNSIGNED NOT NULL,
    nguoidung_id   BIGINT UNSIGNED NULL,
    thoigianquet   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lichsuquet_taisan    FOREIGN KEY (taisan_id)    REFERENCES taisan(taisan_id) ON DELETE CASCADE,
    CONSTRAINT fk_lichsuquet_nguoidung FOREIGN KEY (nguoidung_id) REFERENCES nguoidung(nguoidung_id) ON DELETE SET NULL,
    INDEX idx_lichsuquet_taisan (taisan_id, thoigianquet)
) ENGINE=InnoDB;

-- 4. BÀN GIAO / THU HỒI / LUÂN CHUYỂN
CREATE TABLE luanchuyen (
    luanchuyen_id  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    loaiphieu      ENUM('BANGIAO','THUHOI','DIEUCHUYEN') NOT NULL,
    taisan_id      BIGINT UNSIGNED NOT NULL,
    nguoigiao_id   BIGINT UNSIGNED NULL,
    nguoinhan_id   BIGINT UNSIGNED NULL,
    vitri_id       INT UNSIGNED NULL,
    ngaythuchien   DATE NOT NULL,
    lydo           VARCHAR(500),
    CONSTRAINT fk_luanchuyen_taisan    FOREIGN KEY (taisan_id)    REFERENCES taisan(taisan_id),
    CONSTRAINT fk_luanchuyen_nguoigiao FOREIGN KEY (nguoigiao_id) REFERENCES nguoidung(nguoidung_id) ON DELETE SET NULL,
    CONSTRAINT fk_luanchuyen_nguoinhan FOREIGN KEY (nguoinhan_id) REFERENCES nguoidung(nguoidung_id) ON DELETE SET NULL,
    CONSTRAINT fk_luanchuyen_vitri     FOREIGN KEY (vitri_id)     REFERENCES vitri(vitri_id) ON DELETE SET NULL,
    INDEX idx_luanchuyen_taisan (taisan_id, ngaythuchien)
) ENGINE=InnoDB;

-- 5. SỬA CHỮA & BẢO TRÌ
CREATE TABLE baotri (
    baotri_id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    taisan_id           BIGINT UNSIGNED NOT NULL,
    loaibaotri          ENUM('SUACHUA','DINHKY') NOT NULL,
    nguoibao_id         BIGINT UNSIGNED NULL,
    ngaybao             DATE NOT NULL,
    motahuhong          TEXT,
    trangthaixuly       ENUM('CHOXULY','DANGXULY','HOANTHANH','DAHUY') NOT NULL DEFAULT 'CHOXULY',
    ngayhoanthanh       DATE NULL,
    chiphi              DECIMAL(15,2) NOT NULL DEFAULT 0,
    ketqua              TEXT,
    ngaybaotritieptheo  DATE NULL,
    CONSTRAINT fk_baotri_taisan   FOREIGN KEY (taisan_id)   REFERENCES taisan(taisan_id),
    CONSTRAINT fk_baotri_nguoibao FOREIGN KEY (nguoibao_id) REFERENCES nguoidung(nguoidung_id) ON DELETE SET NULL,
    INDEX idx_baotri_taisan (taisan_id, ngaybao),
    INDEX idx_baotri_trangthai (trangthaixuly)
) ENGINE=InnoDB;

-- 6. LỊCH SỬ ĐỔI TRẠNG THÁI
CREATE TABLE lichsutrangthai (
    lichsutrangthai_id  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    taisan_id           BIGINT UNSIGNED NOT NULL,
    trangthaitaisan_id  TINYINT UNSIGNED NOT NULL,
    nguoidung_id        BIGINT UNSIGNED NULL,
    thoigian            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lichsutrangthai_taisan    FOREIGN KEY (taisan_id)          REFERENCES taisan(taisan_id) ON DELETE CASCADE,
    CONSTRAINT fk_lichsutrangthai_trangthai FOREIGN KEY (trangthaitaisan_id) REFERENCES trangthaitaisan(trangthaitaisan_id),
    CONSTRAINT fk_lichsutrangthai_nguoidung FOREIGN KEY (nguoidung_id)       REFERENCES nguoidung(nguoidung_id) ON DELETE SET NULL,
    INDEX idx_lichsutrangthai_taisan (taisan_id, thoigian)
) ENGINE=InnoDB;

-- 7. KIỂM KÊ
CREATE TABLE dotkiemke (
    dotkiemke_id  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tendot        VARCHAR(150) NOT NULL,
    donvi_id      INT UNSIGNED NULL,
    ngaybatdau    DATE NOT NULL,
    trangthai     ENUM('DANGMO','DADONG') NOT NULL DEFAULT 'DANGMO',
    CONSTRAINT fk_dotkiemke_donvi FOREIGN KEY (donvi_id) REFERENCES donvi(donvi_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE chitietkiemke (
    chitietkiemke_id  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dotkiemke_id      BIGINT UNSIGNED NOT NULL,
    taisan_id         BIGINT UNSIGNED NOT NULL,
    vitrithucte_id    INT UNSIGNED NULL,
    ketqua            ENUM('CHUAKIEM','CO','THIEU','LECHVITRI') NOT NULL DEFAULT 'CHUAKIEM',
    nguoidung_id      BIGINT UNSIGNED NULL,
    thoigiankiem      DATETIME NULL,
    UNIQUE KEY uq_chitietkiemke_dot_taisan (dotkiemke_id, taisan_id),
    CONSTRAINT fk_chitietkiemke_dot       FOREIGN KEY (dotkiemke_id)   REFERENCES dotkiemke(dotkiemke_id) ON DELETE CASCADE,
    CONSTRAINT fk_chitietkiemke_taisan    FOREIGN KEY (taisan_id)      REFERENCES taisan(taisan_id),
    CONSTRAINT fk_chitietkiemke_vitri     FOREIGN KEY (vitrithucte_id) REFERENCES vitri(vitri_id) ON DELETE SET NULL,
    CONSTRAINT fk_chitietkiemke_nguoidung FOREIGN KEY (nguoidung_id)   REFERENCES nguoidung(nguoidung_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 8. DỮ LIỆU KHỞI TẠO
INSERT INTO vaitro (mavaitro, tenvaitro) VALUES
    ('ADMIN', 'Quản trị viên'),
    ('USER',  'Người sử dụng');

INSERT INTO trangthaitaisan (matrangthai, tentrangthai) VALUES
    ('IN_USE',      'Đang sử dụng'),
    ('AVAILABLE',   'Còn trống'),
    ('MAINTENANCE', 'Đang bảo trì'),
    ('BROKEN',      'Hư hỏng');

-- Dữ liệu mẫu cho Đơn vị
INSERT INTO donvi (madonvi, tendonvi, donvicha_id) VALUES
    ('DV001', 'Phòng Hành chính', NULL),
    ('DV002', 'Phòng Kế toán', NULL),
    ('DV003', 'Phòng Kỹ thuật', NULL),
    ('DV004', 'Phòng Nhân sự', NULL),
    ('DV005', 'Kho tổng', NULL);

-- Dữ liệu mẫu cho Vị trí
INSERT INTO vitri (mavitri, tenvitri, donvi_id) VALUES
    ('VT001', 'Phòng 101', 1),
    ('VT002', 'Phòng 102', 1),
    ('VT003', 'Phòng 201', 2),
    ('VT004', 'Phòng 202', 2),
    ('VT005', 'Phòng 301', 3),
    ('VT006', 'Phòng 302', 3),
    ('VT007', 'Khu vực A', 5),
    ('VT008', 'Khu vực B', 5);

-- Dữ liệu mẫu cho Loại tài sản
INSERT INTO loaitaisan (tenloai) VALUES
    ('Máy tính'),
    ('Bàn ghế'),
    ('Điều hòa'),
    ('Máy in'),
    ('Tủ tài liệu'),
    ('Điện thoại'),
    ('Máy chiếu'),
    ('Xe ô tô'),
    ('Xe máy'),
    ('Thiết bị mạng');

-- 9. VIEW
CREATE VIEW thongketheotrangthai AS
SELECT tt.matrangthai, tt.tentrangthai, COUNT(ts.taisan_id) AS soluong
FROM trangthaitaisan tt
LEFT JOIN taisan ts ON ts.trangthaitaisan_id = tt.trangthaitaisan_id AND ts.daxoa = 0
GROUP BY tt.trangthaitaisan_id, tt.matrangthai, tt.tentrangthai;

CREATE VIEW chitiettaisan AS
SELECT ts.taisan_id, ts.mataisan, ts.tentaisan, lt.tenloai,
       ts.thongsokythuat, ts.ngaynhap, ts.giatri,
       vt.tenvitri, dv.tendonvi,
       tt.matrangthai, tt.tentrangthai,
       nd.hoten AS nguoisudung
FROM taisan ts
JOIN loaitaisan lt      ON lt.loaitaisan_id = ts.loaitaisan_id
JOIN trangthaitaisan tt ON tt.trangthaitaisan_id = ts.trangthaitaisan_id
LEFT JOIN vitri vt      ON vt.vitri_id = ts.vitri_id
LEFT JOIN donvi dv      ON dv.donvi_id = vt.donvi_id
LEFT JOIN nguoidung nd  ON nd.nguoidung_id = ts.nguoisudung_id
WHERE ts.daxoa = 0;