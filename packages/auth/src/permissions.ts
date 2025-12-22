// packages/auth/src/permissions.ts

import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
    products: ["create", "read", "update", "delete"],
    orders: ["create", "read", "update", "delete", "manage_status"],
    categories: ["create", "read", "update", "delete"],
    settings: ["read", "update"],
    integrations: ["read", "update", "toggle"],
    users: ["read", "update", "ban", "delete"],
    blog: ["create", "read", "update", "delete", "publish"],
} as const;

export const ac = createAccessControl(statement);

export const superadmin = ac.newRole({
    products: ["create", "read", "update", "delete"],
    orders: ["create", "read", "update", "delete", "manage_status"],
    categories: ["create", "read", "update", "delete"],
    settings: ["read", "update"],
    integrations: ["read", "update", "toggle"],
    users: ["read", "update", "ban", "delete"],
    blog: ["create", "read", "update", "delete", "publish"],
});

export const admin = ac.newRole({
    products: ["create", "read","update", "delete"],
    orders: ["read", "update", "manage_status"],
    categories: ["create", "read", "update", "delete"],
    settings: ["read", "update"],
    users: ["read", "ban"],
    blog: ["create", "read", "update", "publish"],
    integrations: ["read", "toggle"],
});

export const editor = ac.newRole({
    blog: ["create", "read", "update"],
    products: ["read"],
});

export const user = ac.newRole({
    products: ["read"],
    blog: ["read"],
    orders: ["create", "read"],
});

export const roles = { superadmin, admin, editor, user };

export type role = keyof typeof roles;
export type entity = keyof typeof statement;
export type action<E extends entity = entity> = (typeof statement)[E][number];

export function can(r: role, ent: entity, act: action) {
    const roleObj = roles[r];
    
    if (!roleObj) return false;    

    const statements = roleObj.statements as unknown as Record<string, string[] | undefined>;
    
    return !!statements[ent]?.includes(act as string);
}

