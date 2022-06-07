import { isUserExisting } from "../database/api/user.js";
import { UserDoor } from "./crypt.js";

const decodeUserId = (concealed) => UserDoor.reveal(concealed);

const useIdOfToken = (token) => token;
const validateToken = async (token) => {
  if (!token) {
    return {
      securityToken: null,
      msg: "Server did not receive target token to verify",
    };
  }
  const userId = useIdOfToken(token);
  const id = decodeUserId(userId);

  // TODO #asdfk124avdsfv verify id....
  console.log(`[validateToken] id is ${id}`);
  const is = await isUserExisting(id);
  if (is) {
    return {
      securityToken: token,
      msg: "Verified.",
    };
  } else {
    return {
      securityToken: null,
      msg: "Token failed verification.",
    };
  }
};

export { validateToken, decodeUserId };
