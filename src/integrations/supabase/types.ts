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
      asn_attachments: {
        Row: {
          asn_id: string
          asn_line_id: string | null
          created_at: string
          file_size: number | null
          file_url: string
          filename: string
          id: string
          mime_type: string | null
          uploaded_by: string | null
        }
        Insert: {
          asn_id: string
          asn_line_id?: string | null
          created_at?: string
          file_size?: number | null
          file_url: string
          filename: string
          id?: string
          mime_type?: string | null
          uploaded_by?: string | null
        }
        Update: {
          asn_id?: string
          asn_line_id?: string | null
          created_at?: string
          file_size?: number | null
          file_url?: string
          filename?: string
          id?: string
          mime_type?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asn_attachments_asn_id_fkey"
            columns: ["asn_id"]
            isOneToOne: false
            referencedRelation: "asn_headers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asn_attachments_asn_line_id_fkey"
            columns: ["asn_line_id"]
            isOneToOne: false
            referencedRelation: "asn_lines"
            referencedColumns: ["id"]
          },
        ]
      }
      asn_headers: {
        Row: {
          asn_number: string
          carrier: string | null
          client_id: string
          closed_at: string | null
          created_at: string
          created_by: string | null
          eta: string | null
          id: string
          notes: string | null
          received_at: string | null
          received_by: string | null
          ship_from: string | null
          status: Database["public"]["Enums"]["asn_status"]
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          asn_number: string
          carrier?: string | null
          client_id: string
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          eta?: string | null
          id?: string
          notes?: string | null
          received_at?: string | null
          received_by?: string | null
          ship_from?: string | null
          status?: Database["public"]["Enums"]["asn_status"]
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          asn_number?: string
          carrier?: string | null
          client_id?: string
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          eta?: string | null
          id?: string
          notes?: string | null
          received_at?: string | null
          received_by?: string | null
          ship_from?: string | null
          status?: Database["public"]["Enums"]["asn_status"]
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asn_headers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      asn_lines: {
        Row: {
          asn_id: string
          created_at: string
          damaged_units: number
          expected_units: number
          expiry_date: string | null
          id: string
          lot_number: string | null
          normal_units: number
          notes: string | null
          quarantined_units: number
          received_units: number
          reserved_units: number
          rework_units: number
          service_ticks: Json | null
          sku_id: string
          updated_at: string
        }
        Insert: {
          asn_id: string
          created_at?: string
          damaged_units?: number
          expected_units?: number
          expiry_date?: string | null
          id?: string
          lot_number?: string | null
          normal_units?: number
          notes?: string | null
          quarantined_units?: number
          received_units?: number
          reserved_units?: number
          rework_units?: number
          service_ticks?: Json | null
          sku_id: string
          updated_at?: string
        }
        Update: {
          asn_id?: string
          created_at?: string
          damaged_units?: number
          expected_units?: number
          expiry_date?: string | null
          id?: string
          lot_number?: string | null
          normal_units?: number
          notes?: string | null
          quarantined_units?: number
          received_units?: number
          reserved_units?: number
          rework_units?: number
          service_ticks?: Json | null
          sku_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asn_lines_asn_id_fkey"
            columns: ["asn_id"]
            isOneToOne: false
            referencedRelation: "asn_headers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asn_lines_sku_id_fkey"
            columns: ["sku_id"]
            isOneToOne: false
            referencedRelation: "skus"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          created_at: string
          expires_at: string | null
          file_size: number | null
          file_url: string
          filename: string
          id: string
          mime_type: string | null
          owner_id: string
          owner_type: string
          retention_days: number | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          file_size?: number | null
          file_url: string
          filename: string
          id?: string
          mime_type?: string | null
          owner_id: string
          owner_type: string
          retention_days?: number | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          file_size?: number | null
          file_url?: string
          filename?: string
          id?: string
          mime_type?: string | null
          owner_id?: string
          owner_type?: string
          retention_days?: number | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
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
      bill_items: {
        Row: {
          bill_id: string
          created_at: string
          created_by: string | null
          discount_cents: number
          id: string
          line_date: string
          note: string | null
          qty_decimal: number
          service_code: string | null
          service_name: string
          sku_ref: string | null
          source: string
          unit_price_cents: number
          updated_at: string
        }
        Insert: {
          bill_id: string
          created_at?: string
          created_by?: string | null
          discount_cents?: number
          id?: string
          line_date?: string
          note?: string | null
          qty_decimal?: number
          service_code?: string | null
          service_name: string
          sku_ref?: string | null
          source?: string
          unit_price_cents: number
          updated_at?: string
        }
        Update: {
          bill_id?: string
          created_at?: string
          created_by?: string | null
          discount_cents?: number
          id?: string
          line_date?: string
          note?: string | null
          qty_decimal?: number
          service_code?: string | null
          service_name?: string
          sku_ref?: string | null
          source?: string
          unit_price_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bill_items_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
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
          deleted_at: string | null
          deleted_by: string | null
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
          deleted_at?: string | null
          deleted_by?: string | null
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
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          payment_date?: string
          payment_method?: string
          payment_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      bills: {
        Row: {
          amount_due_cents: number
          billing_month: string
          client_id: string
          closed_at: string | null
          created_at: string
          discount_cents: number
          emailed_at: string | null
          id: string
          label: string | null
          memo: string | null
          opened_at: string
          pdf_url: string | null
          pricing_quote_id: string | null
          status: string
          subtotal_cents: number
          updated_at: string
        }
        Insert: {
          amount_due_cents?: number
          billing_month: string
          client_id: string
          closed_at?: string | null
          created_at?: string
          discount_cents?: number
          emailed_at?: string | null
          id?: string
          label?: string | null
          memo?: string | null
          opened_at?: string
          pdf_url?: string | null
          pricing_quote_id?: string | null
          status?: string
          subtotal_cents?: number
          updated_at?: string
        }
        Update: {
          amount_due_cents?: number
          billing_month?: string
          client_id?: string
          closed_at?: string | null
          created_at?: string
          discount_cents?: number
          emailed_at?: string | null
          id?: string
          label?: string | null
          memo?: string | null
          opened_at?: string
          pdf_url?: string | null
          pricing_quote_id?: string | null
          status?: string
          subtotal_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bills_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_pricing_quote_id_fkey"
            columns: ["pricing_quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          admin_notes: string | null
          billing_emails: string[] | null
          billing_frequency:
            | Database["public"]["Enums"]["billing_frequency"]
            | null
          channels: Database["public"]["Enums"]["channel_type"][]
          company_name: string
          contact_name: string
          created_at: string
          deposit_balance_cents: number
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
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          billing_emails?: string[] | null
          billing_frequency?:
            | Database["public"]["Enums"]["billing_frequency"]
            | null
          channels?: Database["public"]["Enums"]["channel_type"][]
          company_name: string
          contact_name: string
          created_at?: string
          deposit_balance_cents?: number
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
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          billing_emails?: string[] | null
          billing_frequency?:
            | Database["public"]["Enums"]["billing_frequency"]
            | null
          channels?: Database["public"]["Enums"]["channel_type"][]
          company_name?: string
          contact_name?: string
          created_at?: string
          deposit_balance_cents?: number
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
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      credits: {
        Row: {
          amount_cents: number
          bill_id: string | null
          client_id: string
          created_at: string
          created_by: string | null
          id: string
          memo: string | null
          reason: string
        }
        Insert: {
          amount_cents: number
          bill_id?: string | null
          client_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          memo?: string | null
          reason: string
        }
        Update: {
          amount_cents?: number
          bill_id?: string | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          memo?: string | null
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
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
      inventory_ledger: {
        Row: {
          client_id: string
          created_at: string
          expiry_date: string | null
          id: string
          location_id: string
          lot_number: string | null
          notes: string | null
          qty_delta: number
          reason_code: string | null
          sku_id: string
          source_ref: string | null
          source_type: string | null
          transaction_type: Database["public"]["Enums"]["ledger_type"]
          ts: string
          user_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          location_id: string
          lot_number?: string | null
          notes?: string | null
          qty_delta: number
          reason_code?: string | null
          sku_id: string
          source_ref?: string | null
          source_type?: string | null
          transaction_type: Database["public"]["Enums"]["ledger_type"]
          ts?: string
          user_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          location_id?: string
          lot_number?: string | null
          notes?: string | null
          qty_delta?: number
          reason_code?: string | null
          sku_id?: string
          source_ref?: string | null
          source_type?: string | null
          transaction_type?: Database["public"]["Enums"]["ledger_type"]
          ts?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_ledger_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_ledger_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_ledger_sku_id_fkey"
            columns: ["sku_id"]
            isOneToOne: false
            referencedRelation: "skus"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          qty: number
          quote_line_id: string | null
          sku: string | null
          total: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          qty?: number
          quote_line_id?: string | null
          sku?: string | null
          total?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          qty?: number
          quote_line_id?: string | null
          sku?: string | null
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_quote_line_id_fkey"
            columns: ["quote_line_id"]
            isOneToOne: false
            referencedRelation: "quote_lines"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number
          amount_total: number
          client_id: string
          created_at: string
          due_date: string | null
          id: string
          number: string
          status: string
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          amount_total?: number
          client_id: string
          created_at?: string
          due_date?: string | null
          id?: string
          number: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          amount_total?: number
          client_id?: string
          created_at?: string
          due_date?: string | null
          id?: string
          number?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
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
      oauth_states: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          state: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          state: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          state?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_events: {
        Row: {
          actor_id: string | null
          amount: number
          created_at: string
          id: string
          method: string
          note: string | null
          payment_id: string
          type: string
        }
        Insert: {
          actor_id?: string | null
          amount: number
          created_at?: string
          id?: string
          method: string
          note?: string | null
          payment_id: string
          type: string
        }
        Update: {
          actor_id?: string | null
          amount?: number
          created_at?: string
          id?: string
          method?: string
          note?: string | null
          payment_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "billing_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number
          bill_id: string | null
          client_id: string
          created_at: string
          created_by: string | null
          external_ref: string | null
          id: string
          memo: string | null
          method: string
          received_at: string
        }
        Insert: {
          amount_cents: number
          bill_id?: string | null
          client_id: string
          created_at?: string
          created_by?: string | null
          external_ref?: string | null
          id?: string
          memo?: string | null
          method: string
          received_at?: string
        }
        Update: {
          amount_cents?: number
          bill_id?: string | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          external_ref?: string | null
          id?: string
          memo?: string | null
          method?: string
          received_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      prep_tasks: {
        Row: {
          created_at: string
          id: string
          prepped_qty: number
          shipment_item_id: string
          status: Database["public"]["Enums"]["prep_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          prepped_qty?: number
          shipment_item_id: string
          status?: Database["public"]["Enums"]["prep_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          prepped_qty?: number
          shipment_item_id?: string
          status?: Database["public"]["Enums"]["prep_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prep_tasks_shipment_item_id_fkey"
            columns: ["shipment_item_id"]
            isOneToOne: false
            referencedRelation: "shipment_items"
            referencedColumns: ["id"]
          },
        ]
      }
      price_changes: {
        Row: {
          actor_id: string | null
          created_at: string
          id: string
          new_price: number
          old_price: number
          quote_line_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: string
          new_price: number
          old_price: number
          quote_line_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: string
          new_price?: number
          old_price?: number
          quote_line_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_changes_quote_line_id_fkey"
            columns: ["quote_line_id"]
            isOneToOne: false
            referencedRelation: "quote_lines"
            referencedColumns: ["id"]
          },
        ]
      }
      processed_webhooks: {
        Row: {
          created_at: string
          id: string
          processed_at: string
          shop_domain: string
          topic: string
          webhook_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          processed_at?: string
          shop_domain: string
          topic: string
          webhook_id: string
        }
        Update: {
          created_at?: string
          id?: string
          processed_at?: string
          shop_domain?: string
          topic?: string
          webhook_id?: string
        }
        Relationships: []
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
      quote_lines: {
        Row: {
          created_at: string
          id: string
          line_status: Database["public"]["Enums"]["line_status"]
          line_total: number
          notes: string | null
          product_name: string | null
          qty_actual: number
          qty_estimated: number
          quote_id: string
          service_type: string
          sku: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          line_status?: Database["public"]["Enums"]["line_status"]
          line_total?: number
          notes?: string | null
          product_name?: string | null
          qty_actual?: number
          qty_estimated?: number
          quote_id: string
          service_type: string
          sku: string
          unit_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          line_status?: Database["public"]["Enums"]["line_status"]
          line_total?: number
          notes?: string | null
          product_name?: string | null
          qty_actual?: number
          qty_estimated?: number
          quote_id?: string
          service_type?: string
          sku?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_lines_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          activated_at: string | null
          client_id: string | null
          created_at: string
          created_by: string | null
          id: string
          memo: string | null
          quote_data: Json
          status: Database["public"]["Enums"]["quote_status"]
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          memo?: string | null
          quote_data: Json
          status?: Database["public"]["Enums"]["quote_status"]
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          memo?: string | null
          quote_data?: Json
          status?: Database["public"]["Enums"]["quote_status"]
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
      receiving_items: {
        Row: {
          created_at: string
          damaged_qty: number
          expected_qty: number
          id: string
          missing_qty: number
          notes: string | null
          received_qty: number
          receiving_id: string
          sku: string
        }
        Insert: {
          created_at?: string
          damaged_qty?: number
          expected_qty?: number
          id?: string
          missing_qty?: number
          notes?: string | null
          received_qty?: number
          receiving_id: string
          sku: string
        }
        Update: {
          created_at?: string
          damaged_qty?: number
          expected_qty?: number
          id?: string
          missing_qty?: number
          notes?: string | null
          received_qty?: number
          receiving_id?: string
          sku?: string
        }
        Relationships: [
          {
            foreignKeyName: "receiving_items_receiving_id_fkey"
            columns: ["receiving_id"]
            isOneToOne: false
            referencedRelation: "receivings"
            referencedColumns: ["id"]
          },
        ]
      }
      receivings: {
        Row: {
          client_id: string
          created_at: string
          id: string
          quote_id: string | null
          received_at: string
          received_by: string | null
          shipment_ref: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          quote_id?: string | null
          received_at?: string
          received_by?: string | null
          shipment_ref: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          quote_id?: string | null
          received_at?: string
          received_by?: string | null
          shipment_ref?: string
        }
        Relationships: [
          {
            foreignKeyName: "receivings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receivings_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      report_jobs: {
        Row: {
          client_id: string
          created_at: string
          email_enabled: boolean
          emailed: boolean
          id: string
          pdf_url: string | null
          period_end: string
          period_start: string
        }
        Insert: {
          client_id: string
          created_at?: string
          email_enabled?: boolean
          emailed?: boolean
          id?: string
          pdf_url?: string | null
          period_end: string
          period_start: string
        }
        Update: {
          client_id?: string
          created_at?: string
          email_enabled?: boolean
          emailed?: boolean
          id?: string
          pdf_url?: string | null
          period_end?: string
          period_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_jobs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_items: {
        Row: {
          created_at: string
          damaged_qty: number
          expected_qty: number
          id: string
          missing_qty: number
          product_name: string | null
          received_qty: number
          shipment_id: string
          sku: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          damaged_qty?: number
          expected_qty?: number
          id?: string
          missing_qty?: number
          product_name?: string | null
          received_qty?: number
          shipment_id: string
          sku: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          damaged_qty?: number
          expected_qty?: number
          id?: string
          missing_qty?: number
          product_name?: string | null
          received_qty?: number
          shipment_id?: string
          sku?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipment_items_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          client_id: string
          created_at: string
          id: string
          received_at: string
          shipment_ref: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          received_at?: string
          shipment_ref: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          received_at?: string
          shipment_ref?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      shopify_orders: {
        Row: {
          client_id: string
          created_at_shopify: string | null
          currency: string | null
          customer_email: string | null
          customer_name: string | null
          financial_status: string | null
          fulfillment_status: string | null
          id: string
          line_items: Json | null
          order_number: string | null
          shipping_address: Json | null
          shopify_order_id: string
          synced_at: string
          total_price: number | null
          updated_at_shopify: string | null
        }
        Insert: {
          client_id: string
          created_at_shopify?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          financial_status?: string | null
          fulfillment_status?: string | null
          id?: string
          line_items?: Json | null
          order_number?: string | null
          shipping_address?: Json | null
          shopify_order_id: string
          synced_at?: string
          total_price?: number | null
          updated_at_shopify?: string | null
        }
        Update: {
          client_id?: string
          created_at_shopify?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          financial_status?: string | null
          fulfillment_status?: string | null
          id?: string
          line_items?: Json | null
          order_number?: string | null
          shipping_address?: Json | null
          shopify_order_id?: string
          synced_at?: string
          total_price?: number | null
          updated_at_shopify?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopify_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      shopify_stores: {
        Row: {
          access_token: string
          client_id: string
          connected_at: string
          id: string
          is_active: boolean
          scope: string
          shop_domain: string
          updated_at: string
        }
        Insert: {
          access_token: string
          client_id: string
          connected_at?: string
          id?: string
          is_active?: boolean
          scope: string
          shop_domain: string
          updated_at?: string
        }
        Update: {
          access_token?: string
          client_id?: string
          connected_at?: string
          id?: string
          is_active?: boolean
          scope?: string
          shop_domain?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopify_stores_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      shopify_sync_config: {
        Row: {
          auto_sync_enabled: boolean
          client_id: string
          created_at: string
          id: string
          last_sync_at: string | null
          last_sync_product_count: number | null
          last_sync_status: string | null
          next_sync_at: string | null
          sync_frequency: string
          updated_at: string
        }
        Insert: {
          auto_sync_enabled?: boolean
          client_id: string
          created_at?: string
          id?: string
          last_sync_at?: string | null
          last_sync_product_count?: number | null
          last_sync_status?: string | null
          next_sync_at?: string | null
          sync_frequency?: string
          updated_at?: string
        }
        Update: {
          auto_sync_enabled?: boolean
          client_id?: string
          created_at?: string
          id?: string
          last_sync_at?: string | null
          last_sync_product_count?: number | null
          last_sync_status?: string | null
          next_sync_at?: string | null
          sync_frequency?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopify_sync_config_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      shopify_webhooks: {
        Row: {
          address: string
          client_id: string
          created_at: string
          id: string
          is_active: boolean
          topic: string
          updated_at: string
          webhook_id: string
        }
        Insert: {
          address: string
          client_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          topic: string
          updated_at?: string
          webhook_id: string
        }
        Update: {
          address?: string
          client_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          topic?: string
          updated_at?: string
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopify_webhooks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      sku_aliases: {
        Row: {
          alias_type: string
          alias_value: string
          created_at: string
          id: string
          sku_id: string
        }
        Insert: {
          alias_type: string
          alias_value: string
          created_at?: string
          id?: string
          sku_id: string
        }
        Update: {
          alias_type?: string
          alias_value?: string
          created_at?: string
          id?: string
          sku_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sku_aliases_sku_id_fkey"
            columns: ["sku_id"]
            isOneToOne: false
            referencedRelation: "skus"
            referencedColumns: ["id"]
          },
        ]
      }
      skus: {
        Row: {
          asin: string | null
          brand: string | null
          client_id: string
          client_sku: string
          created_at: string
          ean: string | null
          fnsku: string | null
          has_expiration: boolean
          has_lot_tracking: boolean
          height: number | null
          id: string
          image_url: string | null
          length: number | null
          notes: string | null
          prep_requirements: Json | null
          status: string
          title: string
          unit_cost: number | null
          upc: string | null
          updated_at: string
          weight: number | null
          width: number | null
        }
        Insert: {
          asin?: string | null
          brand?: string | null
          client_id: string
          client_sku: string
          created_at?: string
          ean?: string | null
          fnsku?: string | null
          has_expiration?: boolean
          has_lot_tracking?: boolean
          height?: number | null
          id?: string
          image_url?: string | null
          length?: number | null
          notes?: string | null
          prep_requirements?: Json | null
          status?: string
          title: string
          unit_cost?: number | null
          upc?: string | null
          updated_at?: string
          weight?: number | null
          width?: number | null
        }
        Update: {
          asin?: string | null
          brand?: string | null
          client_id?: string
          client_sku?: string
          created_at?: string
          ean?: string | null
          fnsku?: string | null
          has_expiration?: boolean
          has_lot_tracking?: boolean
          height?: number | null
          id?: string
          image_url?: string | null
          length?: number | null
          notes?: string | null
          prep_requirements?: Json | null
          status?: string
          title?: string
          unit_cost?: number | null
          upc?: string | null
          updated_at?: string
          weight?: number | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "skus_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_logs: {
        Row: {
          client_id: string
          created_at: string
          duration_ms: number | null
          error_message: string | null
          id: string
          products_synced: number | null
          status: string
          sync_type: string
          triggered_by: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          products_synced?: number | null
          status?: string
          sync_type: string
          triggered_by?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          products_synced?: number | null
          status?: string
          sync_type?: string
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_logs_client_id_fkey"
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
      webhook_delivery_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          payload: Json | null
          shop_domain: string
          status: string
          topic: string
          webhook_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          payload?: Json | null
          shop_domain: string
          status: string
          topic: string
          webhook_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          payload?: Json | null
          shop_domain?: string
          status?: string
          topic?: string
          webhook_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      inventory_summary: {
        Row: {
          available: number | null
          client_id: string | null
          client_sku: string | null
          fnsku: string | null
          location_id: string | null
          location_name: string | null
          on_hand: number | null
          reserved: number | null
          sku_id: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_ledger_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_ledger_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_ledger_sku_id_fkey"
            columns: ["sku_id"]
            isOneToOne: false
            referencedRelation: "skus"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      cleanup_expired_attachments: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_old_oauth_states: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_sync_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      clear_password_expiration: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_own_client_account: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      generate_asn_number: {
        Args: { p_client_id: string }
        Returns: string
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
      asn_status: "draft" | "in_progress" | "received" | "closed"
      billing_frequency: "pay_as_go" | "end_of_month"
      channel_type: "amazon" | "walmart" | "shopify" | "ebay" | "other"
      client_status: "pending" | "active" | "inactive"
      condition_type: "normal" | "damaged" | "quarantined" | "rework"
      fulfillment_service:
        | "fba_prep"
        | "wfs_prep"
        | "tiktok_prep"
        | "self_fulfilled"
        | "shopify"
        | "returns_processing"
      ledger_type:
        | "RECEIPT"
        | "ADJUSTMENT_PLUS"
        | "ADJUSTMENT_MINUS"
        | "SALE_DECREMENT"
        | "RETURN"
        | "TRANSFER"
        | "RESERVE"
        | "RELEASE"
      line_status: "awaiting" | "in_progress" | "ready" | "shipped"
      prep_status: "awaiting" | "in_progress" | "ready"
      quote_status: "draft" | "active" | "replaced" | "archived"
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
      asn_status: ["draft", "in_progress", "received", "closed"],
      billing_frequency: ["pay_as_go", "end_of_month"],
      channel_type: ["amazon", "walmart", "shopify", "ebay", "other"],
      client_status: ["pending", "active", "inactive"],
      condition_type: ["normal", "damaged", "quarantined", "rework"],
      fulfillment_service: [
        "fba_prep",
        "wfs_prep",
        "tiktok_prep",
        "self_fulfilled",
        "shopify",
        "returns_processing",
      ],
      ledger_type: [
        "RECEIPT",
        "ADJUSTMENT_PLUS",
        "ADJUSTMENT_MINUS",
        "SALE_DECREMENT",
        "RETURN",
        "TRANSFER",
        "RESERVE",
        "RELEASE",
      ],
      line_status: ["awaiting", "in_progress", "ready", "shipped"],
      prep_status: ["awaiting", "in_progress", "ready"],
      quote_status: ["draft", "active", "replaced", "archived"],
      receiving_format: ["pallets", "cartons", "both"],
    },
  },
} as const
