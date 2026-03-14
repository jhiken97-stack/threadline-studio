export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      transactions: {
        Row: {
          amount: number;
          created_at: string;
          dispute_deadline: string | null;
          escrow_status: 'held' | 'released' | 'disputed';
          id: string;
          project_id: string;
          stripe_payment_intent_id: string | null;
          updated_at: string;
        };
        Insert: {
          amount: number;
          project_id: string;
          escrow_status?: 'held' | 'released' | 'disputed';
          stripe_payment_intent_id?: string | null;
          dispute_deadline?: string | null;
        };
        Update: {
          amount?: number;
          escrow_status?: 'held' | 'released' | 'disputed';
          stripe_payment_intent_id?: string | null;
          dispute_deadline?: string | null;
        };
      };
    };
  };
};
