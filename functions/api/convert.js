export async function onRequestPost(context) {
  try {
    const { image_url, order_type = 'standard' } = await context.request.json();
    const model_id = 'model_' + Math.random().toString(36).substr(2, 9);
    
    return new Response(JSON.stringify({
      success: true,
      model_id: model_id,
      order_type: order_type,
      download_url: `/api/download/${model_id}`,
      message: "مدل 3D با موفقیت در صف تولید قرار گرفت.",
      timestamp: new Date().toISOString()
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: "خطا در پردازش درخواست"
    }), { status: 500 });
  }
}
