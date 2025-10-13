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
      audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
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
      billing_payments: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          cycle_id: string
          id: string
          payment_date: string
          payment_method: string
          payment_name: string
          updated_at: string
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          cycle_id: string
          id?: string
          payment_date?: string
          payment_method: string
          payment_name?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          cycle_id?: string
          id?: string
          payment_date?: string
          payment_method?: string
          payment_name?: string
          updated_at?: string
        }
        Relationships: []
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
          first_name: string | null
          fulfillment_services:
            | Database["public"]["Enums"]["fulfillment_service"][]
            | null
          id: string
          last_name: string | null
          phone_number: string
          pricing_active: boolean | null
          pricing_document_url: string | null
          receiving_format:
            | Database["public"]["Enums"]["receiving_format"]
            | null
          status: Database["public"]["Enums"]["client_status"] | null
          storage: boolean | null
          storage_method: string | null
          storage_units_per_month: number | null
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
          first_name?: string | null
          fulfillment_services?:
            | Database["public"]["Enums"]["fulfillment_service"][]
            | null
          id?: string
          last_name?: string | null
          phone_number: string
          pricing_active?: boolean | null
          pricing_document_url?: string | null
          receiving_format?:
            | Database["public"]["Enums"]["receiving_format"]
            | null
          status?: Database["public"]["Enums"]["client_status"] | null
          storage?: boolean | null
          storage_method?: string | null
          storage_units_per_month?: number | null
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
          first_name?: string | null
          fulfillment_services?:
            | Database["public"]["Enums"]["fulfillment_service"][]
            | null
          id?: string
          last_name?: string | null
          phone_number?: string
          pricing_active?: boolean | null
          pricing_document_url?: string | null
          receiving_format?:
            | Database["public"]["Enums"]["receiving_format"]
            | null
          status?: Database["public"]["Enums"]["client_status"] | null
          storage?: boolean | null
          storage_method?: string | null
          storage_units_per_month?: number | null
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
          section_type: string | null
          service_name: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          notes?: string | null
          price_per_unit?: number | null
          section_type?: string | null
          service_name: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          price_per_unit?: number | null
          section_type?: string | null
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
      generated_documents: {
        Row: {
          client_name_1: string | null
          client_name_2: string | null
          created_at: string
          document_type: string
          generated_by: string | null
          generated_date: string
          id: string
        }
        Insert: {
          client_name_1?: string | null
          client_name_2?: string | null
          created_at?: string
          document_type: string
          generated_by?: string | null
          generated_date?: string
          id?: string
        }
        Update: {
          client_name_1?: string | null
          client_name_2?: string | null
          created_at?: string
          document_type?: string
          generated_by?: string | null
          generated_date?: string
          id?: string
        }
        Relationships: []
      }
      intake_forms: {
        Row: {
          agreed_to_deposit: boolean
          amazon_seller_central: string | null
          amazon_seller_name: string
          average_units_per_shipment: number | null
          business_name: string
          city: string
          contact_name: string
          created_at: string
          email: string
          estimated_monthly_volume: number
          hazmat_products: string
          id: string
          need_bundling: boolean
          need_inspection: boolean
          need_labeling: boolean
          need_receiving: boolean
          need_shipping: boolean
          need_storage: boolean
          phone: string
          preferred_shipping_carrier: string | null
          product_type: string
          referral_source: string | null
          shipping_address: string
          special_requirements: string | null
          state: string
          status: string
          zip_code: string
        }
        Insert: {
          agreed_to_deposit?: boolean
          amazon_seller_central?: string | null
          amazon_seller_name: string
          average_units_per_shipment?: number | null
          business_name: string
          city: string
          contact_name: string
          created_at?: string
          email: string
          estimated_monthly_volume?: number
          hazmat_products: string
          id?: string
          need_bundling?: boolean
          need_inspection?: boolean
          need_labeling?: boolean
          need_receiving?: boolean
          need_shipping?: boolean
          need_storage?: boolean
          phone: string
          preferred_shipping_carrier?: string | null
          product_type: string
          referral_source?: string | null
          shipping_address: string
          special_requirements?: string | null
          state: string
          status?: string
          zip_code: string
        }
        Update: {
          agreed_to_deposit?: boolean
          amazon_seller_central?: string | null
          amazon_seller_name?: string
          average_units_per_shipment?: number | null
          business_name?: string
          city?: string
          contact_name?: string
          created_at?: string
          email?: string
          estimated_monthly_volume?: number
          hazmat_products?: string
          id?: string
          need_bundling?: boolean
          need_inspection?: boolean
          need_labeling?: boolean
          need_receiving?: boolean
          need_shipping?: boolean
          need_storage?: boolean
          phone?: string
          preferred_shipping_carrier?: string | null
          product_type?: string
          referral_source?: string | null
          shipping_address?: string
          special_requirements?: string | null
          state?: string
          status?: string
          zip_code?: string
        }
        Relationships: []
      }
      monthly_billing_cycles: {
        Row: {
          billing_month: string
          client_id: string
          created_at: string
          id: string
          locked_at: string | null
          quote_id: string
          statement_end_date: string | null
          statement_start_date: string | null
          status: string
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          billing_month: string
          client_id: string
          created_at?: string
          id?: string
          locked_at?: string | null
          quote_id: string
          statement_end_date?: string | null
          statement_start_date?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          billing_month?: string
          client_id?: string
          created_at?: string
          id?: string
          locked_at?: string | null
          quote_id?: string
          statement_end_date?: string | null
          statement_start_date?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_billing_cycles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_billing_cycles_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_billing_items: {
        Row: {
          created_at: string
          cycle_id: string
          id: string
          item_type: string
          quantity: number
          section_type: string | null
          service_name: string
          total_amount: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          cycle_id: string
          id?: string
          item_type?: string
          quantity?: number
          section_type?: string | null
          service_name: string
          total_amount: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          cycle_id?: string
          id?: string
          item_type?: string
          quantity?: number
          section_type?: string | null
          service_name?: string
          total_amount?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_billing_items_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "monthly_billing_cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      qc_images: {
        Row: {
          client_id: string
          damage_quantity: number | null
          expires_at: string
          id: string
          image_url: string
          is_damaged: boolean | null
          is_missing: boolean | null
          missing_quantity: number | null
          notes: string | null
          upload_date: string
        }
        Insert: {
          client_id: string
          damage_quantity?: number | null
          expires_at?: string
          id?: string
          image_url: string
          is_damaged?: boolean | null
          is_missing?: boolean | null
          missing_quantity?: number | null
          notes?: string | null
          upload_date?: string
        }
        Update: {
          client_id?: string
          damage_quantity?: number | null
          expires_at?: string
          id?: string
          image_url?: string
          is_damaged?: boolean | null
          is_missing?: boolean | null
          missing_quantity?: number | null
          notes?: string | null
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
          client_id: string | null
          created_at: string
          id: string
          quote_data: Json
          status: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id?: string
          quote_data: Json
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
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
      rate_limits: {
        Row: {
          created_at: string
          id: string
          rate_key: string
          request_count: number
          window_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          rate_key: string
          request_count?: number
          window_start?: string
        }
        Update: {
          created_at?: string
          id?: string
          rate_key?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
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
      cleanup_old_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      clear_password_expiration: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_expired_qc_images: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_own_client_account: {
        Args: Record<PropertyKey, never>
        Returns: Json
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
      client_status: "pending" | "active" | "inactive"
      fulfillment_service:
        | "fba_prep"
        | "wfs_prep"
        | "tiktok_prep"
        | "self_fulfilled"
        | "shopify"
        | "returns_processing"
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
      client_status: ["pending", "active", "inactive"],
      fulfillment_service: [
        "fba_prep",
        "wfs_prep",
        "tiktok_prep",
        "self_fulfilled",
        "shopify",
        "returns_processing",
      ],
      receiving_format: ["pallets", "cartons", "both"],
    },
  },
} as const
