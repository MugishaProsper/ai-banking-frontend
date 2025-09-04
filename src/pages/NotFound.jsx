import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="border flex flex-col items-center justify-between w-full h-full">
      <div className="text-6xl font-bold h-full">404</div>
      <p className="text-gray-600">The page you are looking for does not exist.</p>
      <Link to="/" className="inline-block rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white">Go Home</Link>
    </div>
  )
}


