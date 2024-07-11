export default function Nav() {
  return (
    <nav className="p-2 bg-d_blue text-q_white">
      <ul className="flex flex-row gap-4">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/edit">Edit</a>
        </li>
      </ul>
    </nav>
  );
}
