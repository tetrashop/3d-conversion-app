export async function onRequestGet(context) {
  return new Response(JSON.stringify({
    message: "Use /api/download/[model_id] to download specific model"
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
