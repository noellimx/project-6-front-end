import sequelize from "../index.js";
import { UserDoor } from "../../auth/crypt.js";

import { getSocketsOfUsers } from "../api/session.js";

import {
  getRandomChain,
  chainToString,
  stringToChain,
  valueOfChainString,
} from "../../app/chain.js";
import { isUserExistingByUsername, createUser } from "../api/user.js";

const { Op } = sequelize.Sequelize;
const {
  room: Room,
  participant: Participant,
  user: User,
  gameplay: Gameplay,
  scoring: Scoring,
} = sequelize.models;
const DEFAULT_TEAM_NO = 1;
const createRoom = async ({ name, creatorId }) => {
  console.log(`[createRoom] room name: ${name} creator: ${creatorId}`);
  if (name === "") {
    throw new Error("Room name must have > 1 character.");
  }
  return Room.create({
    name,
    creatorId,
  });
};

/**
 *
 * @returns {Promise<Boolean>}
 */
const moveParticipantIntoRoom = async ({ participantId, teamNo, roomId }) => {
  return Participant.upsert({ participantId, teamNo, roomId });
};

const whichRoomIdIsUserIn = async (participantId) => {
  const p = await Participant.findOne({
    where: { participantId },
    attributes: ["roomId"],
  });
  return p ? p.getDataValue("roomId") : null;
};

const whoIsCreatorOfRoom = async (roomId) => {
  if (!roomId) {
    return null;
  }

  const r = await Room.findOne({
    where: {
      id: roomId,
    },
  });

  const uId = r ? r.getDataValue("creatorId") : null;

  const uN = await getUsernameById(uId);
  return uN;
};

const getUsernameById = async (id) => {
  const u = await User.findOne({ where: { id } });
  if (!u) {
    return null;
  }
  const name = u.getDataValue("username");

  return name;
};
const participantsOfRoom = async (roomId, conceal = true) => {
  return await Participant.findAll({ where: { roomId } }).then(
    async (rooms) => {
      const result = Promise.all(
        rooms.map(async ({ dataValues }) => {
          const { participantId, roomId } = dataValues;

          const participantName = await getUsernameById(participantId);

          return {
            participantId: conceal
              ? UserDoor.conceal(`${participantId}`)
              : participantId,
            roomId,
            participantName,
          };
        })
      );

      return result;
    }
  );
};

const participantIdsOfRoom = async (roomId, conceal = true) => {
  const ps = await participantsOfRoom(roomId, conceal);
  const pids = ps.map(({ participantId }) => participantId);
  return pids;
};
const removeParticipantsOfRoom = async (roomId) => {
  console.log(`[removeParticipantsOfRoom]`);

  const pids = await participantIdsOfRoom(roomId, false);

  await Participant.destroy({
    where: {
      participantId: pids,
    },
  });

  return pids;
};

const joinRoom = async (userId, roomId) => {
  // userId should be plain since caller is server.
  console.log(`[Server joinRoom] attempting... roomid ${roomId}`);
  try {
    const participantId = userId;
    await moveParticipantIntoRoom({
      participantId,
      teamNo: DEFAULT_TEAM_NO,
      roomId,
    });

    const participantIsInRoom = await whichRoomIdIsUserIn(participantId);

    console.log(`[joinRoom] := in room ${participantIsInRoom}`);
    return participantIsInRoom;
  } catch (err) {
    throw err;
  }
};

const createAndJoinRoom = async (userId, roomName) => {
  // userId should be plain since caller is server.
  console.log(`[Server createAndJoinRoom ] attempting... creator ${userId}`);
  try {
    const room = await createRoom({ creatorId: userId, name: roomName });

    const roomId = room.getDataValue("id");
    const participantId = userId;
    await moveParticipantIntoRoom({
      participantId,
      teamNo: DEFAULT_TEAM_NO,
      roomId,
    });

    const participantIsInRoom = await whichRoomIdIsUserIn(participantId);

    console.log(`[createAndJoinRoom] := in room ${participantIsInRoom}`);
    return participantIsInRoom;
  } catch (err) {
    throw err;
  }
};

const getLineUp = async (id, conceal = true) => {
  console.log(`[getLineUp] ${id}`);
  const roomId = await whichRoomIdIsUserIn(id);
  if (!roomId) {
    return [];
  }
  const lineup = await Participant.findAll({
    where: { roomId },
    attributes: ["participantId", "teamNo"],
    include: User,
  });

  const result = lineup.map((p) => {
    const _pid = p.getDataValue("participantId");
    const participantId = conceal ? UserDoor.conceal(_pid) : _pid;
    const teamNo = p.getDataValue("teamNo");

    const participantName = p.getDataValue("user").username;

    return {
      participantId,
      teamNo,
      participantName,
    };
  });
  return [roomId, result];
};

const getMyTeam = async (id) => {
  const participant = await Participant.findOne({
    where: { participantId: id },
  });
  return participant ? participant.getDataValue("teamNo") : null;
};

// leaves room and if user is creator, delete room

const leaveRoom = async (userId) => {
  console.log(`[leaveRoom]`);
  const participant = await Participant.findOne({
    where: { participantId: userId },
  });

  if (!participant) {
    return [null, [], null];
  }
  const fromRoomId = participant.getDataValue("roomId");
  const participantId = participant.getDataValue("participantId");

  const roomDetails = await Room.findOne({ where: { id: fromRoomId } });

  const creatorId = roomDetails.getDataValue("creatorId");
  // op
  console.log(`[leaveRoom] ${participantId}`);

  if (participantId === creatorId) {
    const pids = await removeParticipantsOfRoom(fromRoomId);

    await Room.destroy({ where: { id: fromRoomId } });

    return [fromRoomId, pids, true];
  } else {
    const pids = await participantIdsOfRoom(fromRoomId, false);

    await Participant.destroy({ where: { participantId } });
    return [fromRoomId, pids, false];
  }
};

const checkLineUpByUserId = async (userId, conceal = true) => {
  console.log(`[checkLineUpByUserId]`);
  const participant = await Participant.findOne({
    where: { participantId: userId },
  });

  if (!participant) {
    return [null, []];
  }
  const fromRoomId = participant.getDataValue("roomId");

  const pids = await participantIdsOfRoom(fromRoomId, conceal);

  return [fromRoomId, pids];
};

const getRoomData = async (roomId) => {
  const { dataValues } = await Room.findOne({ where: { id: roomId } });
  const { id, creatorId, name } = dataValues;
  const username = await getUsernameById(creatorId);
  return {
    id,
    creatorId: UserDoor.conceal(`${creatorId}`),
    name,
    creatorName: username,
  };
};
const getAllRooms = async () => {
  return await Room.findAll().then(async (rooms) => {
    const result = Promise.all(
      rooms.map(async ({ dataValues }) => {
        const { id, creatorId, name } = dataValues;

        const username = await getUsernameById(creatorId);

        return {
          id,
          creatorId: UserDoor.conceal(`${creatorId}`),
          name,
          creatorName: username,
        };
      })
    );

    return result;
  });
};

const getAllRoomsNotInActivePlay = async () => {
  const gpinplayRaw = await Gameplay.findAll({
    where: { isActive: true },
    include: Room,
  }); // set of in game gameplays. take the complement rooms of this set

  const roomIdsThatAreInGameRaw = gpinplayRaw.map((gp) => {
    return gp.getDataValue("roomId");
  });
  const gpNotInPlayxx = await Gameplay.findAll({ include: Room });
  const gpNotInPlayxxx = await Gameplay.findAll();
  const gpNotInPlayxxxx = await Gameplay.findAll({
    where: { isActive: false },
  });

  console.log(`getAllRoomsNotInActivePlay`);
  console.log(gpinplayRaw);

  return await Room.findAll({
    where: { id: { [Op.notIn]: roomIdsThatAreInGameRaw } },
  }).then(async (rooms) => {
    const result = Promise.all(
      rooms.map(async ({ dataValues }) => {
        const { id, creatorId, name } = dataValues;

        const username = await getUsernameById(creatorId);

        return {
          id,
          creatorId: UserDoor.conceal(`${creatorId}`),
          name,
          creatorName: username,
        };
      })
    );

    return result;
  });
};

const changeTeam = async (participantId) => {
  console.log(`[changeTeam]`);
  await Participant.findOne({ where: { participantId } }).then((p) => {
    console.log(`[changeTeam] found participant`);
    console.log(p);

    const teamNo = Number(p.getDataValue("teamNo")) === 1 ? 2 : 1;
    p.update({ teamNo });
  });

  const roomId = await whichRoomIdIsUserIn(participantId);
  if (!roomId) {
    return [];
  }
  const pids = await participantIdsOfRoom(roomId, false);
  return pids;
};

// this works for now since user is creator of at most 1 room at any one time for now
const isUserSomeCreator = async (userId) => {
  const some = await Room.findOne({ where: { creatorId: userId } });

  return [!!some, some?.getDataValue("id")]; // predicate and room id
};

const isGameStarted = async (userId) => {
  const roomId = await whichRoomIdIsUserIn(userId);
  const game = await Gameplay.findOne({ where: { roomId } });
  return game && game.getDataValue("isActive");
};
const isGameActive = isGameStarted;
const getSocketsOfRoomByParticipatingUserId = async (userId) => {
  const roomId = await whichRoomIdIsUserIn(userId);
  const lineupIds = await participantIdsOfRoom(roomId, false);
  const userSockets = await getSocketsOfUsers(lineupIds);

  return userSockets;
};

const OFFSET_SEC = 70;
const OFFSET_MIN = 7;
const getDateMinutesFromNow = (mins) => {
  const d = new Date();
  // d.setMinutes(d.getMinutes() + OFFSET_MIN);
  d.setSeconds(d.getSeconds() + OFFSET_SEC);
  return d;
};

const gameplayEndsIn = async (userId) => {
  try {
    const roomId = await whichRoomIdIsUserIn(userId);
    const game = await Gameplay.findOne({ where: { roomId } });

    const d = game.getDataValue("endDate");
    console.log(`[gameplayEndsIn] := ${d}`);

    return d;
  } catch (err) {
    return null;
  }
};

const howLongMoreMs = async (userId) => {
  const dead = await gameplayEndsIn(userId);
  if (!dead) {
    return null;
  }
  const now = new Date();
  return dead - now;
};

const isOvertime = async (userId) => {
  return (await howLongMoreMs(userId)) < 0;
};

const changeChainOfGameOfUser = async (userId) => {
  try {
    console.log(`[changeChainOfGameOfUser] ?= ${userId}`);
    await getGameOfUser(userId).then(async (game) => {
      console.log(`[changeChainOfGameOfUser] game`);
      console.log(game);

      if (game) {
        const chain = chainToString(getRandomChain());
        //HACK
        const roomId = game.getDataValue("roomId");
        await Gameplay.update({ chain }, { where: { roomId } });

        console.log(`[changeChainOfGameOfUser] Update chain executed.`);
      }
    });
  } catch (err) {
    const msg = `[changeChainOfGameOfUser]  Error ${err} `;
    throw new Error(msg);
  }

  console.log(`[changeChainOfGameOfUser] End`);
};

const initGameplay = async (userId) => {
  try {
    const roomId = await whichRoomIdIsUserIn(userId);
    const later = getDateMinutesFromNow(1);
    const chain = chainToString(getRandomChain());

    const game = await getGameOfUser(userId);

    if (game) {
      await game.update({
        chain,
        endDate: later,
        lastKnownRound: crypto.randomUUID(),
        isActive: true,
      });
    } else {
      await Gameplay.create({
        roomId,
        chain,
        endDate: later,
        lastKnownRound: crypto.randomUUID(),
        isActive: true,
      });
    }

    const checkLater = await gameplayEndsIn(userId);
    console.log(
      `[initGameplay] checkinglater ${checkLater} later ${later.toString()} ${
        checkLater.toString() === later.toString()
      }`
    );
    console.log(`[initGameplay checking cd] ${await howLongMoreMs(userId)}`);
  } catch (err) {
    throw err;
  }
};

const lockGameOfUser = async (userId) => {
  const roomId = await whichRoomIdIsUserIn(userId);

  console.log(`[lockGameOfUser] locking gameplay of room ${roomId}`);
  await Gameplay.update(
    { isActive: false },
    {
      where: {
        roomId,
      },
    }
  );
};

const aggrScoresPerUser = (scorings) => {
  return scorings.reduce((acc, { scorerId, credit }) => {
    if (!acc[scorerId]) {
      acc[scorerId] = 0;
    }
    return {
      ...acc,
      [scorerId]: acc[scorerId] + credit,
    };
  }, {});
};

// HACK why not use db??
const aggrScoresPerTeam = (scorings) => {
  const agg = scorings.reduce((acc, { teamNo, scorerId, credit }) => {
    if (!acc[teamNo]) {
      acc[teamNo] = 0;
    }
    return {
      ...acc,
      [teamNo]: acc[teamNo] + credit,
    };
  }, {});
  return agg;
};

const bumpBanana = async (userId, credit) => {
  if (credit <= 0) {
    return;
  }
  await User.increment("credit", { by: credit, where: { id: userId } });
};
// returns userIds of settled
const settleGame = async (userId) => {
  const {
    individuals: scorings,
    winningTeams,
    winningIndividuals,
  } = await getTallyOfMostRecentRoundOfUser(userId, false);

  console.log(`[settleGame] := v`);
  console.log(scorings);
  const pot = aggrScoresPerUser(scorings);

  console.log(pot);

  console.log(scorings);
  console.log(Object.entries(pot));
  const updatedIds = await Object.entries(pot).reduce(
    async (ids, [scorerId, credit]) => {
      ids = await ids;
      try {
        await bumpBanana(scorerId, credit);
        return [...ids, scorerId];
      } catch (err) {
        console.log(`[settleGame] Error`);
        console.log(err);
        return [...ids];
      }
    },
    []
  );

  // hack
  const BONUS = 50;

  console.log(`w in`);

  console.log(winningIndividuals);
  for await (const wuID of winningIndividuals) {
    await bumpBanana(wuID, BONUS);
  }
  console.log(`[setteGame] := ids ${JSON.stringify(updatedIds)}`);
  return updatedIds;
};

const getChainOfGameplayForUser = async (userId) => {
  try {
    const roomId = await whichRoomIdIsUserIn(userId);
    const game = await Gameplay.findOne({ where: { roomId } });

    const isActive = game.getDataValue("isActive");
    if (!game || !isActive) {
      return null;
    }
    const chainString = game.getDataValue("chain");

    console.log(`[getChainOfGameplayForUser] ${chainString}`);
    return stringToChain(chainString);
  } catch (err) {
    return null;
  }
};

const getGameOfUser = async (userId) => {
  const roomId = await whichRoomIdIsUserIn(userId);
  const game = await Gameplay.findOne({ where: { roomId } });

  return game;
};

const whichRoundIsUserIn = async (userId) => {
  const game = await getGameOfUser(userId);
  const round = game.getDataValue("lastKnownRound");
  return round;
};

const submitChain = async (chain, userId) => {
  console.log(`[submitChain] Processing ?= ${chain} submitted by  ${userId}`);

  const result = {};
  const game = await getGameOfUser(userId);
  if (!game) {
    result.success = false;
    return result;
  }
  const targetChain = game.getDataValue("chain");
  const isActive = game.getDataValue("isActive");
  if (!(isActive === false || isActive === true)) {
    const msg = `I thought is active ${isActive} should be of boolean type??`;
    throw new Error(msg);
  }

  if (!isActive) {
    console.log(`[submitChain] Game not active.`);

    result.success = false;
    return result;
  }

  console.log(`[submitChain] tg |${targetChain}| === |${chain}| ?`);
  if (chain === targetChain) {
    result.success = true;
    result.scorerId = userId;
    console.log(`[submitChain] HIT`);

    const round = game.getDataValue("lastKnownRound");
    const participant = await Participant.findOne({
      where: {
        participantId: userId,
      },
    });

    const teamNo = participant.getDataValue("teamNo");

    const credit = valueOfChainString(chain);

    Scoring.create({
      roundId: round,
      teamNo,
      chain,
      credit,
      scorerId: userId,
    });
  } else {
    result.success = false;
  }
  const isOT = await isOvertime(userId);

  if (isOT && result.success) {
    result.overtime = true;
  }
  return result;
};

const getTallyOfMostRecentRoundOfUser = async (userId, conceal = true) => {
  console.log(`[getTallyOfMostRecentRoundOfUser] ?= ${userId}`);
  // get the round and user by game
  const game = await getGameOfUser(userId);
  const roundId = game.getDataValue("lastKnownRound");
  const roomId = game.getDataValue("roomId");

  // get the active participants
  const pids = await participantIdsOfRoom(roomId, false);

  console.log(`[getTallyOfMostRecentRoundOfUser] Getting scores`);

  // get scores of active participants
  const scoringsRaw = await Scoring.findAll({
    where: {
      roundId,
      scorerId: pids,
    },
    include: User,
  });

  const scorings = scoringsRaw.map((scoring) => {
    const teamNo = scoring.getDataValue("teamNo");
    const chain = scoring.getDataValue("chain");
    const credit = scoring.getDataValue("credit");
    const user = scoring.getDataValue("user");
    const scorerId = scoring.getDataValue("scorerId");

    const scorerName = user.getDataValue("username");

    return {
      teamNo,
      chain,
      credit,
      scorerName,
      scorerId: conceal ? UserDoor.conceal(scorerId) : scorerId,
    };
  });

  const teams = aggrScoresPerTeam(scorings);

  const teamsArr = Object.entries(teams);

  const winningTeams = teamsArr
    .reduce((acc, team) => {
      const thisAmd = team[1];
      if (acc.length === 0) {
        return thisAmd > 0 ? [team] : [];
      }
      const currentMax = acc[0][1];
      if (currentMax === thisAmd) {
        return [...acc, team];
      } else if (currentMax < thisAmd) {
        return [team];
      }
      return [...acc];
    }, [])
    .map(([teamNo]) => Number(teamNo));

  const winningIndividuals = [
    ...new Set(
      scorings
        .filter(({ teamNo }) => {
          return winningTeams.includes(teamNo);
        })
        .map(({ scorerId }) => scorerId)
    ),
  ];

  return {
    individuals: scorings,
    winningTeams,
    winningIndividuals,
  };
};

const getCreditOf = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });

  return user?.getDataValue("credit");
};

const registerUser = async ({ username, password, password2 }) => {
  const is = await isUserExistingByUsername(username);
  if (is) {
    return [null, "Username taken :("];
  }
  if (password !== password2) {
    return [null, "Confirmation password mismatch."];
  }
  if (!username) {
    return [null, "Username must have at least 1 character"];
  }
  if (!password || !password2) {
    return [null, "Password must have at least 1 character"];
  }

  const user = await createUser(username, password);

  const usernameRetrieved = user.getDataValue("username");
  return [usernameRetrieved, `Registration Success: ${usernameRetrieved} `];
};
export {
  createAndJoinRoom,
  whichRoomIdIsUserIn,
  getLineUp,
  leaveRoom,
  getAllRooms,
  getRoomData,
  joinRoom,
  checkLineUpByUserId,
  changeTeam,
  participantsOfRoom,
  isUserSomeCreator,
  getSocketsOfRoomByParticipatingUserId,
  initGameplay,
  getChainOfGameplayForUser,
  isGameStarted,
  howLongMoreMs,
  submitChain,
  lockGameOfUser,
  changeChainOfGameOfUser,
  getUsernameById,
  getTallyOfMostRecentRoundOfUser,
  isGameActive,
  getCreditOf,
  settleGame,
  registerUser,
  whoIsCreatorOfRoom,
  getAllRoomsNotInActivePlay,
  getMyTeam,
};
