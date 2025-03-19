import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import PhoneInput from 'react-phone-number-input';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';
import config from '../../config';

const AgentManagement = () => {
    const [agents, setAgents] = useState([]);
    const [newAgent, setNewAgent] = useState({ name: '', email: '', mobile: '', password: '' });
    const [selectedAgent, setSelectedAgent] = useState(null);

    const token = localStorage.getItem('token');

  const fetchAgents = async () => {
    try {
    const response = await axios.get(`${config.API_URL}/api/agent/get-agents`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    setAgents(response.data);
    } catch (error) {
    console.error('Error fetching agents:', error);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [token]);

  const formatPhoneNumber = (phone) => {
    const parsedPhone = parsePhoneNumberFromString(phone);
    if (parsedPhone) {
        return `+${parsedPhone.countryCallingCode}-${parsedPhone.nationalNumber}`;
    }
    return phone;
  };

  const handleAddAgent = async (e) => {
    e.preventDefault();

    if (newAgent.name && newAgent.email && newAgent.mobile && newAgent.password) {

        const isEmailExist = agents.some((agent) => agent.email === newAgent.email);

        if (isEmailExist) {
            alert('Agent with this email already exists!');
            return; 
        }

        try {
            await axios.post( `${config.API_URL}/api/agent/add`,newAgent,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
        );

        alert('Agent added successfully!');
        fetchAgents();
        setNewAgent({ name: '', email: '', mobile: '', password: '' });

        }catch (error) {
            console.error('Error adding agent:', error);
        }
    }else {
        alert('Please fill all required fields!');
    }
  };


  const handleUpdateAgent = async (e) => {
    e.preventDefault();

    if (selectedAgent) {
        try {
            const response = await axios.put(`${config.API_URL}/api/agent/update/${selectedAgent._id}`, selectedAgent,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            if (response.status === 200) {
                alert('Agent updated successfully!');
                fetchAgents(); 
                setSelectedAgent(null);
            }
        }catch (error) {
            console.error('Error updating agent:', error);
        }
    }
};

  const handleDeleteAgent = async (id) => {
    try {
        await axios.delete(`${config.API_URL}/api/agent/delete/${id}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
    });

        alert('Agent deleted successfully!');
        fetchAgents();

    } catch (error) {
        console.error('Error deleting agent:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />

        <div className="p-6 flex justify-center flex-grow">
            <div className="flex space-x-8 w-full max-w-7xl">
            <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">

                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Agent List</h2>
                <div className="space-y-4">
                {agents.length === 0 ? (
                    <p className="text-gray-500">No agents added yet.</p>
                ) : (
                    <ul className="space-y-4">
                    {agents.map((agent) => (
                        <li key={agent._id} className="flex justify-between items-center border-b py-2">
                        <div>
                            <p className="text-gray-700 font-semibold">Name: {agent.name}</p>
                            <p className="text-gray-500 text-sm">Email: {agent.email}</p>
                            <p className="text-gray-500 text-sm">Phone: {formatPhoneNumber(agent.mobile)}</p>
                        </div>
                        <div className="flex space-x-4">
                            <button
                            onClick={() => setSelectedAgent(agent)}
                            className="text-blue-500 hover:text-blue-700 transition-all"
                            >
                            Update
                            </button>
                            <button
                            onClick={() => handleDeleteAgent(agent._id)} 
                            className="text-red-500 hover:text-red-700 transition-all"
                            >
                            Delete
                            </button>
                        </div>
                        </li>
                    ))}
                    </ul>
                )}
                </div>
            </div>

            <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
                {selectedAgent ? (
                <div>
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Update Agent</h3>
                    <form onSubmit={handleUpdateAgent} className="space-y-4">
                    <div>
                        <label htmlFor="update-name" className="block text-sm font-medium text-gray-600">
                        Name
                        </label>
                        <input
                        type="text"
                        id="update-name"
                        value={selectedAgent.name}
                        onChange={(e) => setSelectedAgent({ ...selectedAgent, name: e.target.value })}
                        className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="update-mobile" className="block text-sm font-medium text-gray-600">
                        Mobile Number
                        </label>
                        <PhoneInput
                        international
                        value={selectedAgent.mobile}
                        onChange={(value) => setSelectedAgent({ ...selectedAgent, mobile: value })}
                        className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="update-password" className="block text-sm font-medium text-gray-600">
                        Password
                        </label>
                        <input
                        type="password"
                        id="update-password"
                        value={selectedAgent.password}
                        onChange={(e) => setSelectedAgent({ ...selectedAgent, password: e.target.value })}
                        className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                    >
                        Update Agent
                    </button>
                    </form>
                </div>
                ) : (
                <div>
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Add New Agent</h3>
                    <form onSubmit={handleAddAgent} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                        Name
                        </label>
                        <input
                        type="text"
                        id="name"
                        value={newAgent.name}
                        onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                        className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                        Email
                        </label>
                        <input
                        type="email"
                        id="email"
                        value={newAgent.email}
                        onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                        className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-600">
                        Mobile Number
                        </label>
                        <PhoneInput
                        international
                        value={newAgent.mobile}
                        onChange={(value) => setNewAgent({ ...newAgent, mobile: value })}
                        className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                        Password
                        </label>
                        <input
                        type="password"
                        id="password"
                        value={newAgent.password}
                        onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
                        className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                    >
                        Add Agent
                    </button>
                    </form>
                </div>
                )}
            </div>
            </div>
        </div>

        <Footer className="mt-auto" />
    </div>
  );
};

export default AgentManagement;
