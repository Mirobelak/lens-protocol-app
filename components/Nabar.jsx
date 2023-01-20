import Link from 'next/link'

const Navbar = () => (
  <nav className="bg-black p-6 flex justify-between items-center">
    <Link href="/" className="text-lg font-medium text-green-300">
    Lens Media 🌿
    </Link>
    <div className="flex">
    <Link href="/feed" className="text-lg font-medium text-green-300">
Walllet </Link>
    <Link href="/profile" className="text-lg font-medium text-green-300">
    Profile
    </Link>
    </div>
  </nav>
)

export default Navbar




