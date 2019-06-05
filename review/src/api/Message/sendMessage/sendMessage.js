import { prisma } from "../../../../generated/prisma-client";
import { ROOM_FRAGMENT } from "../../../fragments";

export default {
  Mutation: {
    sendMessage: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { roomId, message, toId } = args;
      const { user } = request;
      let room;
      let getTo;
      if (roomId === undefined) {
        if (user.id !== toId) {
          room = await prisma.createRoom({
            participants: {
              connect: [{ id: user.id }, { id: toId }]
            }
          });
        }
      } else {
        room = await prisma.room({ id: roomId }).$fragment(ROOM_FRAGMENT);
        getTo = room.participants.filter(
          participant => participant.id !== user.id
        )[0];
        if (!room) {
          throw Error("Room not found");
        }
      }
      return prisma.createMessage({
        text: message,
        from: {
          connect: {
            id: user.id
          }
        },
        to: {
          connect: {
            id: roomId ? getTo.id : toId
          }
        },
        room: {
          connect: {
            id: room.id
          }
        }
      });
    }
  }
};
