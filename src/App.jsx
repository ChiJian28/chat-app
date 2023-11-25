import { Routes, Route } from 'react-router-dom';
import { SignUp, Login, Chat} from './pages';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<SignUp />} />
      <Route path='/login' element={<Login />} />
      <Route path='/chat' element={<Chat />} />
    </Routes>
  )
}

export default App