/**
 * Tipos gerados a partir do schema do Supabase.
 *
 * Regerar após qualquer migração:
 *   npx supabase gen types typescript --project-id ungjggbqrtxedbknuadd
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          category: string;
          content: string | null;
          cover_image_url: string | null;
          created_at: string;
          excerpt: string;
          id: string;
          meta_description: string | null;
          published: boolean;
          published_at: string;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          category?: string;
          content?: string | null;
          cover_image_url?: string | null;
          excerpt: string;
          meta_description?: string | null;
          id?: string;
          published?: boolean;
          published_at?: string;
          slug: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["articles"]["Insert"]>;
        Relationships: [];
      };
      contact_submissions: {
        Row: {
          company: string | null;
          created_at: string;
          email: string;
          id: string;
          lgpd_consent: boolean;
          message: string;
          name: string;
          phone: string;
          status: string;
        };
        Insert: {
          company?: string | null;
          email: string;
          id?: string;
          lgpd_consent?: boolean;
          message: string;
          name: string;
          phone: string;
          status?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["contact_submissions"]["Insert"]
        >;
        Relationships: [];
      };
      faqs: {
        Row: {
          answer: string;
          category: string | null;
          created_at: string;
          id: string;
          is_featured: boolean;
          published: boolean;
          question: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          answer: string;
          category?: string | null;
          id?: string;
          is_featured?: boolean;
          published?: boolean;
          question: string;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["faqs"]["Insert"]>;
        Relationships: [];
      };
      practice_areas: {
        Row: {
          body: string | null;
          created_at: string;
          icon: string | null;
          id: string;
          image_url: string | null;
          is_featured: boolean;
          meta_description: string | null;
          published: boolean;
          services: string[];
          short_description: string;
          slug: string;
          sort_order: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          body?: string | null;
          icon?: string | null;
          id?: string;
          image_url?: string | null;
          meta_description?: string | null;
          is_featured?: boolean;
          published?: boolean;
          services?: string[];
          short_description: string;
          slug: string;
          sort_order?: number;
          title: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["practice_areas"]["Insert"]
        >;
        Relationships: [];
      };
      team_members: {
        Row: {
          bio: string | null;
          created_at: string;
          id: string;
          is_partner: boolean;
          name: string;
          photo_url: string | null;
          published: boolean;
          role: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          bio?: string | null;
          id?: string;
          is_partner?: boolean;
          name: string;
          photo_url?: string | null;
          published?: boolean;
          role: string;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

type PublicTables = Database["public"]["Tables"];

export type Article = PublicTables["articles"]["Row"];
export type PracticeArea = PublicTables["practice_areas"]["Row"];
export type TeamMember = PublicTables["team_members"]["Row"];
export type Faq = PublicTables["faqs"]["Row"];
export type ContactSubmissionInsert =
  PublicTables["contact_submissions"]["Insert"];
