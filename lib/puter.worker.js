const PROJECT_PREFIX = 'roomify_project_';

const CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

const jsonResponse = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: CORS_HEADERS,
    })
}

const jsonError = (status, message, extra = {}) => {
    return jsonResponse({error:message, ...extra}, status);
}

const getUserId = async (userPuter) => {
    try{
        const user = await userPuter.auth.getUser();

        return user?.uuid || null;
    }catch{
        return null;
    }
}

router.options('/api/projects/save', async () => {
    return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
    });
})

router.options('/api/projects/list', async () => {
    return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
    });
})

router.options('/api/projects/get', async () => {
    return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
    });
})

router.get('/api/projects/list', async ({user}) => {
    try {
        const userPuter = user?.puter;

        if(!userPuter) return jsonError(401, 'Authentication failed');

        const userId = await getUserId(userPuter);
        if(!userId) return jsonError(401, 'Authentication failed');

        const projects = await userPuter.kv.list(`${PROJECT_PREFIX}*`, true);

        return jsonResponse({
            projects: projects.map(({value}) => value),
        });
    }catch(error) {
        return jsonError(500, 'Failed to list projects', {message: error?.message || 'Unknown error'});
    }
})

router.get('/api/projects/get', async ({request, user}) => {
    try {
        const userPuter = user?.puter;

        if(!userPuter) return jsonError(401, 'Authentication failed');

        const userId = await getUserId(userPuter);
        if(!userId) return jsonError(401, 'Authentication failed');

        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if(!id) return jsonError(400, 'Project id is required');

        const project = await userPuter.kv.get(`${PROJECT_PREFIX}${id}`);

        return jsonResponse({project: project || null});
    }catch(error) {
        return jsonError(500, 'Failed to get project', {message: error?.message || 'Unknown error'});
    }
})

router.post('/api/projects/save', async ({request, user}) => {
    try {
        const userPuter = user?.puter;

        if(!userPuter) return jsonError(401, 'Authentication failed');

        const body = await request.json();
        const project = body?.project;

        if(!project?.id || !project?.sourceImage) return jsonError(400, 'Project not found');

        const payload = {
            ...project,
            updatedAt: new Date().toISOString(),
        }

        const userId = await getUserId(userPuter);
        if(!userId) return jsonError(401, 'Authentication failed');

         const key = `${PROJECT_PREFIX}${project.id}`;
         await userPuter.kv.set(key, payload);

         return jsonResponse({saved: true, id: project.id, project: payload});
    }catch(error) {
        return jsonError(500, 'Failed to save project', {message: error?.message || 'Unknown error'});
    }
})
