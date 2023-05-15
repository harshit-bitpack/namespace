/* eslint-disable turbo/no-undeclared-env-vars */
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]),
    BICONOMY_API_KEY: z.string(),
    ALCHEMY_API_KEY_URL_ETHEREUM: z.string(),
    ALCHEMY_API_KEY_URL_POLYGON: z.string(),
    ALCHEMY_API_KEY_URL_ZKEVM: z.string(),
    BICONOMY_API_ID_SAFE_MINT: z.string(),
    BICONOMY_API_ID_UPDATE_URI: z.string()
});

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
    NEXT_PUBLIC_APP_CONTRACT_ADDRESS: z.string(),
    NEXT_PUBLIC_DEV_CONTRACT_ADDRESS: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
// console.log("process.env.BICONOMY_API_KEY :", process.env.BICONOMY_API_KEY);
// console.log("process.env.ALCHEMY_API_KEY : ", process.env.ALCHEMY_API_KEY_URL);
const processEnv = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_CONTRACT_ADDRESS:
        process.env.NEXT_PUBLIC_APP_CONTRACT_ADDRESS,
    NEXT_PUBLIC_DEV_CONTRACT_ADDRESS:
        process.env.NEXT_PUBLIC_DEV_CONTRACT_ADDRESS,
    BICONOMY_API_KEY: process.env.BICONOMY_API_KEY,
    ALCHEMY_API_KEY_URL_ETHEREUM: process.env.ALCHEMY_API_KEY_URL_ETHEREUM,
    ALCHEMY_API_KEY_URL_POLYGON: process.env.ALCHEMY_API_KEY_URL_POLYGON,
    ALCHEMY_API_KEY_URL_ZKEVM: process.env.ALCHEMY_API_KEY_URL_ZKEVM,
    BICONOMY_API_ID_SAFE_MINT: process.env.BICONOMY_API_ID_SAFE_MINT,
    BICONOMY_API_ID_UPDATE_URI: process.env.BICONOMY_API_ID_UPDATE_URI
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

if (!!process.env.SKIP_ENV_VALIDATION == false) {
    const isServer = typeof window === "undefined";

    const parsed = /** @type {MergedSafeParseReturn} */ (
        isServer
            ? merged.safeParse(processEnv) // on server we can validate all env vars
            : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
    );

    if (parsed.success === false) {
        console.error(
            "❌ Invalid environment variables:",
            parsed.error.flatten().fieldErrors
        );
        throw new Error("Invalid environment variables");
    }

    env = new Proxy(parsed.data, {
        get(target, prop) {
            if (typeof prop !== "string") return undefined;
            // Throw a descriptive error if a server-side env var is accessed on the client
            // Otherwise it would just be returning `undefined` and be annoying to debug
            if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
                throw new Error(
                    process.env.NODE_ENV === "production"
                        ? "❌ Attempted to access a server-side environment variable on the client"
                        : `❌ Attempted to access server-side environment variable '${prop}' on the client`
                );
            return target[/** @type {keyof typeof target} */ (prop)];
        },
    });
}

export { env };
