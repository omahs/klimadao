import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";

type Body = {
  handle: string;
  wallet: string;
  username: string;
  description: string;
  profileImgUrl: string;
};

const schema = {
  tags: ["user"],
  body: {
    type: "object",
    properties: {
      handle: { type: "string", minLength: 3 },
      username: { type: "string", minLength: 2 },
      description: { type: "string", minLength: 2, maxLength: 500 },
      wallet: { type: "string", minLength: 26, maxLength: 64 },
    },
    required: ["handle", "username", "wallet", "description"],
  },
  response: {
    "2xx": {
      type: "object",
      properties: {
        handle: { type: "string" },
        username: { type: "string" },
        wallet: { type: "string" },
      },
    },
    "403": {
      type: "object",
      properties: {
        error: { type: "string" },
        code: { type: "number" },
      },
    },
  },
};

const handler = (fastify: FastifyInstance) =>
  async function (
    request: FastifyRequest<{ Body: Body }>,
    reply: FastifyReply
  ) {
    // Destructure the wallet, username, handle, and description properties from the request body
    const { wallet, username, handle, description, profileImgUrl } =
      request.body;

    // Query the Firestore database for the user document with the specified wallet address
    const user = await fastify.firebase
      .firestore()
      .collection("users")
      .doc(wallet)
      .get();

    // If the user document exists, return a 403 error with a message
    if (user.exists) {
      return reply.code(403).send({
        code: 403,
        error: "This user is already registered!",
      });
    }

    let usersRef = fastify.firebase.firestore().collection("users");

    const userSnapshot = await usersRef
      .where("handle", "==", handle.toLowerCase())
      .limit(1)
      .get();
    // If no documents are found, return a 404 error
    if (!userSnapshot.empty) {
      return reply.code(403).send({
        code: 403,
        error: "This user is already registered!",
      });
    }

    try {
      // Try creating a new user document with the specified data
      await fastify.firebase
        .firestore()
        .collection("users")
        .doc(wallet.toUpperCase())
        .set({
          username,
          handle: handle.toLowerCase(),
          description,
          profileImgUrl,
        });
      // If the document is successfully created, return the request body
      return reply.send(request.body);
    } catch (err) {
      // If an error occurs, return the error in the response
      return reply.code(403).send({ error: err });
    }
  };

const create: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{ Body: Body }>(
    "/users",
    { onRequest: [fastify.authenticate], schema },
    handler(fastify)
  );
};

export default create;
