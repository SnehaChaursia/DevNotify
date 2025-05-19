import { FaCode, FaCalendarAlt, FaBell } from "react-icons/fa"

const Introduction = () => {
  return (
    <section className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hackathon & Contest Tracker</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Never miss another coding opportunity. Stay updated on hackathons and LeetCode contests all in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center">
            <div className="text-4xl mb-4 flex justify-center">
              <FaCode />
            </div>
            <h3 className="text-xl font-semibold mb-2">Discover Events</h3>
            <p>Find the perfect hackathons and coding contests that match your skills and interests.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center">
            <div className="text-4xl mb-4 flex justify-center">
              <FaCalendarAlt />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Registration</h3>
            <p>Easily register for events and keep track of your upcoming competitions.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center">
            <div className="text-4xl mb-4 flex justify-center">
              <FaBell />
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Reminders</h3>
            <p>Set reminders and receive notifications so you never miss an important deadline.</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="bg-white text-purple-700 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300">
            Get Started
          </button>
        </div>
      </div>
    </section>
  )
}

export default Introduction
