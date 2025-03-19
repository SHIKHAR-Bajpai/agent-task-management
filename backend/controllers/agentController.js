const Agent = require('../models/Agent');

// Function for getting all the agents
const getAgents = async (req,res) => {
    try{

      const agents = await Agent.find()
      if (agents.length === 0){
        return res.status(404).json({message : "No agents Found !"})
      }
      
      res.status(200).json(agents)
    } catch(error){
      res.status(500).json({ message: 'Server error', error });
    }
}

// Function for adding new agents by admin
const addAgent = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try{
    const agentExists = await Agent.findOne({ email });
    
    if (agentExists) {
      res.status(400).json({ message: 'Agent already exists' });
    } 
    
    else {
      const agent = await Agent.create({ 
        name,
        email,
        mobile, 
        password,
        role: 'agent',
      });
        
        if (agent) {
          res.status(201).json({ message: 'Agent added successfully' });
        } 
        else {
          res.status(400).json({ message: 'Invalid agent data' });
          }
      }
  } catch(error){
    console.log(error)
    res.status(500).json({message: 'Server error' , error})
  }
};

// Function for updatin agents data (except email) by admin 
const updateAgent = async (req, res) => {
  const { name, mobile, password } = req.body;
  const agentId = req.params.id; 

  try {
    const agent = await Agent.findById(agentId);

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access forbidden: You do not have permission to update this agent' });
    }
    if (password) {
      agent.password = password;  
    }
    if (name) agent.name = name;
    if (mobile) agent.mobile = mobile;

    const updatedAgent = await agent.save();

    res.status(200).json({
      _id: updatedAgent.id,
      name: updatedAgent.name,
      email: updatedAgent.email,
      mobile: updatedAgent.mobile,
      role: updatedAgent.role,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Function for Deleting Agent's Data by admin
const deleteAgent = async (req, res) => {
  const agentId = req.params.id; 

  try {
    const agent = await Agent.findByIdAndDelete(agentId);

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access forbidden: You do not have permission to delete this agent' });
    }
    res.status(200).json({ message: 'Agent deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { getAgents , addAgent, updateAgent, deleteAgent };