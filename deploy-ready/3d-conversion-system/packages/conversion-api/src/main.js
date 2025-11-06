export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        
        if (url.pathname === '/api/convert' && request.method === 'POST') {
            return new Response(JSON.stringify({
                success: true,
                message: 'Conversion service ready'
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        if (url.pathname === '/api/health') {
            return new Response(JSON.stringify({
                status: 'healthy',
                version: '2.0.0'
            }));
        }
        
        return new Response('Not Found', { status: 404 });
    }
};
