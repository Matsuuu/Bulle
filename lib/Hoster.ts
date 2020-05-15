import Endpoint from "./Endpoint";

export default class Hoster {
  hostEndpoints(
    endpoints: Array<Endpoint>,
    fastify: any,
    endpointHitCallback: Function
  ): void {
    endpoints.forEach((ep) => {
      switch (ep.method) {
        case "GET":
          fastify.get(`/${ep.path}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
        case "POST":
          fastify.post(`/${ep.path}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
        case "PUT":
          fastify.put(`/${ep.path}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
        case "DELETE":
          fastify.delete(`/${ep.path}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
        case "PATCH":
          fastify.patch(`/${ep.path}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
        case "HEAD":
          fastify.head(`/${ep.path}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
        case "CONNECT":
          fastify.connect(`/${ep.path}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
        case "OPTIONS":
          fastify.options(`/${ep.path}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
        case "TRACE":
          fastify.trace(`/${ep.path}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
        default:
          fastify.get(`/${ep.path}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
      }
    });
  }
}
