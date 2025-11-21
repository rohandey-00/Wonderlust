
/* wrapAsync  */

module.exports = (fn)=> {
    return function(req, res, next){
        fn(req, res, next).catch((err)=> next(err));
    }
};


// A function which take a function and execute it and if err then throw error..