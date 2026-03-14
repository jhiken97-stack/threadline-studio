import { supabase } from './supabase';

export const setEscrowStatusByPaymentIntent = async (
  paymentIntentId: string,
  status: 'held' | 'released' | 'disputed',
  disputeDeadline?: string | null,
) => {
  const query = supabase
    .from('transactions')
    .update({
      escrow_status: status,
      dispute_deadline: disputeDeadline ?? null,
    })
    .eq('stripe_payment_intent_id', paymentIntentId)
    .select('id')
    .single();

  const { error } = await query;
  if (error) {
    throw new Error(`Failed to update transaction by payment intent ${paymentIntentId}: ${error.message}`);
  }
};

export const setEscrowStatusByProjectId = async (
  projectId: string,
  status: 'held' | 'released' | 'disputed',
) => {
  const { error } = await supabase
    .from('transactions')
    .update({ escrow_status: status })
    .eq('project_id', projectId);

  if (error) {
    throw new Error(`Failed to update transaction for project ${projectId}: ${error.message}`);
  }
};

export const releaseDueEscrows = async () => {
  const nowIso = new Date().toISOString();
  const { error } = await supabase
    .from('transactions')
    .update({ escrow_status: 'released' })
    .eq('escrow_status', 'held')
    .lte('dispute_deadline', nowIso);

  if (error) {
    throw new Error(`Failed scheduled escrow release: ${error.message}`);
  }
};
