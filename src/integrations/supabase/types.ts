export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          description: string
          icon: string
          icon_color: string
          id: string
          link: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          icon: string
          icon_color: string
          id?: string
          link: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string
          icon_color?: string
          id?: string
          link?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      insurance_policies: {
        Row: {
          attachment_url: string | null
          coverage_amount: number
          created_at: string | null
          customer_name: string
          customer_phone: string | null
          expiry_date: string
          id: string
          insurer: string
          issue_date: string
          notes: string | null
          policy_number: string
          premium: number
          reminder_date: string | null
          reminder_sent: boolean | null
          status: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attachment_url?: string | null
          coverage_amount: number
          created_at?: string | null
          customer_name: string
          customer_phone?: string | null
          expiry_date: string
          id?: string
          insurer: string
          issue_date: string
          notes?: string | null
          policy_number: string
          premium: number
          reminder_date?: string | null
          reminder_sent?: boolean | null
          status?: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attachment_url?: string | null
          coverage_amount?: number
          created_at?: string | null
          customer_name?: string
          customer_phone?: string | null
          expiry_date?: string
          id?: string
          insurer?: string
          issue_date?: string
          notes?: string | null
          policy_number?: string
          premium?: number
          reminder_date?: string | null
          reminder_sent?: boolean | null
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      policies: {
        Row: {
          coverage_amount: string
          created_at: string
          customer: string
          document_url: string | null
          end_date: string
          file_name: string | null
          id: string
          insurer: string
          policy_number: string
          premium_value: string
          start_date: string
          status: string
          user_id: string | null
        }
        Insert: {
          coverage_amount: string
          created_at?: string
          customer: string
          document_url?: string | null
          end_date: string
          file_name?: string | null
          id?: string
          insurer: string
          policy_number: string
          premium_value: string
          start_date: string
          status: string
          user_id?: string | null
        }
        Update: {
          coverage_amount?: string
          created_at?: string
          customer?: string
          document_url?: string | null
          end_date?: string
          file_name?: string | null
          id?: string
          insurer?: string
          policy_number?: string
          premium_value?: string
          start_date?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      policy_reminder_logs: {
        Row: {
          created_at: string
          id: string
          message_id: string | null
          policy_id: string
          recipient_phone: string
          sent_at: string
          status: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message_id?: string | null
          policy_id: string
          recipient_phone: string
          sent_at?: string
          status?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string | null
          policy_id?: string
          recipient_phone?: string
          sent_at?: string
          status?: string | null
        }
        Relationships: []
      }
      portfolio_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          portfolio_id: string
          sort_order: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          portfolio_id: string
          sort_order?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          portfolio_id?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          category: string
          client: string
          completed: string
          created_at: string | null
          description: string | null
          featured: boolean
          featured_image: string | null
          id: string
          images: string[] | null
          link: string | null
          technologies: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string
          client: string
          completed?: string
          created_at?: string | null
          description?: string | null
          featured?: boolean
          featured_image?: string | null
          id?: string
          images?: string[] | null
          link?: string | null
          technologies?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          client?: string
          completed?: string
          created_at?: string | null
          description?: string | null
          featured?: boolean
          featured_image?: string | null
          id?: string
          images?: string[] | null
          link?: string | null
          technologies?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      project_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          project_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          project_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_attachments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_status_updates: {
        Row: {
          created_at: string
          created_by: string
          id: string
          message: string
          project_id: string
          status: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          message: string
          project_id: string
          status: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          message?: string
          project_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_status_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          search_vector: unknown | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          search_vector?: unknown | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          search_vector?: unknown | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_avatar_url: string | null
          client_company: string | null
          client_name: string
          client_position: string | null
          content: string
          created_at: string
          id: string
          is_featured: boolean | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          client_avatar_url?: string | null
          client_company?: string | null
          client_name: string
          client_position?: string | null
          content: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          client_avatar_url?: string | null
          client_company?: string | null
          client_name?: string
          client_position?: string | null
          content?: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          id: string
          policy_reminder_days: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          policy_reminder_days?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          policy_reminder_days?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      voice_command_events: {
        Row: {
          contact_phone: string | null
          created_at: string
          date: string
          description: string | null
          duration: number | null
          id: string
          reminder_scheduled_for: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          contact_phone?: string | null
          created_at?: string
          date: string
          description?: string | null
          duration?: number | null
          id?: string
          reminder_scheduled_for?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          contact_phone?: string | null
          created_at?: string
          date?: string
          description?: string | null
          duration?: number | null
          id?: string
          reminder_scheduled_for?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_policy_expirations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
