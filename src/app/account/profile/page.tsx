"use client";

import Messages from "@/app/ui/Messages";
import { useState } from "react";

export default function () {
  async function LogoutHandler(
    _: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    let response = await fetch(`/api/account/logout`);
    if (response.ok) {
      window.location.href = "/";
    } else {
      setErrors(["Failed to log out"]);
    }
  }
  const [errors, setErrors] = useState<string[]>([]);
  //   ad297edc-8f03-49bc-a5db-b4eabbe9c2cf
  return (
    <>
      <Messages messages={errors} />
      <main className="mt-2 w-[90%] sm:min-w-[350px] flex flex-col rounded-xl bg-blue-400 mx-auto sm:w-1/2 p-2 border-2 border-d_blue">
        <h2 className="text-2xl text-center border-b-2 border-b-black w-3/5 mx-auto my-2">
          Profile
        </h2>
        <form>
          <label htmlFor="username">
            Username:
            <input type="text" name="username" id="username" />
          </label>
          <label htmlFor="user_email">
            Email:
            <input
              type="email"
              name="user_email"
              id="user_email"
            />
          </label>
          <button
            type="submit"
            className="rounded-md border p-2 hover:bg-blue-300 mx-auto block w-1/2"
          >
            Update Account
          </button>
        </form>
        <button
          type="button"
          className="rounded-md border bg-red-500 p-2 hover:bg-red-300 mx-auto block w-1/2 m-2"
          onClick={LogoutHandler}
        >
          Logout
        </button>
      </main>
    </>
  );
}
