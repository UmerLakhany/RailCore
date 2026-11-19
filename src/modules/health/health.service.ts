export const getHealthStatus = () => {
  return{
    status: 'ok',
    message: 'RailCore backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV ?? 'development',
  }
}