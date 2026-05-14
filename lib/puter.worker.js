const PROJECT_PREFIX = 'roomify_project_';
const ALLOWED_ORIGINS = ['http://localhost:5173'];

const getCorsHeaders = (request) => {
    const origin = request?.headers?.get('Origin');
    const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
        headers['Vary'] = 'Origin';
    }

    return headers;
};

const isAllowedOrigin = (request) => {
    const origin = request?.headers?.get('Origin');
    return !origin || ALLOWED_ORIGINS.includes(origin);
};

const jsonResponse = (request, data, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: getCorsHeaders(request),
    })
}

const jsonError = (request, status, message, extra = {}) => {
    return jsonResponse(request, {error:message, ...extra}, status);
}

const getUserId = async (userPuter) => {
    try{
        const user = await userPuter.auth.getUser();

        return user?.uuid || null;
    }catch{
        return null;
    }
}

router.options('/api/projects/save', async ({request}) => {
    if (!isAllowedOrigin(request)) return jsonResponse(request, {error: 'Origin not allowed'}, 403);

    return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request),
    });
})

router.options('/api/projects/list', async ({request}) => {
    if (!isAllowedOrigin(request)) return jsonResponse(request, {error: 'Origin not allowed'}, 403);

    return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request),
    });
})

router.options('/api/projects/get', async ({request}) => {
    if (!isAllowedOrigin(request)) return jsonResponse(request, {error: 'Origin not allowed'}, 403);

    return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request),
    });
})

router.get('/api/projects/list', async ({request, user}) => {
    try {
        const userPuter = user?.puter;

        if(!isAllowedOrigin(request)) return jsonError(request, 403, 'Origin not allowed');
        if(!userPuter) return jsonError(request, 401, 'Authentication failed');

        const userId = await getUserId(userPuter);
        if(!userId) return jsonError(request, 401, 'Authentication failed');

        const projects = await userPuter.kv.list(`${PROJECT_PREFIX}${userId}_*`, true);

        return jsonResponse(request, {
            projects: projects.map(({value}) => value),
        });
    }catch(error) {
        return jsonError(request, 500, 'Failed to list projects', {message: error?.message || 'Unknown error'});
    }
})

router.get('/api/projects/get', async ({request, user}) => {
    try {
        const userPuter = user?.puter;

        if(!isAllowedOrigin(request)) return jsonError(request, 403, 'Origin not allowed');
        if(!userPuter) return jsonError(request, 401, 'Authentication failed');

        const userId = await getUserId(userPuter);
        if(!userId) return jsonError(request, 401, 'Authentication failed');

        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if(!id) return jsonError(request, 400, 'Project id is required');

        const project = await userPuter.kv.get(`${PROJECT_PREFIX}${userId}_${id}`);

        return jsonResponse(request, {project: project || null});
    }catch(error) {
        return jsonError(request, 500, 'Failed to get project', {message: error?.message || 'Unknown error'});
    }
})

router.post('/api/projects/save', async ({request, user}) => {
    try {
        const userPuter = user?.puter;

        if(!isAllowedOrigin(request)) return jsonError(request, 403, 'Origin not allowed');
        if(!userPuter) return jsonError(request, 401, 'Authentication failed');

        const body = await request.json();
        const project = body?.project;

        if(!project?.id || !project?.sourceImage) return jsonError(request, 400, 'Missing project id or sourceImage');

        const payload = {
            ...project,
            updatedAt: new Date().toISOString(),
        }

        const userId = await getUserId(userPuter);
        if(!userId) return jsonError(request, 401, 'Authentication failed');

         const key = `${PROJECT_PREFIX}${userId}_${project.id}`;
         await userPuter.kv.set(key, payload);

         return jsonResponse(request, {saved: true, id: project.id, project: payload});
    }catch(error) {
        return jsonError(request, 500, 'Failed to save project', {message: error?.message || 'Unknown error'});
    }
})
