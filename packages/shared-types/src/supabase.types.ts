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
      roles: {
        Row: {
          id: number;
          name: string;
          description: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
        };
      };
      permissions: {
        Row: {
          id: number;
          code: string;
          description: string | null;
        };
        Insert: {
          id?: number;
          code: string;
          description?: string | null;
        };
        Update: {
          id?: number;
          code?: string;
          description?: string | null;
        };
      };
      user_roles: {
        Row: {
          user_id: string;
          role_id: number;
          assigned_at: string;
        };
        Insert: {
          user_id: string;
          role_id: number;
          assigned_at?: string;
        };
        Update: {
          user_id?: string;
          role_id?: number;
          assigned_at?: string;
        };
      };
      role_permissions: {
        Row: {
          role_id: number;
          permission_id: number;
        };
        Insert: {
          role_id: number;
          permission_id: number;
        };
        Update: {
          role_id?: number;
          permission_id?: number;
        };
      };
      profiles: {
        Row: {
          user_id: string;
          username: string;
          full_name: string | null;
          role_primary: number | null;
          status: 'active' | 'inactive';
          created_at: string;
        };
        Insert: {
          user_id: string;
          username: string;
          full_name?: string | null;
          role_primary?: number | null;
          status?: 'active' | 'inactive';
          created_at?: string;
        };
        Update: {
          username?: string;
          full_name?: string | null;
          role_primary?: number | null;
          status?: 'active' | 'inactive';
          created_at?: string;
        };
      };
    };
    Enums: Record<string, never>;
    Functions: {
      get_user_permissions: {
        Args: {
          uid: string;
        };
        Returns: {
          roles: string[] | null;
          permissions: string[] | null;
        };
      };
    };
  };
}
