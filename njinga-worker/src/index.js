export default {
  async fetch(request, env) {
	const url = new URL(request.url);
	const key = url.pathname.slice(1);
	const bucket = env.njinga_store;

	// CORS headers
	const corsHeaders = {
	  "Access-Control-Allow-Origin": "*",
	  "Access-Control-Allow-Methods": "PUT, GET, DELETE, OPTIONS",
	  "Access-Control-Allow-Headers": "*",
	};

	// Preflight
	if (request.method === "OPTIONS") {
	  return new Response(null, { status: 204, headers: corsHeaders });
	}

	try {
	  switch (request.method) {
		case "PUT": {
		  await bucket.put(key, request.body, {
			httpMetadata: {
			  contentType: request.headers.get("content-type") ?? "application/octet-stream",
			},
		  });

		  return new Response(`Put ${key} successfully!`, {
			headers: corsHeaders,
		  });
		}

		case "GET": {
		  const object = await bucket.get(key);

		  if (!object) {
			return new Response("Object Not Found", {
			  status: 404,
			  headers: corsHeaders,
			});
		  }

		  const headers = new Headers(corsHeaders);
		  object.writeHttpMetadata(headers);
		  headers.set("etag", object.httpEtag);

		  return new Response(object.body, {
			status: 200,
			headers,
		  });
		}

		case "DELETE": {
		  await bucket.delete(key);

		  return new Response("Deleted!", {
			status: 200,
			headers: corsHeaders,
		  });
		}

		default:
		  return new Response("Method Not Allowed", {
			status: 405,
			headers: {
			  ...corsHeaders,
			  Allow: "PUT, GET, DELETE, OPTIONS",
			},
		  });
	  }
	} catch (err) {
	  return new Response("Internal Server Error", {
		status: 500,
		headers: corsHeaders,
	  });
	}
  },
};
