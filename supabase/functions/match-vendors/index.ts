import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type BriefPayload = {
  category: string;
  quantity: number;
  priority: number;
  timeline: string;
};

type VendorRow = {
  id: string;
  company_name: string;
  category: string;
  location: string;
  moq_min: number;
  moq_max: number;
  quality_cost_score: number;
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

const scoreVendor = (brief: BriefPayload, vendor: VendorRow): number => {
  const categoryScore = brief.category.toLowerCase() === vendor.category.toLowerCase() ? 1 : 0.35;

  let moqScore = 0.2;
  if (brief.quantity >= vendor.moq_min && brief.quantity <= vendor.moq_max) {
    moqScore = 1;
  } else if (brief.quantity < vendor.moq_min) {
    moqScore = clamp(1 - (vendor.moq_min - brief.quantity) / Math.max(vendor.moq_min, 1));
  } else {
    moqScore = clamp(1 - (brief.quantity - vendor.moq_max) / Math.max(vendor.moq_max, 1));
  }

  const priorityTarget = clamp(brief.priority, 1, 5);
  const qualityAlignment = clamp(1 - Math.abs(vendor.quality_cost_score - priorityTarget) / 4);

  return Number((categoryScore * 0.45 + moqScore * 0.35 + qualityAlignment * 0.2).toFixed(4));
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const brief = (await req.json()) as BriefPayload;

  if (!brief?.category || !brief?.quantity || !brief?.priority || !brief?.timeline) {
    return new Response(JSON.stringify({ error: 'Invalid payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await supabase
    .from('vendors')
    .select('id, company_name, category, location, moq_min, moq_max, quality_cost_score')
    .eq('category', brief.category)
    .order('quality_cost_score', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ranked = (data ?? [])
    .map((vendor) => ({
      ...vendor,
      match_score: scoreVendor(brief, vendor as VendorRow),
    }))
    .sort((a, b) => b.match_score - a.match_score);

  return new Response(
    JSON.stringify({
      brief,
      vendors: ranked,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
});
