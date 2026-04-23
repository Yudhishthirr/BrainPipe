import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";


// Protect Route
export const requireAuth = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    return session;
};

// Unprotect Route
export const requireUnauth = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        redirect("/");
    }
};
