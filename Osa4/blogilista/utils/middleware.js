require('dotenv').config()
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.decodedToken = decodedToken
  } catch (error) {
    request.decodedToken = null
  }

  next()
}

const userExtractor = async (request, response, next) => {
    if (request.decodedToken) {
        try {
            request.user = await User.findById(request.decodedToken.id);
        } catch (error) {
            request.user = null;
        }
    } else {
        request.user = null;
    }
  
    next();
}

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor
}