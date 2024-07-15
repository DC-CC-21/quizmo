import Link from "next/link";

export default function Nav() {
  return (
    <nav className="p-2 bg-d_blue text-q_white">
      <ul className="flex flex-row gap-4">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/edit">Edit</Link>
        </li>
      </ul>
    </nav>
  );
}
