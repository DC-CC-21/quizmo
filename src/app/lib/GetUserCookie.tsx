import { cookies } from "next/headers";
import AccountData from "./AccountInterface";
import { DecryptData } from "./SecureCookie";

/**
 * Retrieves the user's cookie data and decrypts it using the "SecureCookie" module.
 *
 * @returns {Promise<null | AccountData>} The decrypted user data, or null if the cookie data is missing.
 */
export default async function GetUserCookie(): Promise<null | AccountData> {
  // Retrieve the JWT token and IV from the cookies.
  const jwtToken = cookies().get("quiz_token");
  const iv = cookies().get("quiz_secure");

  // If either token is missing, return null.
  if (!jwtToken || !iv) {
    return null;
  } else {
    // Decrypt the user data using the "SecureCookie" module.
    return await DecryptData(jwtToken.value, iv.value);
  }
}

