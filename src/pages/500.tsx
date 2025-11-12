export function ErrorPage({ error }: { error: unknown }) {
  return (
    <main className="max-w-md mx-auto px-4 py-4">
      <div className="text-center my-4 py-20 shadow-md p-6 bg-white rounded-lg">
        <h1 className="text-2xl font-bold">오류가 발생했습니다!</h1>
        <p className="text-gray-500">
          Error: {error instanceof Error ? error.message : String(error)}
        </p>
        <button
          className="bg-blue-500 p-3 rounded-md flex-shrink-0 text-white hover:text-gray-200"
          onClick={() => {
            window.location.reload();
          }}
        >
          다시 시도
        </button>
      </div>
    </main>
  );
}
