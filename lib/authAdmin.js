import { clerkClient } from '@clerk/nextjs/server'

/**
 * Returns true if the given userId has role === 'admin' in Clerk publicMetadata.
 */
const authAdmin = async (userId) => {
    try {
        const client = await clerkClient()
        const user = await client.users.getUser(userId)
        return user.publicMetadata?.role === 'admin'
    } catch (error) {
        console.error('[authAdmin] Failed to verify admin role for userId:', userId, error);
        return false
    }
}

export default authAdmin
