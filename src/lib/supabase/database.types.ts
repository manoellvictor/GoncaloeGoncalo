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
          department: "juridico" | "academico" | "administrativo";
          education: string[];
          experience: string | null;
          full_name: string | null;
          id: string;
          interests: string | null;
          is_partner: boolean;
          name: string;
          photo_url: string | null;
          practice: string | null;
          practice_areas: string[];
          profile_title: string | null;
          oab: string | null;
          publication: string | null;
          published: boolean;
          role: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          bio?: string | null;
          department?: "juridico" | "academico" | "administrativo";
          education?: string[];
          experience?: string | null;
          full_name?: string | null;
          id?: string;
          interests?: string | null;
          is_partner?: boolean;
          name: string;
          photo_url?: string | null;
          practice?: string | null;
          practice_areas?: string[];
          profile_title?: string | null;
          oab?: string | null;
          publication?: string | null;
          published?: boolean;
          role: string;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
        Relationships: [];
      };
      artigos: {
        Row: {
          area: AreaArtigo | null;
          atualizado_em: string;
          autor_nome: string | null;
          capa_alt: string | null;
          capa_url: string | null;
          conteudo: string;
          criado_em: string;
          destaque: boolean;
          id: string;
          publicado_em: string | null;
          resumo: string;
          seo_descricao: string | null;
          seo_titulo: string | null;
          slug: string;
          status: StatusArtigo;
          tipo: TipoArtigo;
          titulo: string;
          video_instagram_url: string | null;
        };
        Insert: {
          area?: AreaArtigo | null;
          autor_nome?: string | null;
          capa_alt?: string | null;
          capa_url?: string | null;
          conteudo?: string;
          destaque?: boolean;
          id?: string;
          publicado_em?: string | null;
          resumo?: string;
          seo_descricao?: string | null;
          seo_titulo?: string | null;
          slug: string;
          status?: StatusArtigo;
          tipo?: TipoArtigo;
          titulo?: string;
          video_instagram_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["artigos"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      e_escritorio: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      area_artigo: AreaArtigo;
      status_artigo: StatusArtigo;
      tipo_artigo: TipoArtigo;
    };
    CompositeTypes: { [_ in never]: never };
  };
};

export type AreaArtigo =
  | "Tributário"
  | "Cível"
  | "Contratual"
  | "Empresarial"
  | "Administrativo"
  | "Trabalhista"
  | "Agronegócio";
export type TipoArtigo = "Artigo" | "Notícia";
export type StatusArtigo = "rascunho" | "publicado";

type PublicTables = Database["public"]["Tables"];

export type Artigo = PublicTables["artigos"]["Row"];

export type PracticeArea = PublicTables["practice_areas"]["Row"];
export type TeamMember = PublicTables["team_members"]["Row"];
export type Faq = PublicTables["faqs"]["Row"];
export type ContactSubmissionInsert =
  PublicTables["contact_submissions"]["Insert"];
