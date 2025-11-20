alter table public.restaurants enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Restaurant members can read their data" on public.restaurants
for select using (auth.uid() = created_by or auth.role() = 'service_role');

create policy "Restaurant members can insert menu items" on public.menu_items
for insert with check (auth.role() = 'service_role');

create policy "Restaurant members can read menu items" on public.menu_items
for select using (auth.role() = 'service_role');

create policy "Customers can create orders" on public.orders
for insert with check (auth.role() in ('service_role', 'anon'));

create policy "Restaurant members can view orders" on public.orders
for select using (auth.role() = 'service_role');
