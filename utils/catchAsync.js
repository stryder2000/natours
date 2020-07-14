module.exports = fn => {
    return (req,res,next) => {
        fn(req,res,next).catch(next);
        //Note here, fn(req,res,next) returns a promise that is catched by the catch function that is the same function that we
        //used with promises.
    };
};