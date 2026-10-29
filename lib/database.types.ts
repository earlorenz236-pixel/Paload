export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      load_requests: {
        Row: {
          account_number: string
          address: string
          amount: number
          archived_at: string | null
          created_at: string
          customer_id: string
          id: string
          note: string | null
          package_name: string | null
          status: string
          unit_type: string
          updated_at: string
        }
        Insert: {
          account_number: string
          address: string
          amount: number
          archived_at?: string | null
          created_at?: string
          customer_id: string
          id?: string
          note?: string | null
          package_name?: string | null
          status?: string
          unit_type: string
          updated_at?: string
        }
        Update: {
          account_number?: string
          address?: string
          amount?: number
          archived_at?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          note?: string | null
          package_name?: string | null
          status?: string
          unit_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "load_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          gcash_reference_number: string
          id: string
          load_request_id: string
          payment_method: string
          updated_at: string
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          gcash_reference_number: string
          id?: string
          load_request_id: string
          payment_method?: string
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          gcash_reference_number?: string
          id?: string
          load_request_id?: string
          payment_method?: string
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_load_request_id_fkey"
            columns: ["load_request_id"]
            isOneToOne: false
            referencedRelation: "load_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_name: string
          address: string | null
          created_at: string
          id: string
          phone_number: string
          role: string
          updated_at: string
          username: string | null
        }
        Insert: {
          account_name: string
          address?: string | null
          created_at?: string
          id: string
          phone_number: string
          role?: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          account_name?: string
          address?: string | null
          created_at?: string
          id?: string
          phone_number?: string
          role?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      request_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          load_request_id: string
          new_status: string
          previous_status: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          load_request_id: string
          new_status: string
          previous_status?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          load_request_id?: string
          new_status?: string
          previous_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "request_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_history_load_request_id_fkey"
            columns: ["load_request_id"]
            isOneToOne: false
            referencedRelation: "load_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      get_auth_identifier_for_username: {
        Args: { p_username: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
