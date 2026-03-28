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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          created_at: string | null
          date: string
          dimensions: Json | null
          id: string
          metric_type: string
          offer_id: string | null
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          date: string
          dimensions?: Json | null
          id?: string
          metric_type: string
          offer_id?: string | null
          user_id: string
          value: number
        }
        Update: {
          created_at?: string | null
          date?: string
          dimensions?: Json | null
          id?: string
          metric_type?: string
          offer_id?: string | null
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "analytics_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      contents: {
        Row: {
          audio_suggestion: string | null
          created_at: string | null
          cta: string | null
          format: string | null
          hashtags: string[] | null
          id: string
          image_url: string | null
          offer_id: string | null
          parent_id: string | null
          performance: Json | null
          text: string | null
          tone_of_voice: string | null
          type: string
          updated_at: string | null
          user_id: string
          version: number | null
          video_url: string | null
        }
        Insert: {
          audio_suggestion?: string | null
          created_at?: string | null
          cta?: string | null
          format?: string | null
          hashtags?: string[] | null
          id?: string
          image_url?: string | null
          offer_id?: string | null
          parent_id?: string | null
          performance?: Json | null
          text?: string | null
          tone_of_voice?: string | null
          type: string
          updated_at?: string | null
          user_id: string
          version?: number | null
          video_url?: string | null
        }
        Update: {
          audio_suggestion?: string | null
          created_at?: string | null
          cta?: string | null
          format?: string | null
          hashtags?: string[] | null
          id?: string
          image_url?: string | null
          offer_id?: string | null
          parent_id?: string | null
          performance?: Json | null
          text?: string | null
          tone_of_voice?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
          version?: number | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contents_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      insights: {
        Row: {
          created_at: string | null
          data: Json | null
          description: string | null
          expires_at: string | null
          id: string
          is_applied: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_applied?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_applied?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          affiliate_link: string
          category: string | null
          clicks: number | null
          commission: number | null
          conversions: number | null
          created_at: string | null
          description: string | null
          discount: number | null
          expiration_date: string | null
          external_id: string | null
          id: string
          image_url: string | null
          last_sync: string | null
          name: string
          original_price: number
          platform: string
          promotional_price: number
          status: string | null
          stock: number | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          affiliate_link: string
          category?: string | null
          clicks?: number | null
          commission?: number | null
          conversions?: number | null
          created_at?: string | null
          description?: string | null
          discount?: number | null
          expiration_date?: string | null
          external_id?: string | null
          id?: string
          image_url?: string | null
          last_sync?: string | null
          name: string
          original_price: number
          platform: string
          promotional_price: number
          status?: string | null
          stock?: number | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          affiliate_link?: string
          category?: string | null
          clicks?: number | null
          commission?: number | null
          conversions?: number | null
          created_at?: string | null
          description?: string | null
          discount?: number | null
          expiration_date?: string | null
          external_id?: string | null
          id?: string
          image_url?: string | null
          last_sync?: string | null
          name?: string
          original_price?: number
          platform?: string
          promotional_price?: number
          status?: string | null
          stock?: number | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          caption: string | null
          channel: string
          content_id: string | null
          content_type: string | null
          created_at: string | null
          id: string
          insights: Json | null
          offer_id: string | null
          offer_name: string | null
          platform: string | null
          published_at: string | null
          scheduled_date: string
          scheduled_time: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          caption?: string | null
          channel: string
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          insights?: Json | null
          offer_id?: string | null
          offer_name?: string | null
          platform?: string | null
          published_at?: string | null
          scheduled_date: string
          scheduled_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          caption?: string | null
          channel?: string
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          insights?: Json | null
          offer_id?: string | null
          offer_name?: string | null
          platform?: string | null
          published_at?: string | null
          scheduled_date?: string
          scheduled_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_posts_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "contents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_posts_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          ai_model: string | null
          api_key: string | null
          calendar_settings: Json | null
          created_at: string | null
          id: string
          notification_settings: Json | null
          ofertashop_config: Json | null
          sync_settings: Json | null
          updated_at: string | null
          user_id: string
          webhook_key: string | null
          whatsapp_group_link: string | null
          whatsapp_group_name: string | null
        }
        Insert: {
          ai_model?: string | null
          api_key?: string | null
          calendar_settings?: Json | null
          created_at?: string | null
          id?: string
          notification_settings?: Json | null
          ofertashop_config?: Json | null
          sync_settings?: Json | null
          updated_at?: string | null
          user_id: string
          webhook_key?: string | null
          whatsapp_group_link?: string | null
          whatsapp_group_name?: string | null
        }
        Update: {
          ai_model?: string | null
          api_key?: string | null
          calendar_settings?: Json | null
          created_at?: string | null
          id?: string
          notification_settings?: Json | null
          ofertashop_config?: Json | null
          sync_settings?: Json | null
          updated_at?: string | null
          user_id?: string
          webhook_key?: string | null
          whatsapp_group_link?: string | null
          whatsapp_group_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
