import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header'; 
import Footer from './Footer'; 
import config from '../../config';

const TaskManagement = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [distributedTasks, setDistributedTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${config.API_URL}/api/tasks`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // console.log(response.data);
                setDistributedTasks(response.data.data)
                setLoading(false);

            } catch (error) {
                setError('An error occurred while fetching tasks. Please try again.' , error);
                setLoading(false);
            }
        };

        fetchTasks();
    }, [token]);  

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileType = selectedFile.type;
            if (fileType !== 'text/csv' && fileType !== 'application/vnd.ms-excel' && fileType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                setError('Invalid file format. Please upload a CSV, XLSX, or XLS file.');
                setFile(null);
            } else {
                setError(null);
                setFile(selectedFile);
            }
        }
    };

    const handleFileUpload = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const response = await axios.post(`${config.API_URL}/api/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            // console.log(response.data);
            const newDistributedTasks = response.data.data;
            setDistributedTasks(newDistributedTasks);
            setLoading(false);

        } catch (err) {
            setError('An error occurred while uploading the file. Please try again.' , err);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />

            <div className="flex-grow p-6 flex justify-center">
                <div className="flex space-x-8 w-full max-w-7xl">

                    <div className="w-full bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Upload File</h2>

                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                        <div className="space-y-4">
                            <div>
                                <input
                                    type="file"
                                    accept=".csv, .xlsx, .xls"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                onClick={handleFileUpload}
                                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                            >
                                {loading ? 'Uploading...' : 'Upload and Distribute Tasks'}
                            </button>
                        </div>
                    </div>

                    <div className="w-full bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-3xl font-bold text-gray-800 mb-4 text-center">Distributed Tasks</h3>

                        {loading ? (
                            <p className="text-gray-500">Loading tasks...</p> 
                        ) : distributedTasks.length === 0 ? (
                            <p className="text-gray-500">No tasks distributed yet.</p>
                        ) : (
                            <ul className="space-y-4">
                                {distributedTasks.map((agent, index) => (
                                    <li key={index} className="border-b py-2">
                                        <h4 className="text-xl font-bold">{agent.agentName}</h4>
                                            <ul className="space-y-2">
                                                {agent.tasks.map((task, taskIndex) => (
                                                    <li key={taskIndex} className="text-gray-700">
                                                        Task Name: {task.firstName} | Phone: {task.phone} | Notes: {task.notes}
                                                    </li>
                                                ))}
                                            </ul>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TaskManagement;