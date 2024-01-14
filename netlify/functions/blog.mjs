import { router } from '../../../router.js';

export default async (request, context) => {
  return router.handleRequest(request);
};

export const config = {
  path: ['/', '/foo', '/blog/*', '/thoughts/*', '/definitions']
};
