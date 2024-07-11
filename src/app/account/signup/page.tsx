/**
 * Renders the signup page component.
 * 
 * @returns {JSX.Element} The signup page component.
 */
export default function Signup(): JSX.Element {
  return (
    <main>
      {/* Heading */}
      <h2 className="text-2xl text-center border-b-2 border-b-black w-3/5 mx-auto my-2">
        Sign Up
      </h2>

      {/* Form */}
      <form
        id="signup"
        className="w-[90%] sm:min-w-[350px] flex flex-col rounded-xl bg-blue-400 mx-auto sm:w-1/2 p-2 border-2 border-d_blue"
      >
        {/* Username */}
        <label htmlFor="username">
          Username
          <input type="text" name="username" id="username" required/>
        </label>

        {/* Email */}
        <label htmlFor="email">
          Email
          <input type="email" name="email" id="email" required/>
        </label>

        {/* Password */}
        <label htmlFor="pwd">
          Password
          <input type="password" name="pwd" id="pwd" required/>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          className="load-in rounded-md border p-2 hover:bg-blue-300"
        >
          Sign Up
        </button>

        {/* Login Link */}
        <div className="text-center p-1 mt-2 bg-blue-100 rounded-lg">
          Already have an account?{" "}
          <a href="/account/login" className="underline-slide text-d_orange">
            Login
          </a>
        </div>
      </form>
    </main>
  );
}

