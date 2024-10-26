
export default function Unauthorized() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <div className="bg-white p-8 rounded shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-4 text-gray-700">You do not have permission to view this page.</p>
          <a href="/" className="mt-6 inline-block text-blue-500 hover:underline">
            Go back to home
          </a>
        </div>
      </div>
    );
  }
  