export default function Messages({
  messages,
  className = "",
}: {
  messages: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from(new Set(messages)).map((message, index) => (
        <p
          key={index}
          className="rounded-lg bg-orange-300 p-2 border-2 border-orange-500 m-1"
        >
          {message}
        </p>
      ))}
    </div>
  );
}
