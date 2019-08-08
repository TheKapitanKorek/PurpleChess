const express = require('express');
const path = require('path');
const app = express();


app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.get("/",(req,res)=>{
    console.log('joł');
    res.send({hello:"i am a cat"});

})

const PORT = process.env.PORT || 5000;
app.listen(PORT,console.log('listening on port ' + PORT));