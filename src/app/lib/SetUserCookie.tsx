import { cookies } from "next/headers";
import AccountData from "./AccountInterface";
import { EncryptData } from "./SecureCookie";

export default async function SetUserCookie(userData: AccountData) {
  const threeMonths = new Date(Date.now() + 60 * 60 * 1000 * 24 * 90);
  const cookieConfig = {
    expires: threeMonths,
  };

  const data = {
    users_id: userData.users_id,
    username: userData.username,
    loggedIn: true,
  } as AccountData;

  const secureCookie = await EncryptData(data);

  cookies().set("quiz_token", secureCookie.jwtToken, cookieConfig);
  cookies().set("quiz_secure", secureCookie.iv, cookieConfig);
}
