exports.checkID = (req,res,next,val) => {
    if(val >= tours.length){
        return res.status(404).json({
            status : "fail",
            message : "Invalid ID"
        });
    }
    next();
}
exports.getAllUsers = (req, res) => {
    res.status(500).json({
        status : "error",
        message : "This route is not yet defined!"
    });
}


exports.createNewUser = (req, res) => {
    res.status(500).json({
        status : "error",
        message : "This route is not yet defined!"
    });
}


exports.getUserByID = (req, res) => {
    res.status(500).json({
        status : "error",
        message : "This route is not yet defined!"
    });
}


exports.updateUser = (req, res) => {
    res.status(500).json({
        status : "error",
        message : "This route is not yet defined!"
    });
}


exports.deleteUser = (req, res) => {
    res.status(500).json({
        status : "error",
        message : "This route is not yet defined!"
    });
}