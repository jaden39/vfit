import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import ChatBot from './components/ChatBot';

function NavBar() {
  return (
    <nav className="bg-blue-600 text-white p-4 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">VFit</Link>
        <div className="space-x-6">
          <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
          <Link to="/chat" className="hover:text-blue-200 transition-colors">Chat</Link>
          <Link to="/track" className="hover:text-blue-200 transition-colors">Track</Link>
        </div>
      </div>
    </nav>
  );
}

function HomePage({ message, workouts, calories, newWorkout, setNewWorkout, addWorkout }) {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-12">
        {message || 'Welcome to VFit'}
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl mb-4 text-blue-700">Add Workout</h2>
          <div className="space-y-4">
            <input 
              type="text" 
              value={newWorkout.name} 
              onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})} 
              className="w-full p-2 border rounded"
              placeholder="Workout name..."
            />
            <input 
              type="number" 
              value={newWorkout.duration} 
              onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})} 
              className="w-full p-2 border rounded"
              placeholder="Duration (minutes)"
            />
            <select
              value={newWorkout.category}
              onChange={(e) => setNewWorkout({...newWorkout, category: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="cardio">Cardio</option>
              <option value="strength">Strength Training</option>
              <option value="flexibility">Flexibility</option>
              <option value="sports">Sports</option>
            </select>
            <button 
              onClick={addWorkout} 
              className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors">
              Add Workout
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl mb-4 text-blue-700">Today's Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg text-blue-600">Total Calories</h3>
              <p className="text-3xl font-bold text-blue-800">{calories}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg text-blue-600">Workouts</h3>
              <p className="text-3xl font-bold text-blue-800">{workouts.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl mb-4 text-blue-700">Workout History</h2>
        <div className="overflow-auto">
          {workouts.length === 0 ? (
            <p className="text-gray-500 text-center">No workouts logged yet</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50">
                  <th className="p-2 text-left">Time</th>
                  <th className="p-2 text-left">Workout</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Duration</th>
                  <th className="p-2 text-left">Calories</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{workout.timestamp}</td>
                    <td className="p-2">{workout.name}</td>
                    <td className="p-2 capitalize">{workout.category}</td>
                    <td className="p-2">{workout.duration} min</td>
                    <td className="p-2">{workout.calories}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatPage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-12">Chat with FitBot</h1>
      {/* Add chat functionality here */}
    </div>
  );
}

function TrackPage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-12">Track Your Progress</h1>
      {/* Add tracking functionality here */}
    </div>
  );
}

function App() {
  const [message, setMessage] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [calories, setCalories] = useState(0);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    duration: '',
    category: 'cardio'
  });

  useEffect(() => {
    axios.get('http://localhost:5000')
      .then(response => setMessage(response.data))
      .catch(error => console.error(error));
  }, []);

  const calculateCalories = (duration, category) => {
    const caloriesPerMinute = {
      cardio: 10,
      strength: 8,
      flexibility: 3,
      sports: 7
    };
    return Math.round(duration * caloriesPerMinute[category]);
  };

  const addWorkout = () => {
    if (newWorkout.name && newWorkout.duration) {
      const workoutCalories = calculateCalories(Number(newWorkout.duration), newWorkout.category);
      const workoutEntry = {
        ...newWorkout,
        calories: workoutCalories,
        timestamp: new Date().toLocaleString()
      };
      setWorkouts([...workouts, workoutEntry]);
      setCalories(calories + workoutCalories);
      setNewWorkout({ name: '', duration: '', category: 'cardio' });
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        <NavBar />
        <Routes>
          <Route path="/" element={
            <HomePage 
              message={message}
              workouts={workouts}
              calories={calories}
              newWorkout={newWorkout}
              setNewWorkout={setNewWorkout}
              addWorkout={addWorkout}
            />
          } />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/track" element={<TrackPage />} />
        </Routes>
        <ChatBot />
      </div>
    </Router>
  );
}

export default App;
