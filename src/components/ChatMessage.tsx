export default function ChatMessage({ role, content }: { role: string; content: string }) {
  const isUser = role === 'user';
  return (
    <div
      className={`my-2 px-4 py-3 rounded-lg max-w-[75%] ${
        isUser ? 'bg-blue-100 ml-auto' : 'bg-gray-200'
      }`}
    >
      <p className="text-sm text-gray-800">{content}</p>
    </div>
  );
}
