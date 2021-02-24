export default async function setRole(role) {
    return await global.__SERVER__.setRole(role);
}
