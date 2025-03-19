#📚 Agent Task Management System
An application built using the MERN Stack that allows admins to manage agents and efficiently assign tasks to them using a round-robin distribution algorithm after uploading CSV, XLSX, or XLS files.

##🚀 Features  

✅ Authentication:  

Login and Register with JWT-based authentication.  
Admin can manage agent accounts.  
✅ Agent Management:  
Add, update, and delete agents.  
List of agents with assigned tasks.  

✅ Task Distribution:  
Upload CSV, XLSX, or XLS files.
Extract firstName, phone, and notes from uploaded files.
Distribute tasks equally among agents using a round-robin algorithm.

✅ Task Viewing:
View distributed tasks assigned to each agent.    
  
##🛠️ Tech Stack
###Backend:
Node.js     
Express.js    
MongoDB & Mongoose    
JWT for authentication   
Multer for file uploads    
CSV-Parser & XLSX for file parsing   

###Frontend:   
React.js with Tailwind CSS   
React Router DOM for routing   
Axios for API requests   

##📦 Libraries and Dependencies   
###Backend:   
dotenv – To manage environment variables.   
mongoose – MongoDB object modeling.    
csv-parser – For parsing CSV files.    
xlsx – For parsing XLSX and XLS files.    
multer – File upload middleware.   
jsonwebtoken – For JWT-based authentication.   
###Frontend:   
axios – For making HTTP requests.   
react-router-dom – For routing.    
react-phone-number-input – For phone number validation.    
tailwindcss – For designing the UI.   

##⚙️ Setup Instructions  

1. Clone the Repository
git clone [](https://github.com/SHIKHAR-Bajpai/agent-task-management.git)
cd agent-task-management

2. Backend Setup
Navigate to the backend folder and install dependencies:
cd backend   
npm install

2.1 Configure .env File   
Create a .env file in the backend directory and add the following:   
MONGO_URI=your_mongo_connection_string   
JWT_SECRET=your_jwt_secret   
PORT=5000    

2.2 Start the Backend Server   
node server.js    
    
By default, the backend will run on:   
[](http://localhost:5000)    
   
3. Frontend Setup    
Navigate to the frontend folder and install dependencies:    
cd ../frontend   
npm install

3.1 Configure config.js File   
In frontend/src/config.js, add the API URL:
const config = {
  API_URL: 'http://localhost:5000',  
};
  
export default config;   

3.2 Start the Frontend Application    
npm start   
By default, the frontend will run on:   
[](http://localhost:3000)   
    
##🔥 Usage Instructions   
   
#Admin Credentials:   
Admins can log in and manage agents from the dashboard.  
Admin can:   
Add, update, and delete agents.  
Upload CSV, XLSX, or XLS files to assign tasks.   
Uploading Task Files:   
Go to the Upload Tasks section.    
Upload a valid .csv, .xlsx, or .xls file.   
The system will parse the file and assign tasks in a round-robin manner to agents.    

##🧩 API Endpoints    
Auth APIs:
POST /api/auth/register – Register a new admin.  
POST /api/auth/login – Login and get a token.   
Agent APIs:   
POST /api/agents – Add a new agent.   
GET /api/agents – Get all agents.    
PUT /api/agents/:id – Update an agent.   
DELETE /api/agents/:id – Delete an agent.    
Task APIs:     
POST /api/upload – Upload a CSV/XLSX/XLS file and distribute tasks.   
GET /api/tasks – Get all tasks distributed to agents.   

