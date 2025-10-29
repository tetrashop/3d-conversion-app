export default {
  async fetch(request, env) {
    return new Response(JSON.stringify({
      status: "healthy",
      service: "3D Conversion API",
      version: "1.0.0"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
