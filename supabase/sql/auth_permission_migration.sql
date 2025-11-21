-- ==========================================================
--  AUTH + PROFILE + ROLE + PERMISSION + SOFT DELETE SYSTEM
--  Supabase SQL Migration (FULL)
-- ==========================================================


--------------------------------------------------------------
-- 1) ROLES
--------------------------------------------------------------
create table if not exists public.roles (
  id serial primary key,
  name text unique not null,
  description text
);


--------------------------------------------------------------
-- 2) PERMISSIONS
--------------------------------------------------------------
create table if not exists public.permissions (
  id serial primary key,
  code text unique not null,
  description text
);


--------------------------------------------------------------
-- 3) USER_ROLES
--------------------------------------------------------------
create table if not exists public.user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role_id int references roles(id) on delete cascade,
  assigned_at timestamptz default now(),
  primary key (user_id, role_id)
);


--------------------------------------------------------------
-- 4) ROLE_PERMISSIONS
--------------------------------------------------------------
create table if not exists public.role_permissions (
  role_id int references roles(id) on delete cascade,
  permission_id int references permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);


--------------------------------------------------------------
-- 5) PROFILES (Soft Delete)
--------------------------------------------------------------
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text,
  role_primary int references roles(id),
  status text not null default 'active'
    check (status in ('active', 'inactive')),
  created_at timestamptz default now()
);


--------------------------------------------------------------
-- 6) FUNCTION: GET USER PERMISSIONS
--------------------------------------------------------------
create or replace function public.get_user_permissions(uid uuid)
returns json language sql stable as $$
  select json_build_object(
    'roles', (
      select array_agg(r.name)
      from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = uid
    ),
    'permissions', (
      select array_agg(p.code)
      from public.user_roles ur
      join public.role_permissions rp on rp.role_id = ur.role_id
      join public.permissions p on p.id = rp.permission_id
      where ur.user_id = uid
    )
  );
$$;


--------------------------------------------------------------
-- 7) ENABLE RLS
--------------------------------------------------------------
alter table public.profiles enable row level security;


--------------------------------------------------------------
-- 8) POLICIES
--------------------------------------------------------------

-- User sees ONLY self when active
do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'User can read own profile if active'
  ) then
    create policy "User can read own profile if active"
    on public.profiles for select
    using (
      auth.uid() = user_id
      and status = 'active'
    );
  end if;
end $$;


-- Admin full access (requires JWT role claim)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'Admin full access'
  ) then
    create policy "Admin full access"
    on public.profiles for all
    using (
      auth.jwt()->>'role' = 'admin'
    );
  end if;
end $$;


--------------------------------------------------------------
-- 9) SEED: DEFAULT ROLES
--------------------------------------------------------------
insert into public.roles (name, description) values
  ('admin', 'Full system administrator'),
  ('manager', 'Manager with report and staff permissions'),
  ('cashier', 'POS cashier'),
  ('kitchen', 'Kitchen staff')
on conflict (name) do nothing;


--------------------------------------------------------------
-- 10) SEED: DEFAULT PERMISSIONS
--------------------------------------------------------------
insert into public.permissions (code, description) values
  ('user.manage', 'Manage all users'),
  ('role.manage', 'Manage roles'),
  ('report.view', 'View reports'),
  ('order.view', 'View orders'),
  ('order.create', 'Create new orders'),
  ('order.update', 'Update orders'),
  ('product.manage', 'Manage products')
on conflict (code) do nothing;


--------------------------------------------------------------
-- 11) SEED ROLE PERMISSIONS FOR ADMIN
--------------------------------------------------------------
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r, public.permissions p
where r.name = 'admin'
on conflict do nothing;


--------------------------------------------------------------
-- 12) OPTIONAL INDEXES
--------------------------------------------------------------
create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_user_roles_user on public.user_roles(user_id);
create index if not exists idx_role_permissions_role on public.role_permissions(role_id);


-- ==========================================================
-- END OF SQL MIGRATION
-- ==========================================================
