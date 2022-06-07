import cookier from "cookie";
import {
  getSecurityToken,
  validateToken,
  decodeUserId,
} from "../../auth/auth.js";
const _getCookies = (socket) => socket.handshake.headers.cookie;

const _getDbUserIdOfSocket = (socket) => {
  try {
    const cookieString = _getCookies(socket);

    console.log(`[_getDbUserIdOfSocket] cookieString ${cookieString}`);
    const cookie = cookier.parse(cookieString);
    console.log(`[_getDbUserIdOfSocket] cookie ${JSON.stringify(cookie)}`);
    const concealedUser = cookie["s-token"];
    const userId = decodeUserId(concealedUser);
    return userId;
  } catch (err) {
    console.log("[_getDbUserIdOfSocket] Consumed Error" + err);
    return null;
  }
};

const bindSocketProj3Events = (socket, io) => {
  socket.on("verify-token", async (securityToken, resCb) => {
    console.log(`[verify-token] Verifying ${JSON.stringify(securityToken)}`);

    const { securityToken: validToken, msg } = await validateToken(
      securityToken
    );
    const userId = _getDbUserIdOfSocket(socket);
    if (validToken) {
      await updateSession(socket.id, userId);
    } else {
      await removeSession(socket.id);
    }
    resCb({
      securityToken: validToken,
      msg,
    });
  });
  socket.on("which-room", async (cb) => {
    console.log("[which-room]");
    const userId = _getDbUserIdOfSocket(socket);

    console.log(`[which-room] user of socket is ${userId}`);
    const rId = await whichRoomIdIsUserIn(userId);

    if (!rId) {
      return cb(null, null, null);
    }
    const { id: roomId, creatorName, name: roomName } = await getRoomData(rId);
    console.log(`[which-room] user of socket ${userId} is in room ${roomId}`);
    console.log(`[which-room] creatorName ${creatorName}`);

    cb(roomId, creatorName, roomName);
  });

  socket.on("create-join-room", async (roomName, cb) => {
    try {
      const userId = _getDbUserIdOfSocket(socket);

      console.log(
        `[create-join-room] ${userId} requesting to create and join room name ${roomName}`
      );
      const hostingRoomId = await createAndJoinRoom(userId, roomName);

      console.log(
        `[create-join-room] ${userId} completed create and join room id ${hostingRoomId}`
      );

      cb({
        roomId: hostingRoomId,
        msg: "ok",
      });
      io.emit("room-created", hostingRoomId);
      const userSockets = await getSocketsOfUser(userId);
      console.log(`[create-join-room] userSockets`);
      console.log(`${userSockets}`);
      userSockets.forEach(({ id }) => {
        io.to(id).emit("changed-room");
        io.to(id).emit("line-up");
      });
    } catch (err) {
      console.log(`[create-join-room] ${err}`);
      cb({
        roomId: null,
        // msg: `[Server Error io create-join-room] ${err}`,
        msg: ` ${err}`,
      });
    }
  });

  socket.on("join-room", async (roomId, cb) => {
    try {
      const userId = _getDbUserIdOfSocket(socket);

      console.log(`[join-room] ${userId} requesting join room id ${roomId}`);
      const hostingRoomId = await joinRoom(userId, roomId);

      console.log(`[join-room] ${userId} join room id ${hostingRoomId}`);

      cb({
        roomId: hostingRoomId,
        msg: "ok",
      });

      const [roomId2, userIds] = await checkLineUpByUserId(userId, false);
      if (roomId2 !== hostingRoomId) {
        throw new Error(
          `[join-room broadcast to room] room ids mismatch ${roomId} ${hostingRoomId}`
        );
      }
      const userSockets = await getSocketsOfUsers(userIds);
      console.log(`[join-room] userSockets`);
      console.log(`${userSockets}`);
      userSockets.forEach(({ id }) => {
        io.to(id).emit("changed-room");
        io.to(id).emit("line-up");
      });
    } catch (err) {
      console.log(`[join-room] ${err}`);
      cb({
        roomId: null,
        msg: `[Server Error io join-room] ${err}`,
      });
    }
  });

  socket.on("line-up", async (cb) => {
    console.log(`[Server io on line-up]`);
    const userId = _getDbUserIdOfSocket(socket);
    const retrieved = await getLineUp(userId);
    cb(retrieved);
  });

  socket.on("my-team-is", async (cb) => {
    const userId = _getDbUserIdOfSocket(socket);
    const teamNo = await getMyTeam(userId);
    cb(teamNo);
  });

  socket.on("leave-room", async () => {
    const userId = _getDbUserIdOfSocket(socket);
    const [removedRoomId, lineupIds, isRoomRemoved] = await leaveRoom(userId);
    console.log(`[Server on leave-room]`);
    console.table([removedRoomId, lineupIds, isRoomRemoved]);

    isRoomRemoved
      ? io.emit("room-deleted", removedRoomId)
      : socket.emit("changed-room");

    const roomId = await whichRoomIdIsUserIn(userId);
    roomId === null;
    const userSockets = await getSocketsOfUsers(lineupIds);
    console.log(`[Server on leave-room] ${JSON.stringify(userSockets)}`);

    userSockets.forEach(({ id }) => {
      io.to(id).emit("changed-room");
      io.to(id).emit("line-up");
    });
  });

  socket.on("change-team", async () => {
    console.log(`[Server on change team]`);
    const userId = _getDbUserIdOfSocket(socket);

    const pids = await changeTeam(userId);

    console.log(`[Server on change team] pids`);
    console.log(pids);
    const userSockets = await getSocketsOfUsers(pids);

    console.log(`[Server on change-team] ${JSON.stringify(userSockets)}`);

    userSockets.forEach(({ id }) => {
      io.to(id).emit("line-up");
    });
  });

  socket.on("all-active-rooms", async (fn) => {
    const rooms = await getAllRoomsNotInActivePlay();
    console.log(`[all-active-rooms] result v `);
    console.log(rooms);
    fn(rooms);
  });

  socket.on("room-data", async (id, fn) => {
    console.log(`[Socket on room data ] Client request data for ${id}`);
    const data = await getRoomData(id);

    console.log(`[Socket on room data ] ${id} := ${JSON.stringify(data)}`);
    fn(data);
  });

  socket.on("am-i-creator", async (clientRoomId, cb) => {
    const userId = _getDbUserIdOfSocket(socket);

    const [is, roomId] = await isUserSomeCreator(userId);
    if (is && roomId !== clientRoomId) {
      throw new Error(
        `am - i - creator Sanity check failed ${roomId} ${clientRoomId}`
      );
    }

    cb(is);
  });
  // START OF GAME

  socket.on("start-game", async () => {
    const userId = _getDbUserIdOfSocket(socket);

    // START OF GAME
    const sockets = await getSocketsOfRoomByParticipatingUserId(userId);
    sockets.forEach(({ id }) => {
      io.to(id).emit("game-started");
    });

    const roomId = await whichRoomIdIsUserIn(userId);
    await initGameplay(userId);

    io.emit("room-started", roomId);

    await (async () => {
      let count = 5;

      const interval = setInterval(async () => {
        const sockets = await getSocketsOfRoomByParticipatingUserId(userId);
        sockets.forEach(({ id }) => {
          io.to(id).emit("game-started-count-down", count);
        });

        count -= 1;
        console.log(`[on start-game] ${count}`);
        if (count === 0) {
          clearInterval(interval);

          getSocketsOfRoomByParticipatingUserId(userId).then((sockets) => {
            sockets.forEach(({ id }) => {
              io.to(id).emit("game-new-chain-notify");
            });
          });
        }
      }, 1000);
    })();
  });

  const lockGameAndBroadcast_ThisIsEndOfRound = async (userId) => {
    whichRoomIdIsUserIn(userId).then((rId) => {
      io.emit("room-not-started", rId);
    });
    const isGA = await isGameActive(userId);
    if (!isGA) {
      return; // sanity check that if already NOT GA so we down broadcast twice.
    }
    await lockGameOfUser(userId);

    const settledIds = await settleGame(userId);
    getSocketsOfRoomByParticipatingUserId(userId).then((sockets) => {
      sockets.forEach(({ id }) => {
        io.to(id).emit("game-ended");
      });
    });

    getSocketsOfUsers(settledIds).then((sockets) => {
      sockets.forEach(({ id }) => {
        io.to(id).emit("notify-new-bananas-excited");
      });
    });
  };

  socket.on("submit-chain", async (chainString) => {
    console.log(`[Server on submit-chain] ?= ${chainString}`);
    const userId = _getDbUserIdOfSocket(socket);
    const res = await submitChain(chainString, userId);

    if (res.overtime) {
      await lockGameAndBroadcast_ThisIsEndOfRound(userId);
    }
    if (res.success) {
      console.log(
        `[Server on submit-chain] submission is a hit. scorer: ${res.scorerId}`
      );

      const scorerName = await getUsernameById(res.scorerId);
      const sockets = await getSocketsOfRoomByParticipatingUserId(userId);
      sockets.forEach(({ id }) => {
        io.to(id).emit("chain-hit-by", scorerName);
      });

      const isGA = await isGameActive(userId);

      console.log(`[Server on submit-chain] isGA := ${isGA}`);

      isGA && (await changeChainOfGameOfUser(userId));
      isGA &&
        sockets.forEach(({ id }) => {
          io.to(id).emit("game-new-chain-notify");
        });
    }
  });

  socket.on("what-chain", async (fn) => {
    const userId = _getDbUserIdOfSocket(socket);
    const chain = await getChainOfGameplayForUser(userId);
    console.log(`[Server on what-chain] := user ${userId}'s game has ${chain}`);
    fn(chain);
  });
  socket.on("is-game-started", async (fn) => {
    const userId = _getDbUserIdOfSocket(socket);
    const is = await isGameStarted(userId);
    console.log(
      `[Server on is-game-started] := ${userId}'s game has ${
        is ? "started" : "NOT started"
      }`
    );
    fn(is);
  });

  socket.on("how-long-more", async (fn) => {
    const userId = _getDbUserIdOfSocket(socket);
    const ms = await howLongMoreMs(userId);
    // HACK
    if (ms < -5000) {
      await lockGameAndBroadcast_ThisIsEndOfRound(userId);
    }
    fn(ms);
  });

  socket.on("can-i-have-tally", async (chnSend) => {
    const userId = _getDbUserIdOfSocket(socket);
    const tally = await getTallyOfMostRecentRoundOfUser(userId);
    chnSend(tally);
  });

  socket.on("my-name-please", (chnSend) => {
    const userId = _getDbUserIdOfSocket(socket);
    getUsernameById(userId).then(chnSend);
  });

  socket.on("my-banana-count-please", (chnSend) => {
    const userId = _getDbUserIdOfSocket(socket);
    getCreditOf(userId).then(chnSend);
  });

  socket.on("request-register", async (creds, chanSend) => {
    const [createdUser, msg] = await registerUser(creds);
    chanSend([createdUser, msg]);
  });
}; //// End of socket binding

export default bindSocketProj3Events;
