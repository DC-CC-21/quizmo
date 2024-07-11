"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Page for logging in to the site.
 *
 * @returns {JSX.Element} A form for logging in.
 */
export default function Login(): JSX.Element {
  // State for the error message
  const [error, setError] = useState<string[]>([]);
  let router = useRouter()

  /**
   * Handles the form submission by sending the login request
   * to the server.
   *
   * @param {React.FormEvent<HTMLFormElement>} event The event object
   * @returns {Promise<void>} A promise that resolves when the request has finished
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const username = event.currentTarget.username.value;
    const pwd = event.currentTarget.pwd.value;
    const response = await fetch("/api/account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, pwd }),
    });

    const data = await response.json();
    if (data.error) {
      setError(data.error);
    }
    if (data.success) {
      setError([]);
      router.refresh()
    }
  };
  return (
    <main>
      <h2 className="text-2xl text-center border-b-2 border-b-black w-3/5 mx-auto my-2">
        Login
      </h2>
      <div>
        {error.map((e) => {
          console.log(e);
          return (
            <div className="p-2 m-2 border-2 rounded-md border-red-600 bg-red-200" key={e}>
              {e}
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        method="post"
        id="login"
        className="w-[90%] sm:min-w-[350px] flex flex-col rounded-xl bg-blue-400 mx-auto sm:w-1/2 p-2 border-2 border-d_blue"
      >
        <label htmlFor="username">
          Username
          <input
            type="text"
            name="username"
            id="username"
            autoComplete="username"
            required
          />
        </label>
        <label htmlFor="pwd">
          Password
          <input type="password" name="pwd" id="pwd" required/>
        </label>
        <button
          type="submit"
          className="load-in rounded-md border p-2 hover:bg-blue-300"
        >
          Login
        </button>
        <div className="text-center p-1 mt-2 bg-blue-100 rounded-lg">
          Don&apos;t have an account?{" "}
          <a href="/account/signup" className="underline-slide text-d_orange">
            Sign-up
          </a>
        </div>
      </form>
    </main>
  );
}

