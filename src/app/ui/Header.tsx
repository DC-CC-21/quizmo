import GetUserCookie from "../lib/GetUserCookie";

export default async function Header() {
  const userToken = await GetUserCookie()
  let width = "w-10"
  if (!userToken) {
    width = ""
  }
  return (
    <header className="bg-l_blue p-2 flex justify-between">
      <h1 className="text-3xl font-bold text-l_orange">Quizmo</h1>
      <a
        href={!userToken ? "/account/login" : `/account/profile/${userToken.users_id}`}
        className={` ${width} hover:animate-breathe rounded-full bg-q_white p-2 h-10 text-center`}
      >
        {userToken?.username[0].toUpperCase() || "Login"}
      </a>
    </header>
  );
}
