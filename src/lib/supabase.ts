import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bkuongftszhyxijjsnfz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrdW9uZ2Z0c3poeXhpampzbmZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MjE1OTYsImV4cCI6MjEwMjk5NzU5Nn0.fN_h_mAcAo27LUIS0QF-V03kfPxiG-Oa3_O_hTrgEE4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);