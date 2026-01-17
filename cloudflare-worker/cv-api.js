/**
 * Cloudflare Worker - Dynamic CV Download API
 *
 * Automatically finds and serves the latest CV PDF per language from R2 bucket.
 *
 * Deploy this worker and bind it to your R2 bucket named 'porkolab-cv'
 *
 * Endpoints:
 *   GET /latest/en  → Redirects to latest English CV
 *   GET /latest/hu  → Redirects to latest Hungarian CV
 *   GET /latest/de  → Redirects to latest German CV
 *   GET /manifest.json → Returns JSON with latest filenames per language
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for cross-origin requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // List all objects in the bucket
      const listed = await env.CV_BUCKET.list();
      const files = listed.objects.map(obj => obj.key);

      // Parse files and group by language
      const cvFiles = {};
      const pattern = /^cv_public_(\w+)_default_(\d{8})_(\d{6})\.pdf$/;

      for (const file of files) {
        const match = file.match(pattern);
        if (match) {
          const lang = match[1];
          const date = match[2];
          const time = match[3];
          const timestamp = date + time;

          if (!cvFiles[lang] || timestamp > cvFiles[lang].timestamp) {
            cvFiles[lang] = { filename: file, timestamp };
          }
        }
      }

      // Route: /manifest.json - Return latest filenames as JSON
      if (path === '/manifest.json') {
        const manifest = {};
        for (const [lang, data] of Object.entries(cvFiles)) {
          manifest[lang] = data.filename;
        }
        return new Response(JSON.stringify(manifest, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
            ...corsHeaders,
          },
        });
      }

      // Route: /latest/:lang - Redirect to latest CV for language
      const latestMatch = path.match(/^\/latest\/(\w+)$/);
      if (latestMatch) {
        const lang = latestMatch[1];
        const cvData = cvFiles[lang] || cvFiles['en']; // Fallback to English

        if (cvData) {
          // Get the public bucket URL and redirect
          const publicUrl = `https://pub-c677684c572248f4ae32cfb9fc6b6972.r2.dev/${cvData.filename}`;
          return Response.redirect(publicUrl, 302);
        }

        return new Response('CV not found', { status: 404, headers: corsHeaders });
      }

      // Route: / - API info
      if (path === '/' || path === '') {
        return new Response(JSON.stringify({
          api: 'CV Download API',
          endpoints: {
            '/latest/en': 'Redirect to latest English CV',
            '/latest/hu': 'Redirect to latest Hungarian CV',
            '/latest/de': 'Redirect to latest German CV',
            '/manifest.json': 'Get latest filenames per language',
          },
          available: Object.keys(cvFiles),
        }, null, 2), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      return new Response('Not found', { status: 404, headers: corsHeaders });

    } catch (error) {
      return new Response(`Error: ${error.message}`, {
        status: 500,
        headers: corsHeaders
      });
    }
  },
};
