import { updateUser } from '../api';
import { H3Event, createError } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw createError({
            statusCode: 400,
            message: "User ID is required"
        });
    }
    const body = await readBody(event);
    return await updateUser(event, id, body);
}); 