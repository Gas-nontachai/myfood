export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string;
          name: string;
          domain: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          domain: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          domain?: string;
          created_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          price_cents: number;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          price_cents: number;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          price_cents?: number;
          category?: string | null;
          created_at?: string;
        };
      };
    };
    Enums: Record<string, never>;
  };
}
