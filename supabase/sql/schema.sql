create extension if not exists "uuid-ossp";

create table if not exists public.restaurants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  domain text not null,
  created_at timestamptz default now()
);

create table if not exists public.menu_items (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  name text not null,
  price_cents integer not null,
  category text,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  status text default 'pending',
  total_cents integer default 0,
  created_by uuid,
  created_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete cascade,
  quantity integer not null default 1,
  created_at timestamptz default now()
);

create or replace function public.update_order_total()
returns trigger as $$
begin
  update public.orders
  set total_cents = (
    select coalesce(sum(price_cents * quantity), 0)
    from public.order_items
    where order_id = new.order_id
  )
  where id = new.order_id;
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_order_total_trigger on public.order_items;
create trigger update_order_total_trigger
after insert or update or delete on public.order_items
for each row execute function public.update_order_total();
