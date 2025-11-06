export async function onRequestGet(context) {
    const { modelId } = context.params;
    const content = `# 3D Model: ${modelId}\n# Generated successfully\n`;
    
    return new Response(content, {
        headers: {
            'Content-Type': 'text/plain',
            'Content-Disposition': `attachment; filename="model-${modelId}.obj"`
        }
    });
}
