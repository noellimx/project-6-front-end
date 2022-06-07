import { hashPassword, newAccessToken, verifyToken } from "../../auth/crypt.js";

const newDbAuthApi = (sequelize) => {
  const { user: User } = sequelize.models;

  const createUser = async (username, plainPassword) => {
    const user = await User.create({
      username,
      password: hashPassword(plainPassword),
    });

    return user;
  };

  const getUserByUsername = async (username) =>
    await User.findOne({ where: { username } });

  const getUsernameOfUserId = async (id) => {
    const user = await User.findOne({ where: { id } });

    return user.getDataValue("username");
  };

  const isUserExistingByUsername = async (username) =>
    !!(await getUserByUsername(username));

  const registerUser = async ({ username, plainPassword, password2 }) => {
    const is = await isUserExistingByUsername(username);

    if (is) {
      return [null, "Username taken :("];
    }
    console.log("username taken");

    if (plainPassword !== password2) {
      return [null, "Confirmation password mismatch."];
    }
    if (!username) {
      return [null, "Username must have at least 1 character"];
    }
    if (!plainPassword || !password2) {
      return [null, "Password must have at least 1 character"];
    }

    const user = await createUser(username, plainPassword);
    console.log(`[registerUser] user created`);
    console.log(user);

    const usernameRetrieved = user.getDataValue("username");
    const id = user.getDataValue("id");
    return [id, `Registration Success: #${id} : ${usernameRetrieved} `];
  };

  const getAccessToken = async ({ username, password: clearPassword }) => {
    if (!username) {
      return {
        accessToken: null,
        msg: "User field should not be empty :(",
      };
    }
    const details = await getUserByUsername(username);
    if (!details) {
      return {
        accessToken: null,
        msg: "User not found.",
      };
    }
    const passwordReceivedHashed = hashPassword(clearPassword);
    const passwordDatabaseHashed = details.getDataValue("password");

    const userId = details.getDataValue("id");
    const isMatch = passwordReceivedHashed === passwordDatabaseHashed;

    if (!isMatch) {
      return {
        accessToken: null,
        msg: "Credentials mismatch.",
      };
    }

    const accessToken = newAccessToken({ sub: userId });
    return { accessToken, msg: "ok" };
  };
  const isVerifiedToken = async (accessToken) => {
    const [is, sub] = await verifyToken(accessToken);

    return is;
  };

  return {
    registerUser,
    getAccessToken,
    isVerifiedToken,
    getUsernameOfUserId,
  };
};

export default newDbAuthApi;
