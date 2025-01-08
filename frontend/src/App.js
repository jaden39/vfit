import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import ChatBot from './components/ChatBot';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

function NavBar() {
  return (
    <nav className="bg-blue-600 text-white p-4 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">VFit</Link>
        <div className="space-x-6">
          <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
          <Link to="/workouts" className="hover:text-blue-200 transition-colors">Workouts</Link>
          <Link to="/calendar" className="hover:text-blue-200 transition-colors">Calendar</Link>
          <Link to="/chat" className="hover:text-blue-200 transition-colors">Chat</Link>
          <Link to="/track" className="hover:text-blue-200 transition-colors">Track</Link>
        </div>
      </div>
    </nav>
  );
}

function HomePage() {
  const [userProfile, setUserProfile] = useState({
    age: '',
    weight: '',
    height: '',
    exerciseTime: '',
    fitnessGoal: 'weight-loss',
    activityLevel: 'sedentary',
    dietaryRestrictions: [],
    prompt: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile submitted:', userProfile);
  };

  return (
    <div className="container mx-auto px-4 max-w-3xl">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
        Personalize Your Fitness Journey
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <input
                type="number"
                value={userProfile.age}
                onChange={(e) => setUserProfile({...userProfile, age: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                placeholder="Age"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <input
                type="number"
                value={userProfile.weight}
                onChange={(e) => setUserProfile({...userProfile, weight: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                placeholder="Weight (kg)"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <input
                type="number"
                value={userProfile.height}
                onChange={(e) => setUserProfile({...userProfile, height: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                placeholder="Height (cm)"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <input
                type="number"
                value={userProfile.exerciseTime}
                onChange={(e) => setUserProfile({...userProfile, exerciseTime: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                placeholder="Daily Exercise (minutes)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              value={userProfile.fitnessGoal}
              onChange={(e) => setUserProfile({...userProfile, fitnessGoal: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
            >
              <option value="" disabled>Select Fitness Goal</option>
              <option value="weight-loss">Weight Loss</option>
              <option value="muscle-gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="endurance">Endurance</option>
            </select>

            <select
              value={userProfile.activityLevel}
              onChange={(e) => setUserProfile({...userProfile, activityLevel: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
            >
              <option value="" disabled>Select Activity Level</option>
              <option value="sedentary">Sedentary</option>
              <option value="lightly-active">Lightly Active</option>
              <option value="moderately-active">Moderately Active</option>
              <option value="very-active">Very Active</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2 p-2 border rounded">
            {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'].map((restriction) => (
              <label key={restriction} className="flex items-center bg-gray-50 px-3 py-1 rounded-full text-sm">
                <input
                  type="checkbox"
                  checked={userProfile.dietaryRestrictions.includes(restriction)}
                  onChange={(e) => {
                    const updatedRestrictions = e.target.checked
                      ? [...userProfile.dietaryRestrictions, restriction]
                      : userProfile.dietaryRestrictions.filter(r => r !== restriction);
                    setUserProfile({...userProfile, dietaryRestrictions: updatedRestrictions});
                  }}
                  className="mr-2"
                />
                {restriction}
              </label>
            ))}
          </div>

          <div className="mt-6">
            <textarea
              value={userProfile.prompt}
              onChange={(e) => setUserProfile({...userProfile, prompt: e.target.value})}
              placeholder="Describe your fitness goals and preferences in detail... (e.g., 'I want to build muscle while maintaining a vegetarian diet and working out 3 times a week')"
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all h-32 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors mt-6"
          >
            Generate Personalized Plan
          </button>
        </form>
      </div>
    </div>
  );
}

function WorkoutPage({ message, workouts, calories, newWorkout, setNewWorkout, addWorkout }) {
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
      <ChatBot />
    </div>
  );
}

function TrackPage() {
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  });

  const [newFood, setNewFood] = useState({
    name: '',
    calories: '',
    category: 'breakfast'
  });

  const addFood = () => {
    if (newFood.name && newFood.calories) {
      setMeals(prevMeals => ({
        ...prevMeals,
        [newFood.category]: [...prevMeals[newFood.category], {
          ...newFood,
          id: Date.now(),
          timestamp: new Date().toLocaleString()
        }]
      }));
      setNewFood({ name: '', calories: '', category: newFood.category });
    }
  };

  const removeFood = (category, id) => {
    setMeals(prevMeals => ({
      ...prevMeals,
      [category]: prevMeals[category].filter(food => food.id !== id)
    }));
  };

  const MealSection = ({ title, category, items }) => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl text-blue-700 mb-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">No foods added yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-50">
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Food</th>
                <th className="p-2 text-left">Calories</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(food => (
                <tr key={food.id} className="border-b">
                  <td className="p-2">{food.timestamp}</td>
                  <td className="p-2">{food.name}</td>
                  <td className="p-2">{food.calories}</td>
                  <td className="p-2">
                    <button
                      onClick={() => removeFood(category, food.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">Track Your Meals</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl text-blue-700 mb-4">Add Food</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            value={newFood.name}
            onChange={(e) => setNewFood({...newFood, name: e.target.value})}
            placeholder="Food name"
            className="p-2 border rounded"
          />
          <input
            type="number"
            value={newFood.calories}
            onChange={(e) => setNewFood({...newFood, calories: e.target.value})}
            placeholder="Calories"
            className="p-2 border rounded"
          />
          <select
            value={newFood.category}
            onChange={(e) => setNewFood({...newFood, category: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snacks">Snacks</option>
          </select>
          <button
            onClick={addFood}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add Food
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <MealSection title="Breakfast" category="breakfast" items={meals.breakfast} />
        <MealSection title="Lunch" category="lunch" items={meals.lunch} />
        <MealSection title="Dinner" category="dinner" items={meals.dinner} />
        <MealSection title="Snacks" category="snacks" items={meals.snacks} />
      </div>
    </div>
  );
}

function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workoutPlan, setWorkoutPlan] = useState({
    "2024-03-20": { type: "Cardio", description: "30 min running" },
    "2024-03-22": { type: "Strength", description: "Upper body workout" },
    "2024-03-24": { type: "Recovery", description: "Yoga and stretching" },
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weeks = [];
  let currentWeek = [];

  for (let day = 0; day < 42; day++) {
    const currentDay = addDays(startDate, day);
    const dateString = format(currentDay, 'yyyy-MM-dd');
    const isCurrentMonth = format(currentDay, 'M') === format(currentDate, 'M');
    
    currentWeek.push({
      date: currentDay,
      dateString,
      isCurrentMonth,
      workout: workoutPlan[dateString]
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  const nextMonth = () => {
    setCurrentDate(addDays(monthEnd, 1));
  };

  const prevMonth = () => {
    setCurrentDate(addDays(monthStart, -1));
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-800">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="space-x-2">
              <button 
                onClick={prevMonth}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={nextMonth}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-blue-50 p-2 text-center font-semibold">
                {day}
              </div>
            ))}

            {weeks.map((week, weekIndex) => (
              week.map((day, dayIndex) => (
                <div
                  key={day.dateString}
                  className={`bg-white min-h-[100px] p-2 ${
                    !day.isCurrentMonth ? 'text-gray-400' : ''
                  }`}
                >
                  <div className="font-medium mb-1">
                    {format(day.date, 'd')}
                  </div>
                  {day.workout && (
                    <div className={`text-sm p-1 rounded ${
                      day.workout.type === 'Cardio' ? 'bg-green-100 text-green-800' :
                      day.workout.type === 'Strength' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      <div className="font-medium">{day.workout.type}</div>
                      <div className="text-xs">{day.workout.description}</div>
                    </div>
                  )}
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
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
          <Route path="/" element={<HomePage />} />
          <Route path="/workouts" element={
            <WorkoutPage 
              message={message}
              workouts={workouts}
              calories={calories}
              newWorkout={newWorkout}
              setNewWorkout={setNewWorkout}
              addWorkout={addWorkout}
            />
          } />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/track" element={<TrackPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
