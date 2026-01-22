import ActivityLog from "../models/ActivityLog.js";

// Create activity log entry
export const createActivityLog = async ({ action, resource, resourceName, resourceId, userId, userName }) => {
    try {
        const log = new ActivityLog({
            action,
            resource,
            resourceName,
            resourceId,
            userId,
            userName
        });
        await log.save();
        return log;
    } catch (error) {
        console.error('Error creating activity log:', error);
    }
};

// Get recent activity logs
export const getActivityLogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const logs = await ActivityLog.find()
            .sort({ createdAt: -1 })
            .limit(limit);
        
        res.status(200).json({
            success: true,
            data: logs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
