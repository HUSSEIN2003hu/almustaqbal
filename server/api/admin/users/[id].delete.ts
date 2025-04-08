import { deleteUser } from '../api';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw createError({
            statusCode: 400,
            message: "User ID is required"
        });
    }
    return await deleteUser(event, id);
}); 