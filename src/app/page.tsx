import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        Welcome to the Dashboard
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Manage your data users, contracts, and more with ease.
      </p>

      <Image
        src="/cloud.svg"
        alt="Dashboard Illustration"
        width={300}
        height={300}
        className="mb-6"
      />

      <div className="text-sm text-gray-500">
        Powered by Next.js • Tailwind CSS • ShadCN UI
      </div>
    </div>
  );
}
