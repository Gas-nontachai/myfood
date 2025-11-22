-- ============================================================
-- PRODUCT SYSTEM (Single Branch Version)
-- ============================================================

-- ===========================
-- 1) product_category (Tree)
-- ===========================
create table if not exists product_category (
    id          bigserial primary key,
    parent_id   bigint references product_category(id) on delete set null,
    name        text not null,
    description text,
    created_at  timestamp with time zone default now(),
    updated_at  timestamp with time zone default now()
);

-- ===========================
-- 2) product
-- ===========================
create table if not exists product (
    id              bigserial primary key,
    code            text unique,
    name            text not null,
    description     text,
    product_type    text not null, -- food / drink / retail / ingredient / service
    base_price      numeric(12,2) default 0,
    unit            text default 'pcs',
    image_url       text,
    status          text not null default 'active', -- active/inactive
    created_at      timestamp with time zone default now(),
    updated_at      timestamp with time zone default now()
);

-- ======================================
-- 3) product_category_map (Many-to-Many)
-- ======================================
create table if not exists product_category_map (
    product_id      bigint not null references product(id) on delete cascade,
    category_id     bigint not null references product_category(id) on delete cascade,
    primary key (product_id, category_id)
);

-- ===========================
-- 4) product_option_group
-- ===========================
create table if not exists product_option_group (
    id            bigserial primary key,
    name          text not null,
    type          text not null, -- single, multi
    is_required   boolean default false,
    max_select    int default 1,
    created_at    timestamp with time zone default now(),
    updated_at    timestamp with time zone default now()
);

-- ===========================
-- 5) product_option
-- ===========================
create table if not exists product_option (
    id            bigserial primary key,
    group_id      bigint not null references product_option_group(id) on delete cascade,
    name          text not null,
    price         numeric(12,2) default 0,
    cost          numeric(12,2) default 0,
    sort_order    int default 0,
    created_at    timestamp with time zone default now(),
    updated_at    timestamp with time zone default now()
);

-- ================================================
-- 6) product_option_group_map (Reuse option groups)
-- ================================================
create table if not exists product_option_group_map (
    product_id      bigint not null references product(id) on delete cascade,
    group_id        bigint not null references product_option_group(id) on delete cascade,
    primary key (product_id, group_id)
);

-- ===========================
-- 7) product_price_variant
-- ===========================
create table if not exists product_price_variant (
    id            bigserial primary key,
    product_id    bigint not null references product(id) on delete cascade,
    variant_name  text not null,
    price         numeric(12,2) not null,
    created_at    timestamp with time zone default now(),
    updated_at    timestamp with time zone default now()
);

-- Optional Indexes (speed)
create index if not exists idx_product_type on product(product_type);
create index if not exists idx_category_parent on product_category(parent_id);
create index if not exists idx_product_category_map_category on product_category_map(category_id);
create index if not exists idx_product_option_group_map_group on product_option_group_map(group_id);

-- ============================================================
-- END PRODUCT SYSTEM
-- ============================================================
