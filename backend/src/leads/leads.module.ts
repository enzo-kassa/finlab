import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService }    from './leads.service';
import { SupabaseService } from '../supabase/supabase.service';

// O Module agrupa tudo relacionado a leads.
// O SupabaseService é declarado aqui como provider para poder ser injetado.

@Module({
  controllers: [LeadsController],
  providers:   [LeadsService, SupabaseService],
})
export class LeadsModule {}
