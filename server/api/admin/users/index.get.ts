import { getUsers } from '../api';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
    const query = getQuery(event);
    return await getUsers(event, query.search as string);
}); 