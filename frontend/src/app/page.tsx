import UploadForm from '@/components/UploadForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Rabbitt AI – Sales Insight Automator
          </h1>
          <p className="text-gray-600 text-lg">
            Upload your sales data and receive AI-powered insights via email
          </p>
        </header>

        {/* Main Card */}
        <UploadForm />
      </div>
    </main>
  )
}
