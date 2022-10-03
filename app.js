global.express = require("express");

let path = require("path"),
    app = express(),
    port = process.env.PORT || 3000;

let serverPath = path.join(__dirname, "server"),
    pathOf = function (underServer) {
        return path.join(serverPath, underServer);
    };

// all environments
app.set("port", port);

// Routing modules
app.use(require(pathOf("main")));

app.use(function (err, req, res, next) {
    if (!err) return next();

    res.status(err.status || 500);
    logger.error(err.message);

    res.send("");
});

app.set("port", port);

var server = app.listen(port, function () {
    console.log(`Express server listening on port ${server.address().port}`);
});
