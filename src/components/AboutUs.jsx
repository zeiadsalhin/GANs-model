// Project members
const members = [
  {
    name: 'Mohamed Mahmoud',
    pos: 'Team Leader',
    desc: 'As the team leader, I am responsible for guiding the project\'s direction and ensuring it stays on track.'
  },
  {
    name: 'Zeiad Abdeltawab',
    pos: 'App & Model Creator',
    desc: 'I lead the development of the app and the AI model, ensuring functionality, and optimizing the model response.'
  },
  {
    name: 'Islam BahiEldeen',
    pos: 'AI Tuner',
    desc: 'Specializing in fine-tuning AI models to enhance their performance. Improving accuracy and efficiency, and operates at its full potential.'
  },
  {
    name: 'Sayedi ElFahmy',
    pos: 'AI Trainer',
    desc: 'Responsible for training the AI models with the right data to ensure they learn and adapt effectively. Working in optimizing the AI’s Accuracy.'
  },
  {
    name: 'Ahmed Mostafa',
    pos: 'Team Member',
    desc: 'Valuable team member who contributes to various aspects of the project. From coding to problem-solving and collaboration.'
  },
  {
    name: 'Mohamed Khaled',
    pos: 'AI Trainer',
    desc: 'Playing a key role in training the AI. Ensuring that the AI continuously gets smarter and more capable throughout the lifecycle.'
  }
];


const AboutUs = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-screen-lg mx-auto  rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-[#646cff] mb-6">About Us</h1>

        <div className="text-lg text-center mb-6">
          <p>
            We are a dedicated team of students from <strong>Helwan University</strong> working on our graduation project. Our goal is to explore innovative solutions and develop new technologies that will have a positive impact on AI Community.
          </p>
        </div>
        
      {/*Break line*/}
        <div className="w-[4rem] h-1 mx-auto bg-gray-500 rounded my-5"></div>

        <h2 className="text-2xl text-center font-semibold text-[#646cff] mb-4">Our Team</h2>

        <div className="grid grid-cols-1 gap-8">
          {members.map((member, index) => (
            <div key={index} className="bg-gray-600/20 p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-50">{member.name}</h4>
              <p className="text-gray-400">{member.pos}</p>
              <p className="text-gray-200 mt-2">
                {member.desc}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 mb-5 text-center">
          <p className="text-lg opacity-90">
            We are excited about this journey and thankful for the opportunity to create this project. Thank you for visiting our Project!
          </p>
        </div>

        {/*Break line*/}
        <div className="w-[4rem] h-1 mx-auto bg-gray-500 rounded my-5"></div>

        <div className="version text-center">
          <p className="p-5 opacity-70">v 1.1</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
