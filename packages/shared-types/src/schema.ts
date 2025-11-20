import { z } from 'zod';

export const restaurantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  domain: z.string().url(),
  created_at: z.string().datetime()
});

export const menuItemSchema = z.object({
  id: z.string().uuid(),
  restaurant_id: z.string().uuid(),
  name: z.string().min(2),
  price_cents: z.number().int().nonnegative(),
  category: z.string().optional(),
  created_at: z.string().datetime()
});

export const orderLineItemSchema = z.object({
  menu_item_id: z.string().uuid(),
  quantity: z.number().int().positive()
});

export const orderSchema = z.object({
  id: z.string().uuid(),
  restaurant_id: z.string().uuid(),
  table: z.string().optional(),
  items: z.array(orderLineItemSchema),
  status: z.enum(['pending', 'preparing', 'ready', 'completed', 'cancelled']),
  created_at: z.string().datetime()
});

export type Restaurant = z.infer<typeof restaurantSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type Order = z.infer<typeof orderSchema>;
