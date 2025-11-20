'use server';

export async function logFeedback(formData: FormData) {
  const message = formData.get('message');
  console.log('Received customer feedback', message);
  return { ok: true };
}
