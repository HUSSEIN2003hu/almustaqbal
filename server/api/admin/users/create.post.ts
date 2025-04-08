import { createUser } from '../api';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
    const body = await readBody(event);
    return await createUser(event, body.username, body.courses);
}); 