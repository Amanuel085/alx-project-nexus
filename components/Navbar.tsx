export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 shadow-sm bg-white">
      <h1 className="text-xl font-bold text-[#34967C]">Pollify</h1>
      <ul className="flex gap-6 text-sm font-medium">
        <li>Home</li>
        <li>Polls</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="flex gap-4">
        <button className="text-sm font-medium text-[#34967C]">Login</button>
        <button className="bg-[#34967C] text-white px-4 py-2 rounded-md text-sm font-medium">
          Sign Up
        </button>
      </div>
    </nav>
  );
}