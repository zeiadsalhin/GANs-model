import AboutUs from './components/AboutUs';
import Header from './components/Header';
import Model from './components/ModelLocal';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

// Project Members
const members = [
  'Zeiad Abdeltawab',
  'Mohamed Mahmoud', 
  'Islam BahiEldin',
  'Sayedi ElFahmy',
  'Ahmed Mostafa',
  'Mohamed Khaled'
]
function App() {

  return (
    <>
      <main>
        <div className="main">

        {/* Navigation header */}
        <Header />

        {/* Define Navigation links */}
        <Routes>
        <Route path='/' element={<Model />} />          
        <Route path='/AboutUs' element={<AboutUs />} />
        </Routes>

        {/* Footer and Credits */}
        <div className="info mb-5 flex flex-col mx-auto text-center max-w-[28rem] justify-center p-1 opacity-70">
          <p className='opacity-70 mb-1'>Created and Developed by:</p>
          <menu className='px-2 flex flex-wrap justify-center'>
            {members.map((member, i)=>(
              <li key={i} className='ml-1'>
                {i==0? undefined : '• '} {/*style the members name*/}
                {member}</li>
            ))}
          </menu>
        </div>
        
        </div>
      </main>
    </>
  )
}

export default App
