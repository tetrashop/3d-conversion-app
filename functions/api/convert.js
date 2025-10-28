export async function onRequestPost(context) {
  try {
    const { image_url, order_type } = await context.request.json();
    
    // شبیه‌سازی پردازش 3D
    const model_id = 'model_' + Math.random().toString(36).substr(2, 9);
    
    return new Response(JSON.stringify({
      success: true,
      model_id: model_id,
      order_type: order_type || 'standard',
      download_url: `/api/download/${model_id}`,
      message: "مدل 3D با موفقیت تولید شد.",
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: 500 });
  }
}
