const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const XLSX = require('xlsx');
const ListItem = require('../models/List');  
const Agent = require('../models/Agent');  

// Function for setting up multer for file upload 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const extname = file.originalname.split('.').pop().toLowerCase();
    cb(null, file.fieldname + '-' + Date.now() + '.' + extname);
  }
});

// Function for checking file format 
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['csv', 'xlsx', 'xls'];
    const extname = file.originalname.split('.').pop().toLowerCase();

    if (!allowedTypes.includes(extname)) {
      return cb(new Error('Only CSV, XLSX, and XLS files are allowed'));
    }
    cb(null, true);
  }
}).single('file');

// Function for parsing file based on format and distributing tasks
const uploadCSVAndDistribute = async (req, res) => {
  upload(req, res, async (error) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const filePath = req.file.path;
    let tasks = [];

    try {
      if (filePath.endsWith('.csv')) {
        tasks = await parseCSV(filePath);
      } else if (filePath.endsWith('.xlsx') || filePath.endsWith('.xls')) {
        tasks = await parseExcel(filePath);
      } else {
        return res.status(400).json({ message: 'Unsupported file format' });
      }

      console.log(tasks);

      if (!tasks.every(task => task.firstName && task.phone && task.notes)) {
        return res.status(400).json({ message: 'Invalid file format or missing required fields' });
      }

      const distributedTasks = await distributeTasks(tasks);  

      res.status(200).json({ message: 'Tasks distributed successfully', data: distributedTasks });

    } catch (error) {
      res.status(500).json({ message: 'Error processing the file', error: error.message });
    }
  });
};

// Function for Parsing CSV files
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    let tasks = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        tasks.push({
          firstName: row.FirstName,
          phone: row.Phone,
          notes: row.Notes,
        });
      })
      .on('end', () => {
        resolve(tasks);
      })
      .on('error', (error) => {
        reject(new Error('Error reading CSV file: ' + error.message));
      });
  });
};

// Function for Parsing Excel files (XLSX/XLS)
const parseExcel = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      const tasks = data.map(row => ({
        firstName: row['FirstName'],
        phone: row['Phone'],
        notes: row['Notes'],
      }));
      resolve(tasks);
    } catch (error) {
      reject(new Error('Error reading Excel file: ' + error.message));
    }
  });
};

// Function for distributing tasks to agents
const distributeTasks = async (tasks) => {
  try {
    const agents = await Agent.find({ role: 'agent' });  
    
    if (agents.length === 0) {
      throw new Error('No agents found');
    }

    const distributedTasks = agents.map(agent => ({
      agentId: agent._id,
      tasks: [],
    }));

    const totalTasks = tasks.length;
    const tasksPerAgent = Math.floor(totalTasks / agents.length);  
    let remainingTasks = totalTasks % agents.length;  

    let taskIndex = 0;
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = 0; j < tasksPerAgent; j++) {
        if (taskIndex < tasks.length) {
          distributedTasks[i].tasks.push(tasks[taskIndex]);
          taskIndex++;  
        }
      }
    }

    for (let i = 0; i < remainingTasks; i++) {
      if (taskIndex < tasks.length) {
        distributedTasks[i % agents.length].tasks.push(tasks[taskIndex]);
        taskIndex++;
      }
    }

    for (const agentTasks of distributedTasks) {
      for (const task of agentTasks.tasks) {
        const listItem = new ListItem({
          firstName: task.firstName,
          phone: task.phone || 'Unknown',
          notes: task.notes || 'No notes available',
          assignedTo: agentTasks.agentId, 
        });

        try {
          await listItem.save();  
        } catch (error) {
          throw new Error('Error saving tasks to database: ' + error.message);
        }
      }
    }

    return distributedTasks;
  } catch (error) {
    throw new Error('Error distributing tasks: ' + error.message);
  }
};


const getAllTask = async (req, res) => {
  try {
    const tasks = await ListItem.aggregate([
      {
        $lookup: {
          from: 'agents',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'agentDetails'
        }
      },
      {
        $unwind: {
          path: '$agentDetails', 
          preserveNullAndEmptyArrays: true 
        }
      },
      {
        $group: {
          _id: '$assignedTo', 
          agentName: { $first: '$agentDetails.name' }, 
          tasks: {
            $addToSet: {
              taskId: '$_id',
              firstName: '$firstName',
              phone: '$phone',
              notes: '$notes'
            }
          }
        }
      },
      {
        $project: {
          _id: 0, 
          agentId: '$_id', 
          agentName: 1,
          tasks: 1
        }
      }
    ]);

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found' });
    }

    // console.log('Distributed Tasks:', tasks);
    res.status(200).json({ message: 'Tasks fetched successfully', data: tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};


module.exports = { getAllTask ,  uploadCSVAndDistribute };
