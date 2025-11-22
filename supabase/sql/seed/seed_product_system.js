/**
 * Seed Product System (Bakery + Hot Milk Shop)
 * Run: node supabase/seed/seed_product_system_bakery.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  console.log('🌱 Seeding Bakery + Milk Shop...');

  // ----------------------------------------------
  // CATEGORY
  // ----------------------------------------------
  console.log('-> Inserting categories');

  const { data: catBread } = await supabase
    .from('product_category')
    .insert({ name: 'ขนมปังปิ้ง' })
    .select()
    .single();

  const { data: catMilk } = await supabase
    .from('product_category')
    .insert({ name: 'นมร้อน/นมเย็น/นมปั่น' })
    .select()
    .single();

  // ----------------------------------------------
  // PRODUCTS
  // ----------------------------------------------
  console.log('-> Inserting products');

  const breadProducts = [
    { code: 'BR-001', name: 'ขนมปังปิ้งเนย', product_type: 'food', base_price: 20, unit: 'ชิ้น' },
    { code: 'BR-002', name: 'ขนมปังปิ้งช็อกโกแลต', product_type: 'food', base_price: 25, unit: 'ชิ้น' },
    { code: 'BR-003', name: 'ขนมปังปิ้งสังขยา', product_type: 'food', base_price: 25, unit: 'ชิ้น' },
    { code: 'BR-004', name: 'ขนมปังปิ้งแยมสตรอว์เบอร์รี่', product_type: 'food', base_price: 25, unit: 'ชิ้น' },
    { code: 'BR-005', name: 'ขนมปังช็อกโกแลต + ฝอยทอง', product_type: 'food', base_price: 35, unit: 'ชิ้น' },
    { code: 'BR-006', name: 'ขนมปังชีสเยิ้ม', product_type: 'food', base_price: 30, unit: 'ชิ้น' },
    { code: 'BR-007', name: 'ขนมปังหมูหยองพริกเผา', product_type: 'food', base_price: 35, unit: 'ชิ้น' }
  ];

  const milkProducts = [
    { code: 'MK-001', name: 'นมสด', product_type: 'drink', base_price: 20, unit: 'แก้ว' },
    { code: 'MK-002', name: 'นมชมพู', product_type: 'drink', base_price: 25, unit: 'แก้ว' },
    { code: 'MK-003', name: 'นมเขียว', product_type: 'drink', base_price: 25, unit: 'แก้ว' },
    { code: 'MK-004', name: 'โกโก้', product_type: 'drink', base_price: 30, unit: 'แก้ว' },
    { code: 'MK-005', name: 'นมคาราเมล', product_type: 'drink', base_price: 30, unit: 'แก้ว' }
  ];

  // Insert all products
  const { data: insertedProducts } = await supabase
    .from('product')
    .insert([...breadProducts, ...milkProducts])
    .select();

  // Map products to category
  for (const p of insertedProducts) {
    await supabase.from('product_category_map').insert({
      product_id: p.id,
      category_id: p.code.startsWith('BR') ? catBread.id : catMilk.id
    });
  }

  // ----------------------------------------------
  // OPTION GROUPS (Temperature + Toppings)
  // ----------------------------------------------
  console.log('-> Inserting option groups');

  const { data: tempGroup } = await supabase
    .from('product_option_group')
    .insert({
      name: 'เลือกร้อน/เย็น/ปั่น',
      type: 'single',
      is_required: true,
      max_select: 1
    })
    .select()
    .single();

  const { data: toppingGroup } = await supabase
    .from('product_option_group')
    .insert({
      name: 'เพิ่มท็อปปิ้ง',
      type: 'multi',
      is_required: false,
      max_select: 3
    })
    .select()
    .single();

  // ----------------------------------------------
  // OPTIONS
  // ----------------------------------------------
  console.log('-> Inserting options');

  await supabase.from('product_option').insert([
    { group_id: tempGroup.id, name: 'ร้อน', price: 0 },
    { group_id: tempGroup.id, name: 'เย็น', price: 5 },
    { group_id: tempGroup.id, name: 'ปั่น', price: 10 }
  ]);

  await supabase.from('product_option').insert([
    { group_id: toppingGroup.id, name: 'เพิ่มขนมปัง 2 ชิ้น', price: 10 },
    { group_id: toppingGroup.id, name: 'ไข่มุกมินิ', price: 5 },
    { group_id: toppingGroup.id, name: 'คาราเมลเพิ่ม', price: 5 },
    { group_id: toppingGroup.id, name: 'วิปครีม', price: 8 }
  ]);

  // ----------------------------------------------
  // MAP OPTION GROUP TO MILK PRODUCTS ONLY
  // ----------------------------------------------
  console.log('-> Mapping option groups to milk products');

  for (const p of insertedProducts.filter((p) => p.code.startsWith('MK'))) {
    await supabase.from('product_option_group_map').insert([
      { product_id: p.id, group_id: tempGroup.id },
      { product_id: p.id, group_id: toppingGroup.id }
    ]);
  }

  // ----------------------------------------------
  // PRICE VARIANTS (S/M/L) for Milk Products
  // ----------------------------------------------
  console.log('-> Inserting price variants');

  for (const p of insertedProducts.filter((p) => p.code.startsWith('MK'))) {
    await supabase.from('product_price_variant').insert([
      { product_id: p.id, variant_name: 'Size S', price: p.base_price },
      { product_id: p.id, variant_name: 'Size M', price: p.base_price + 5 },
      { product_id: p.id, variant_name: 'Size L', price: p.base_price + 10 }
    ]);
  }

  console.log('🎉 Bakery + Milk Shop seeded successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
