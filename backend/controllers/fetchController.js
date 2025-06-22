const mongoose = require('mongoose');
const logModel = require('../models/logModel'); // Adjust the path to your schema file
const path = require('path'); // Import the path module
const { timeStamp } = require('console');
const fs = require('fs').promises;

// // Controller to fetch all data from MongoDB
async function fetchall(req, res) {


try {
  // Read JSON file
  const jsonPath = path.join(__dirname, 'public', 'data.json');
  const jsonData = await fs.readFile(jsonPath, 'utf8');
  let data;

  // Parse JSON and handle different structures
  try {
    data = JSON.parse(jsonData);
  } catch (error) {
    throw new Error('Invalid JSON format in data.json');
  }

  // Ensure data is an array
  if (Array.isArray(data)) {
    // Direct array
  } else if (data.items && Array.isArray(data.items)) {
    data = data.items; // Use items array if present
  } else {
    throw new Error('Invalid JSON structure: Expected an array or object with items array');
  }

  // Filtering by user
  const user = req.query.user ? req.query.user.toLowerCase() : '';
  if (user) {
    data = data.filter(item => 
      item.user && typeof item.user === 'string' && 
      item.user.toLowerCase().includes(user)
    );
  } else {
    // If no user is provided, return all data (or you could throw an error if user filter is mandatory)
    // throw new Error('User query parameter is required');
  }

  const logType = req.query.logType ? req.query.logType.toLowerCase() : '';
  if (logType ) {
    data = data.filter(item => 
      item.logType && typeof item.logType === 'string' && 
      item.logType.toLowerCase().includes(logType)
    );
  } else {
    // If no user is provided, return all data (or you could throw an error if user filter is mandatory)
    // throw new Error('User query parameter is required');
  }

  const clientIp = req.query.clientIp ? req.query.clientIp.toLowerCase() : '';
  if (clientIp) {
    data = data.filter(item => 
      item.clientIp && typeof item.clientIp === 'string' && 
      item.clientIp.toLowerCase().includes(clientIp)
    );
  } else {
    // If no user is provided, return all data (or you could throw an error if user filter is mandatory)
    // throw new Error('User query parameter is required');
  }

  const methodStatus = req.query.methodStatus ? req.query.methodStatus.toLowerCase() : '';
  if (methodStatus) {
    data = data.filter(item => 
      item.methodStatus && typeof item.methodStatus === 'string' && 
      item.methodStatus.toLowerCase().includes(methodStatus)
    );
  } else {
    // If no user is provided, return all data (or you could throw an error if user filter is mandatory)
    // throw new Error('User query parameter is required');
  }

  const method = req.query.method ? req.query.method.toLowerCase() : '';
  if (method) {
    data = data.filter(item => 
      item.method && typeof item.method === 'string' && 
      item.method.toLowerCase().includes(method)
    );
  } else {
    // If no user is provided, return all data (or you could throw an error if user filter is mandatory)
    // throw new Error('User query parameter is required');
  }

  const other = req.query.other ? req.query.other.toLowerCase() : '';
  if (other) {
    data = data.filter(item => 
      item.other && typeof item.other === 'string' && 
      item.other.toLowerCase().includes(other)
    );
  } else {
    // If no user is provided, return all data (or you could throw an error if user filter is mandatory)
    // throw new Error('User query parameter is required');
  }


  //time duration filter

  const { startTimestamp } = req.query; // Expected format: 2025-12-12T04:50:32+05:30
  
  const referenceTime = startTimestamp ? new Date(startTimestamp) : '';
  if (referenceTime) {
    data = data.filter(item => 
      item.timestamp && typeof item.timestamp === 'string' && 
      new Date(item.timestamp) >= referenceTime
    );
  } else {
    // If no startTimestamp is provided, return all data
  }


  const { endTimestamp } = req.query; // Expected format: 2025-12-12T04:50:32+05:30
  
  const referenceTimeEnd = endTimestamp ? new Date(endTimestamp) : '';
  if (referenceTimeEnd) {
    data = data.filter(item => 
      item.timestamp && typeof item.timestamp === 'string' && 
      new Date(item.timestamp) <= referenceTimeEnd
    );
  } else {
    // If no startTimestamp is provided, return all data
  }

  



  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Calculate pagination metadata
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / limit);
  const paginatedData = data.slice(startIndex, endIndex);





  
  ///nomber of data for pie chart
  const getMethodNo = data.filter(item => 
                       item.method.toLowerCase().includes('Post')
  );
  const postMethodNo = '';
  const code20 = '';
  const code30 = '';
  const code40 = '';
  const code50 = '';
    ///nomber of data for pie chart



    


  // Return response
  res.json({
    data: paginatedData,
    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems,
      totalPages,
      getMethodNo:getMethodNo.length
    },
  });
} catch (error) {
  console.error('Error reading or processing JSON file:', error.message);
  res.status(500).json({ error: 'Failed to fetch JSON data', details: error.message });
}

}






module.exports = { fetchall };