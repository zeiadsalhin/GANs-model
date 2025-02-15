import ClientComponent from './components/modelCall';

// Project Members
const members = [
  'Zeiad Abdeltawab',
  'Mohamed Mahmoud', 
  'Islam BahiEldeen',
  'Sayedi ElFahmy',
  'Ahmed Mostafa',
  'Mohamed Khaled'
]
function App() {

  return (
    <>
      <main>
        <div className="main">
        <ClientComponent />

        <div className="info mt-20 flex flex-col mx-auto text-center max-w-[28rem] justify-center p-1 opacity-70">
          <p className='opacity-70'>Created by:</p>
          <menu className='px-2 flex flex-wrap justify-center'>
            {members.map((member, i)=>(
              <li key={i} className='mx-1'>{member}</li>
            ))}
          </menu>
        </div>
        
        </div>
      </main>
    </>
  )
}

export default App
