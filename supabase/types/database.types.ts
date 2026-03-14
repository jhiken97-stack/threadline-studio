export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      briefs: {
        Row: {
          category: string;
          created_at: string;
          id: string;
          priority: number;
          quantity: number;
          tech_pack_url: string | null;
          timeline: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          id?: string;
          priority: number;
          quantity: number;
          tech_pack_url?: string | null;
          timeline: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          id?: string;
          priority?: number;
          quantity?: number;
          tech_pack_url?: string | null;
          timeline?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'briefs_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      messages: {
        Row: {
          body: string;
          created_at: string;
          id: string;
          project_id: string;
          sender_id: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          id?: string;
          project_id: string;
          sender_id: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          id?: string;
          project_id?: string;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      projects: {
        Row: {
          brief_id: string;
          created_at: string;
          id: string;
          milestones: Json;
          stage: Database['public']['Enums']['project_stage'];
          updated_at: string;
          vendor_id: string;
        };
        Insert: {
          brief_id: string;
          created_at?: string;
          id?: string;
          milestones?: Json;
          stage?: Database['public']['Enums']['project_stage'];
          updated_at?: string;
          vendor_id: string;
        };
        Update: {
          brief_id?: string;
          created_at?: string;
          id?: string;
          milestones?: Json;
          stage?: Database['public']['Enums']['project_stage'];
          updated_at?: string;
          vendor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'projects_brief_id_fkey';
            columns: ['brief_id'];
            isOneToOne: false;
            referencedRelation: 'briefs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'projects_vendor_id_fkey';
            columns: ['vendor_id'];
            isOneToOne: false;
            referencedRelation: 'vendors';
            referencedColumns: ['id'];
          },
        ];
      };
      transactions: {
        Row: {
          amount: number;
          created_at: string;
          dispute_deadline: string | null;
          escrow_status: Database['public']['Enums']['escrow_status'];
          id: string;
          project_id: string;
          stripe_payment_intent_id: string | null;
          updated_at: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          dispute_deadline?: string | null;
          escrow_status?: Database['public']['Enums']['escrow_status'];
          id?: string;
          project_id: string;
          stripe_payment_intent_id?: string | null;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          dispute_deadline?: string | null;
          escrow_status?: Database['public']['Enums']['escrow_status'];
          id?: string;
          project_id?: string;
          stripe_payment_intent_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transactions_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: true;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          role: Database['public']['Enums']['user_role'];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          role: Database['public']['Enums']['user_role'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          role?: Database['public']['Enums']['user_role'];
          updated_at?: string;
        };
        Relationships: [];
      };
      vendors: {
        Row: {
          category: string;
          company_name: string;
          created_at: string;
          id: string;
          is_sensitive: boolean;
          location: string;
          moq_max: number;
          moq_min: number;
          quality_cost_score: number;
          sensitive_fields: Json;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          category: string;
          company_name: string;
          created_at?: string;
          id?: string;
          is_sensitive?: boolean;
          location: string;
          moq_max: number;
          moq_min: number;
          quality_cost_score: number;
          sensitive_fields?: Json;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          category?: string;
          company_name?: string;
          created_at?: string;
          id?: string;
          is_sensitive?: boolean;
          location?: string;
          moq_max?: number;
          moq_min?: number;
          quality_cost_score?: number;
          sensitive_fields?: Json;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'vendors_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      vendors_public: {
        Row: {
          category: string | null;
          company_name: string | null;
          created_at: string | null;
          id: string | null;
          location: string | null;
          moq_max: number | null;
          moq_min: number | null;
          quality_cost_score: number | null;
          updated_at: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      set_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      escrow_status: 'held' | 'released' | 'disputed';
      project_stage: 'discovery' | 'briefing' | 'sampling' | 'production' | 'logistics';
      user_role: 'brand' | 'manufacturer';
    };
    CompositeTypes: Record<PropertyKey, never>;
  };
};
