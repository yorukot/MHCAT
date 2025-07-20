module.exports = {
  apps: [{
    name: 'mhcat',
    script: 'shard.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      NODE_OPTIONS: '--max-old-space-size=1024'
    },
    // PM2 restart policy
    max_restarts: 5,
    min_uptime: '10s',
    restart_delay: 4000,
    
    // Logging
    log_file: './logs/mhcat.log',
    out_file: './logs/mhcat-out.log',
    error_file: './logs/mhcat-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Monitoring
    max_memory_restart: '1G',
    
    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 10000,
    
    // Auto restart on file changes (disable in production)
    watch: false,
    ignore_watch: ['node_modules', 'logs', '*.log'],
    
    // Environment variables
    node_args: '--max-old-space-size=1024'
  }]
}; 