import type { User } from "@heyputer/puter.js/types/modules/auth";
import {getOrCreateHostingConfig, uploadImageToHosting} from "./puter.hosting";
import {isHostedUrl} from "./utils";

const PROJECT_PREFIX = "roomify_project_";

const getPuter = async () => {
    if (typeof window === "undefined") {
        return null;
    }

    const {default: puter} = await import("@heyputer/puter.js");
    return puter;
};

export const signIn = async () => {
    const puter = await getPuter();
    return await puter?.auth.signIn();
};

export const signOut = async () => {
    const puter = await getPuter();
    return await puter?.auth.signOut();
};

export const getCurrentUser = async (): Promise<User | null> =>{
    try {
        const puter = await getPuter();
        if (!puter) {
            return null;
        }

        return await puter.auth.getUser();
    }catch {
        return null;
    }
}

const saveProjectToKv = async (project: DesignItem): Promise<DesignItem | null> => {
    try {
        const puter = await getPuter();
        if (!puter) {
            return null;
        }

        const payload = {
            ...project,
            updatedAt: new Date().toISOString(),
        };

        await puter.kv.set(`${PROJECT_PREFIX}${project.id}`, payload);

        return payload;
    } catch (error) {
        console.error("Failed to save project to Puter KV", error);
        return null;
    }
};

const getProjectsFromKv = async (): Promise<DesignItem[]> => {
    try {
        const puter = await getPuter();
        if (!puter) {
            return [];
        }

        const projects = await puter.kv.list<DesignItem>(`${PROJECT_PREFIX}*`, true);

        return projects.map(({value}) => value);
    } catch (error) {
        console.error("Failed to get projects from Puter KV", error);
        return [];
    }
};

const getProjectFromKv = async (id: string): Promise<DesignItem | null> => {
    try {
        const puter = await getPuter();
        if (!puter) {
            return null;
        }

        const project = await puter.kv.get<DesignItem>(`${PROJECT_PREFIX}${id}`);

        return project ?? null;
    } catch (error) {
        console.error("Failed to get project from Puter KV", error);
        return null;
    }
};

export const createProject = async ({item} : CreateProjectParams): Promise<DesignItem | null | undefined> =>{
    const projectId = item.id;

    const hosting = await getOrCreateHostingConfig();

    const hostedSource = projectId ? await uploadImageToHosting({hosting, url: item.sourceImage, projectId, label: 'source',}) : null;

    const hostedRender = projectId && item.renderedImage ? await uploadImageToHosting({hosting, url: item.renderedImage, projectId, label: 'rendered',}) : null;

    const resolvedSource = hostedSource ?.url || (isHostedUrl(item.sourceImage) ? item.sourceImage : '');

    if(!resolvedSource){
        console.warn('Failed to host source image, skipping save');
        return null;
    }

    const resolvedRender = hostedRender ?.url ? hostedRender?.url : item.renderedImage &&isHostedUrl(item.renderedImage) ? item.renderedImage : undefined;

    const {
        sourcePath : _sourcePath,
        renderedPath : _renderedPath,
        publicPath : _publicPath,
        ...rest
    } = item;

    const payload = {
        ...rest,
        sourceImage: resolvedSource,
        renderedImage: resolvedRender,
    }

    return saveProjectToKv(payload);
}

export const getProjects = async () =>{
    return getProjectsFromKv();
}

export const getProjectById = async ({ id }: { id: string }) => {
    return getProjectFromKv(id);
};
