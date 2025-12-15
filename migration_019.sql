-- =====================================================
-- Migration 019: 로컬 DB → AWS DB 동기화
-- 생성일: 2025-12-16
-- =====================================================

-- =====================================================
-- 1. 새 테이블 생성
-- =====================================================

-- 1.1 devcoins_settings 테이블
CREATE TABLE IF NOT EXISTS devcoins_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 초기 데이터 삽입
INSERT INTO devcoins_settings (setting_key, setting_value, description)
VALUES
    ('icon_url', NULL, 'DevCoins icon image URL'),
    ('icon_type', 'default', 'DevCoins icon type (default, custom)')
ON CONFLICT (setting_key) DO NOTHING;

-- 1.2 product_types 테이블
CREATE TABLE IF NOT EXISTS product_types (
    id SERIAL PRIMARY KEY,
    type_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_product_types_display_order ON product_types(display_order);
CREATE INDEX IF NOT EXISTS idx_product_types_is_active ON product_types(is_active);
CREATE INDEX IF NOT EXISTS idx_product_types_type_code ON product_types(type_code);

-- 초기 데이터 삽입
INSERT INTO product_types (type_code, name, description, display_order, is_active)
VALUES
    ('subscription', '구독', '구독 기반 상품', 1, true),
    ('digital', '디지털', '디지털 상품 (다운로드, 라이선스 등)', 2, true),
    ('devcoins', '충전', 'DevCoins 충전 상품', 3, true)
ON CONFLICT (type_code) DO NOTHING;

-- =====================================================
-- 2. 새 컬럼 추가
-- =====================================================

-- 2.1 shop_products.original_price 컬럼 추가
ALTER TABLE shop_products
ADD COLUMN IF NOT EXISTS original_price INTEGER;

-- 2.2 weekly_news_images.template_id 컬럼 추가
ALTER TABLE weekly_news_images
ADD COLUMN IF NOT EXISTS template_id VARCHAR(255);

-- =====================================================
-- 3. nullable 제약 조건 변경 (NOT NULL → NULL 허용)
-- 주의: AWS DB의 제약 조건을 로컬과 동일하게 맞춤
-- =====================================================

-- 3.1 weekly_news_images.display_order: NOT NULL → NULL 허용
ALTER TABLE weekly_news_images
ALTER COLUMN display_order DROP NOT NULL;

-- 3.2 weekly_news_images.section_id: NOT NULL → NULL 허용
ALTER TABLE weekly_news_images
ALTER COLUMN section_id DROP NOT NULL;

-- 3.3 weekly_news_sections.display_order: NOT NULL → NULL 허용
ALTER TABLE weekly_news_sections
ALTER COLUMN display_order DROP NOT NULL;

-- 3.4 weekly_news_sections.weekly_news_id: NOT NULL → NULL 허용
ALTER TABLE weekly_news_sections
ALTER COLUMN weekly_news_id DROP NOT NULL;

-- =====================================================
-- 4. AWS에만 있는 컬럼 삭제 (선택사항 - 데이터 백업 후 진행)
-- 주의: 해당 컬럼에 데이터가 있으면 삭제됨!
-- =====================================================

-- 4.1 app_vision_feedbacks 테이블의 reply 관련 컬럼 삭제
-- (로컬에서는 이 기능이 제거됨)
-- ALTER TABLE app_vision_feedbacks DROP COLUMN IF EXISTS replied_by_id;
-- ALTER TABLE app_vision_feedbacks DROP COLUMN IF EXISTS reply;
-- ALTER TABLE app_vision_feedbacks DROP COLUMN IF EXISTS reply_at;

-- 4.2 hero_sections 테이블의 category 관련 컬럼 삭제
-- (로컬에서는 이 기능이 제거됨)
-- ALTER TABLE hero_sections DROP COLUMN IF EXISTS category;
-- ALTER TABLE hero_sections DROP COLUMN IF EXISTS category_bg_color;
-- ALTER TABLE hero_sections DROP COLUMN IF EXISTS category_bg_opacity;
-- ALTER TABLE hero_sections DROP COLUMN IF EXISTS category_text_color;
-- ALTER TABLE hero_sections DROP COLUMN IF EXISTS max_content_lines;
-- ALTER TABLE hero_sections DROP COLUMN IF EXISTS show_date;
-- ALTER TABLE hero_sections DROP COLUMN IF EXISTS truncate_content;

-- =====================================================
-- 완료
-- =====================================================
