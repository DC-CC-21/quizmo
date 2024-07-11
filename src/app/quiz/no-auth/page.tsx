export default function NoAuthPage() {
  return (
    <main className="p-2">
      <h2 className="text-center text-2xl m-2">Not Logged In</h2>
      <p className="text-center [&>a]:underline [&>a]:text-d_orange">
        Please <a href="/account/login">login</a> or{" "}
        <a href="/account/register">register</a> to play
      </p>
    </main>
  );
}
