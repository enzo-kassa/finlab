import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// O SupabaseService é injetável em qualquer outro service do NestJS.
// A chave do Supabase fica SOMENTE aqui no backend — nunca exposta ao frontend.

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  // Retorna o client para uso direto nos services
  getClient(): SupabaseClient {
    return this.client;
  }
}
