export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    if (path === "/api/convert/2d-to-3d" && request.method === "POST") {
      return handleConversion(request, env);
    }
    
    if (path === "/api/health" && request.method === "GET") {
      return jsonResponse({
        status: "healthy",
        service: "3D Conversion API",
        version: "1.0.0"
      });
    }
    
    return jsonResponse({ error: "Not found" }, 404);
  }
};

async function handleConversion(request, env) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    
    if (!file) {
      return jsonResponse({ error: "No file provided" }, 400);
    }
    
    const conversionId = "conv_" + Date.now();
    
    return jsonResponse({
      success: true,
      conversion_id: conversionId,
      message: "Conversion queued successfully"
    }, 202);
    
  } catch (error) {
    return jsonResponse({ error: "Conversion failed" }, 500);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
