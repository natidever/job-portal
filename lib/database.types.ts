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
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      applications: {
        Row: {
          created_at: string
          cv_path: string
          email: string
          full_name: string
          id: string
          job_id: string
          phone: string
          seeker_id: string | null
          stage: Database["public"]["Enums"]["application_stage"]
          stage_changed_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cv_path: string
          email: string
          full_name: string
          id?: string
          job_id: string
          phone: string
          seeker_id?: string | null
          stage?: Database["public"]["Enums"]["application_stage"]
          stage_changed_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cv_path?: string
          email?: string
          full_name?: string
          id?: string
          job_id?: string
          phone?: string
          seeker_id?: string | null
          stage?: Database["public"]["Enums"]["application_stage"]
          stage_changed_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "public_job_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_seeker_id_fkey"
            columns: ["seeker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          id: string
          name: string
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      cities: {
        Row: {
          id: string
          name: string
          region: string
          sort_order: number
        }
        Insert: {
          id: string
          name: string
          region: string
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          region?: string
          sort_order?: number
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_path: string | null
          name: string
          owner_id: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_path?: string | null
          name: string
          owner_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_path?: string | null
          name?: string
          owner_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_posts: {
        Row: {
          area: string | null
          category_id: string
          city_id: string
          closed_at: string | null
          company_id: string
          created_at: string
          created_by: string | null
          deadline: string
          description: string
          duties: string[]
          experience: string
          experience_level: Database["public"]["Enums"]["experience_level"]
          id: string
          is_featured: boolean
          job_type: Database["public"]["Enums"]["job_type"]
          positions: number
          published_at: string | null
          qualification: string
          ref: string
          rejection_reason: string | null
          salary_max: number | null
          salary_min: number | null
          salary_note: string | null
          search: unknown
          status: Database["public"]["Enums"]["job_status"]
          submitted_at: string | null
          title: string
          updated_at: string
          workplace_type: Database["public"]["Enums"]["workplace_type"]
        }
        Insert: {
          area?: string | null
          category_id: string
          city_id: string
          closed_at?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          deadline: string
          description?: string
          duties?: string[]
          experience?: string
          experience_level?: Database["public"]["Enums"]["experience_level"]
          id?: string
          is_featured?: boolean
          job_type?: Database["public"]["Enums"]["job_type"]
          positions?: number
          published_at?: string | null
          qualification?: string
          ref?: string
          rejection_reason?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_note?: string | null
          search?: unknown
          status?: Database["public"]["Enums"]["job_status"]
          submitted_at?: string | null
          title: string
          updated_at?: string
          workplace_type?: Database["public"]["Enums"]["workplace_type"]
        }
        Update: {
          area?: string | null
          category_id?: string
          city_id?: string
          closed_at?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          deadline?: string
          description?: string
          duties?: string[]
          experience?: string
          experience_level?: Database["public"]["Enums"]["experience_level"]
          id?: string
          is_featured?: boolean
          job_type?: Database["public"]["Enums"]["job_type"]
          positions?: number
          published_at?: string | null
          qualification?: string
          ref?: string
          rejection_reason?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_note?: string | null
          search?: unknown
          status?: Database["public"]["Enums"]["job_status"]
          submitted_at?: string | null
          title?: string
          updated_at?: string
          workplace_type?: Database["public"]["Enums"]["workplace_type"]
        }
        Relationships: [
          {
            foreignKeyName: "job_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_posts_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_posts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_posts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          cv_path: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          cv_path?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          cv_path?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          created_at: string
          job_id: string
          seeker_id: string
        }
        Insert: {
          created_at?: string
          job_id: string
          seeker_id: string
        }
        Update: {
          created_at?: string
          job_id?: string
          seeker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "public_job_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_jobs_seeker_id_fkey"
            columns: ["seeker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_job_posts: {
        Row: {
          area: string | null
          category_id: string | null
          city_id: string | null
          closed_at: string | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          deadline: string | null
          description: string | null
          duties: string[] | null
          experience: string | null
          experience_level:
            | Database["public"]["Enums"]["experience_level"]
            | null
          id: string | null
          is_featured: boolean | null
          job_type: Database["public"]["Enums"]["job_type"] | null
          positions: number | null
          published_at: string | null
          qualification: string | null
          ref: string | null
          rejection_reason: string | null
          salary_max: number | null
          salary_min: number | null
          salary_note: string | null
          search: unknown
          status: Database["public"]["Enums"]["job_status"] | null
          submitted_at: string | null
          title: string | null
          updated_at: string | null
          workplace_type: Database["public"]["Enums"]["workplace_type"] | null
        }
        Insert: {
          area?: string | null
          category_id?: string | null
          city_id?: string | null
          closed_at?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          duties?: string[] | null
          experience?: string | null
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          id?: string | null
          is_featured?: boolean | null
          job_type?: Database["public"]["Enums"]["job_type"] | null
          positions?: number | null
          published_at?: string | null
          qualification?: string | null
          ref?: string | null
          rejection_reason?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_note?: string | null
          search?: unknown
          status?: Database["public"]["Enums"]["job_status"] | null
          submitted_at?: string | null
          title?: string | null
          updated_at?: string | null
          workplace_type?: Database["public"]["Enums"]["workplace_type"] | null
        }
        Update: {
          area?: string | null
          category_id?: string | null
          city_id?: string | null
          closed_at?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          duties?: string[] | null
          experience?: string | null
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          id?: string | null
          is_featured?: boolean | null
          job_type?: Database["public"]["Enums"]["job_type"] | null
          positions?: number | null
          published_at?: string | null
          qualification?: string | null
          ref?: string | null
          rejection_reason?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_note?: string | null
          search?: unknown
          status?: Database["public"]["Enums"]["job_status"] | null
          submitted_at?: string | null
          title?: string | null
          updated_at?: string | null
          workplace_type?: Database["public"]["Enums"]["workplace_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "job_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_posts_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_posts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_posts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_stage:
        | "new"
        | "shortlisted"
        | "interview"
        | "offered"
        | "hired"
        | "rejected"
      experience_level: "entry" | "junior" | "mid" | "senior" | "lead"
      job_status: "draft" | "pending" | "published" | "rejected" | "closed"
      job_type: "full_time" | "part_time" | "contract" | "internship"
      user_role: "seeker" | "employer" | "staff"
      workplace_type: "on_site" | "hybrid" | "remote"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      application_stage: [
        "new",
        "shortlisted",
        "interview",
        "offered",
        "hired",
        "rejected",
      ],
      experience_level: ["entry", "junior", "mid", "senior", "lead"],
      job_status: ["draft", "pending", "published", "rejected", "closed"],
      job_type: ["full_time", "part_time", "contract", "internship"],
      user_role: ["seeker", "employer", "staff"],
      workplace_type: ["on_site", "hybrid", "remote"],
    },
  },
} as const
