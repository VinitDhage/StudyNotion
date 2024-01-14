import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Navbar from './components/common/Navbar';
// import Signup from './pages/Signup';
// import Login from './pages/Login';

function App() {
  return (
    <div className=' w-screen min-h-screen bg-richblue-900 flex flex-col font-inter'>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        {/* <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} /> */}
      </Routes>
    </div>
  );
}

export default App;
