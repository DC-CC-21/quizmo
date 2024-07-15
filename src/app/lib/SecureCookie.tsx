import AccountData from "./AccountInterface";

export const EncryptData = async (data: AccountData) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const secretKey = await crypto.subtle.importKey(
    "raw",
    Buffer.from(process.env.JWT_SECRET as string, "base64"),
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );
  const jwtToken = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    secretKey,
    new TextEncoder().encode(JSON.stringify(data)),
  );

  return {
    jwtToken: Buffer.from(jwtToken).toString("base64"),
    iv: Buffer.from(iv).toString("base64"),
  };
};

export const DecryptData = async (jwtToken: string, iv: string) => {
  const secretKey = await crypto.subtle.importKey(
    "raw",
    Buffer.from(process.env.JWT_SECRET as string, "base64"),
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );

  const data = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: Buffer.from(iv, "base64"),
    },
    secretKey,
    Buffer.from(jwtToken, "base64"),
  );

  return JSON.parse(new TextDecoder().decode(data));
};
