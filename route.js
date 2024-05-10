const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        fs.readFile("message.txt", { encoding: "utf-8" }, (err, data) => {
            if (err) {
                console.log(err);
                // You might want to send an error response here
            }
            console.log('message' + data);
            res.write('<html>');
            res.write('<head><title>Enter Message</title></head>');
            res.write('<body><h1>Welcome to the Node.js World!</h1></body>');
            res.write(`<body>${data}</body>`)
            res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">SEND</button></form></body>');
            res.write('</html>');
            res.end();
        });
    }

    else if (url === '/message' && method === "POST") {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });

        req.on('end', () => {
            const parseBody = Buffer.concat(body).toString();
            console.log('parsebody>>>>', parseBody)
            const message = parseBody.split('=')[1];
            fs.writeFile("message.txt", message, (err) => {
                if (err) {
                    console.log(err);
                    // You might want to send an error response here
                }
                console.log(message);
                res.statusCode = 302;
                res.setHeader('Location', '/');
                res.end();
            });
        });
    }

    else {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Node Project</title></head>');
        res.write('<body><h1>Welcome to my Node.js project</h1></body>');
        res.write('</html>');
        res.end();
    }
};

module.exports.handler = requestHandler;
