const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname));

app.listen(5500, () => {
  console.log('Frontend running at http://localhost:5500');
  console.log('Open your browser and go to: http://localhost:5500');
});
