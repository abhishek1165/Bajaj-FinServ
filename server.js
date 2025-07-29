const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


function generateUserId(fullName) {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    
    const formattedName = fullName.toLowerCase().replace(/\s+/g, '_');
    
    return `${formattedName}_${day}${month}${year}`;
}


function processArray(data) {
    const numbers = [];
    const alphabets = [];
    const specialCharacters = [];

    data.forEach(item => {
        const itemStr = item.toString();

        if (!isNaN(itemStr) && !isNaN(parseFloat(itemStr))) {
            numbers.push(itemStr);
        } else if (/^[a-zA-Z]+$/.test(itemStr)) {
            alphabets.push(itemStr.toUpperCase());
        } else {
            specialCharacters.push(itemStr);
        }
    });

    const evenNumbers = numbers.filter(num => parseInt(num) % 2 === 0);
    const oddNumbers = numbers.filter(num => parseInt(num) % 2 !== 0);

    const sum = numbers.reduce((acc, num) => acc + parseInt(num), 0);

 
    const reversedString = alphabets.join('').split('').reverse();
    let concatString = "";
    for (let i = 0; i < reversedString.length; i++) {
        concatString += i % 2 === 0
            ? reversedString[i].toUpperCase()
            : reversedString[i].toLowerCase();
    }

    return {
        evenNumbers,
        oddNumbers,
        alphabets,
        specialCharacters,
        sum: sum.toString(),
        concatString
    };
}


// bfhl endpoint
app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;
        
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                message: "Invalid input: 'data' should be an array"
            });
        }
        
    
        const userInfo = {
            fullName: "John Doe",
            email: "john@xyz.com",
            rollNumber: "ABCD123"
        };
        
        
        const userId = generateUserId(userInfo.fullName);
       
        const processedData = processArray(data);
        
      
        const response = {
            is_success: true,
            user_id: userId,
            email: userInfo.email,
            roll_number: userInfo.rollNumber,
            odd_numbers: processedData.oddNumbers,
            even_numbers: processedData.evenNumbers,
            alphabets: processedData.alphabets,
            special_characters: processedData.specialCharacters,
            sum: processedData.sum,
            concat_string: processedData.concatString
        };
        
        res.status(200).json(response);
        
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            is_success: false,
            message: "Internal server error"
        });
    }
});


app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});


app.get('/health', (req, res) => {
    res.status(200).json({
        status: "API is running",
        timestamp: new Date().toISOString()
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/bfhl`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
