import toast, { Toaster } from "react-hot-toast"

function App() {

  const showToast = () => {
    toast.success("Booking Successful 🚗")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">

      <Toaster position="top-right" />

      <h1 className="text-4xl font-bold">
        Toast Notification 🚀
      </h1>

      <button
        onClick={showToast}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl"
      >
        Book Car
      </button>

    </div>
  )
}

export default App