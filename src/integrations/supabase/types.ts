export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      billing_charges: {
        Row: {
          billing_month: string
          charge_date: string
          client_id: string
          created_at: string
          description: string | null
          id: string
          quantity: number
          service_name: string
          total_amount: number
          unit_price: number
        }
        Insert: {
          billing_month: string
          charge_date?: string
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          quantity: number
          service_name: string
          total_amount: number
          unit_price: number
        }
        Update: {
          billing_month?: string
          charge_date?: string
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          quantity?: number
          service_name?: string
          total_amount?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "billing_charges_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          admin_notes: string | null
          billing_frequency:
            | Database["public"]["Enums"]["billing_frequency"]
            | null
          channels: Database["public"]["Enums"]["channel_type"][]
          company_name: string
          contact_name: string
          created_at: string
          email: string
          estimated_units_per_month: number | null
          extra_prep: boolean | null
          id: string
          password_expires_at: string | null
          phone_number: string
          pricing_active: boolean | null
          receiving_format:
            | Database["public"]["Enums"]["receiving_format"]
            | null
          storage: boolean | null
          storage_units_per_month: number | null
          temp_password: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          billing_frequency?:
            | Database["public"]["Enums"]["billing_frequency"]
            | null
          channels?: Database["public"]["Enums"]["channel_type"][]
          company_name: string
          contact_name: string
          created_at?: string
          email: string
          estimated_units_per_month?: number | null
          extra_prep?: boolean | null
          id?: string
          password_expires_at?: string | null
          phone_number: string
          pricing_active?: boolean | null
          receiving_format?:
            | Database["public"]["Enums"]["receiving_format"]
            | null
          storage?: boolean | null
          storage_units_per_month?: number | null
          temp_password?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          billing_frequency?:
            | Database["public"]["Enums"]["billing_frequency"]
            | null
          channels?: Database["public"]["Enums"]["channel_type"][]
          company_name?: string
          contact_name?: string
          created_at?: string
          email?: string
          estimated_units_per_month?: number | null
          extra_prep?: boolean | null
          id?: string
          password_expires_at?: string | null
          phone_number?: string
          pricing_active?: boolean | null
          receiving_format?:
            | Database["public"]["Enums"]["receiving_format"]
            | null
          storage?: boolean | null
          storage_units_per_month?: number | null
          temp_password?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      custom_pricing: {
        Row: {
          client_id: string
          created_at: string
          id: string
          notes: string | null
          price_per_unit: number | null
          service_name: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          notes?: string | null
          price_per_unit?: number | null
          service_name: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          price_per_unit?: number | null
          service_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_pricing_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      qc_images: {
        Row: {
          client_id: string
          expires_at: string
          id: string
          image_url: string
          upload_date: string
        }
        Insert: {
          client_id: string
          expires_at?: string
          id?: string
          image_url: string
          upload_date?: string
        }
        Update: {
          client_id?: string
          expires_at?: string
          id?: string
          image_url?: string
          upload_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "qc_images_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          client_id: string
          created_at: string
          id: string
          quote_data: Json
          status: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          quote_data: Json
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          quote_data?: Json
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_expired_qc_images: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client"
      billing_frequency: "pay_as_go" | "end_of_month"
      channel_type: "amazon" | "walmart" | "shopify" | "ebay" | "other"
      receiving_format: "pallets" | "cartons" | "both"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "client"],
      billing_frequency: ["pay_as_go", "end_of_month"],
      channel_type: ["amazon", "walmart", "shopify", "ebay", "other"],
      receiving_format: ["pallets", "cartons", "both"],
    },
  },
} as const
