import type { User } from "@heyputer/puter.js/types/modules/auth";

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
