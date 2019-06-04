import { prisma } from "../../../../generated/prisma-client";
import { generateToken } from "../../../utils";

export default {
  Mutation: {
    confirmSecret: async (_, args) => {
      const { email, secret } = args;
      const user = await prisma.user({ email });
      if (user.loginSecret === secret) {
        // JWT 발행
        return generateToken(user.id);
      } else {
        throw Error("wrong email/secret combination");
      }
    }
  }
};