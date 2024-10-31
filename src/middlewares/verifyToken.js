const jwt = require('jsonwebtoken');

// Main token verification middleware
function verifyToken(req, res, next) {
    try {
        // Check Authorization header format
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'No authorization header found'
            });
        }

        // Verify Bearer scheme
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                success: false,
                message: 'Invalid authorization format. Use: Bearer <token>'
            });
        }

        const token = parts[1];

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                // Handle different JWT errors
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        success: false,
                        message: 'Token has expired',
                        error: 'TOKEN_EXPIRED'
                    });
                }
                if (err.name === 'JsonWebTokenError') {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid token',
                        error: 'TOKEN_INVALID'
                    });
                }
                return res.status(401).json({
                    success: false,
                    message: 'Token verification failed',
                    error: 'TOKEN_VERIFICATION_FAILED'
                });
            }

            // Add decoded user to request
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during authentication',
            error: 'AUTH_ERROR'
        });
    }
}

// Optional middleware to handle both JWT and session authentication
function authenticate(req, res, next) {
    try {
        // First check for session authentication
        if (req.session && req.session.user) {
            req.user = req.session.user;
            return next();
        }

        // If no session, verify JWT
        return verifyToken(req, res, next);
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during authentication',
            error: 'AUTH_ERROR'
        });
    }
}

// Middleware to verify specific roles
function requireRole(roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
                error: 'AUTH_REQUIRED'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions',
                error: 'INSUFFICIENT_PERMISSIONS'
            });
        }

        next();
    };
}

// Middleware to refresh token if it's about to expire
function refreshToken(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return next();
        }

        const decoded = jwt.decode(token);
        if (!decoded) {
            return next();
        }

        // Check if token is about to expire (e.g., less than 5 minutes remaining)
        const timeUntilExpiry = decoded.exp - (Date.now() / 1000);
        if (timeUntilExpiry < 300 && timeUntilExpiry > 0) {
            const newToken = jwt.sign(
                { id: decoded.id, email: decoded.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.setHeader('X-New-Token', newToken);
        }

        next();
    } catch (error) {
        // Don't fail the request if refresh fails
        console.error('Token refresh error:', error);
        next();
    }
}

// Middleware to prevent certain routes in production
function preventInProduction(req, res, next) {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({
            success: false,
            message: 'This route is not available in production',
            error: 'PRODUCTION_RESTRICTED'
        });
    }
    next();
}

module.exports = {
    verifyToken,
    authenticate,
    requireRole,
    refreshToken,
    preventInProduction
};