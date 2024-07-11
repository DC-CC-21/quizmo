import { cookies } from "next/headers";
import AccountData from "./AccountInterface";
import { DecryptData } from "./SecureCookie";

export default async function GetUserCookie(): Promise<null | AccountData> {
    const jwtToken = cookies().get("quiz_token");
    const iv = cookies().get("quiz_secure");
  if (!jwtToken || !iv) {
    return null;
  } else {
    return await DecryptData(
        jwtToken.value,
        iv.value
    );
  }
}
