export async function onRequestGet() {
    return new Response(JSON.stringify({
        status: "healthy",
        message: "3D Conversion API is working!",
        timestamp: new Date().toISOString()
    }), {
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
