const sendDevError = (err,res)=>{ //I want to send the full error details in development mode for debugging purposes
    res.status(err.statusCode).json({
        status: err.status,
        statusCode: err.statusCode,
        message: err.message,
        stack: err.stack
    });
}

const sendProdError = (err,res)=>{ //In production mode, I want to send only the error message to the client, without exposing the stack trace or other details
    if(err.isOperational){ //If the error is operational (expected), I want to send the error message to the client
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }else{ // If the error is not operational (unexpected), I want to log the error and send a generic message to the client
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

// module.exports = (err, req, res, next) => {
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';
    
//     if(process.env.NODE_ENV.trim() === 'development') {
//         sendDevError(err, res);
//     }
//     else{
//         sendProdError(err, res);
//     }

// };
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    const mode = String(process.env.NODE_ENV || 'development').trim();

    if (mode === 'development') {
        sendDevError(err, res);
    } else {
        sendProdError(err, res);
    }
};