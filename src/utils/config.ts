
// During development, we'll use a simpler config approach
// as the TOML parser is designed for Node.js environments

interface Config {
  app: {
    name: string;
    version: string;
    environment: string;
    debug: boolean;
  };
  server: {
    host: string;
    port: number;
    base_url: string;
    api_url: string;
  };
  email: {
    provider: string;
    from: string;
    smtp_host: string;
    smtp_port: number;
    smtp_user: string;
    smtp_pass: string;
    use_tls: boolean;
  };
  security: {
    session_duration: number;
    refresh_token_duration: number;
    jwt_secret: string;
    enable_csp: boolean;
    enable_hsts: boolean;
    allowed_origins: string[];
  };
  cache: {
    enabled: boolean;
    ttl: number;
    max_size: string;
    type: string;
  };
  logging: {
    level: string;
    format: string;
    enable_error_tracking: boolean;
    enable_analytics: boolean;
  };
  features: {
    enable_premium: boolean;
    enable_social: boolean;
    enable_notifications: boolean;
    enable_meditation_timer: boolean;
    enable_progress_tracking: boolean;
  };
  rate_limit: {
    enabled: boolean;
    requests_per_minute: number;
    burst: number;
  };
  monitoring: {
    enable_health_checks: boolean;
    enable_performance_monitoring: boolean;
    enable_error_reporting: boolean;
    sentry_dsn: string;
  };
  dev: {
    enable_devtools: boolean;
    enable_debug_mode: boolean;
    enable_hot_reload: boolean;
    enable_source_maps: boolean;
  };
  production: {
    minify: boolean;
    compress: boolean;
    enable_gzip: boolean;
    enable_brotli: boolean;
    enable_cdn: boolean;
    cdn_url: string;
  };
}

// Mock configuration for browser environment
const mockConfig: Config = {
  app: {
    name: "Zen Zone",
    version: "1.0.0",
    environment: "production",
    debug: false,
  },
  server: {
    host: "::",
    port: 8080,
    base_url: "https://zen-zone.com",
    api_url: "https://api.zen-zone.com",
  },
  email: {
    provider: "zoho",
    from: "support@zenzone.com",
    smtp_host: "smtp.zoho.com",
    smtp_port: 587,
    smtp_user: "support@zenzone.com",
    smtp_pass: "password",
    use_tls: true,
  },
  security: {
    session_duration: 86400,
    refresh_token_duration: 604800,
    jwt_secret: "your-jwt-secret-key",
    enable_csp: true,
    enable_hsts: true,
    allowed_origins: ["https://zen-zone.com", "https://www.zen-zone.com"],
  },
  cache: {
    enabled: true,
    ttl: 3600,
    max_size: "1GB",
    type: "redis",
  },
  logging: {
    level: "error",
    format: "json",
    enable_error_tracking: true,
    enable_analytics: true,
  },
  features: {
    enable_premium: true,
    enable_social: true,
    enable_notifications: true,
    enable_meditation_timer: true,
    enable_progress_tracking: true,
  },
  rate_limit: {
    enabled: true,
    requests_per_minute: 100,
    burst: 50,
  },
  monitoring: {
    enable_health_checks: true,
    enable_performance_monitoring: true,
    enable_error_reporting: true,
    sentry_dsn: "your-sentry-dsn",
  },
  dev: {
    enable_devtools: false,
    enable_debug_mode: false,
    enable_hot_reload: false,
    enable_source_maps: false,
  },
  production: {
    minify: true,
    compress: true,
    enable_gzip: true,
    enable_brotli: true,
    enable_cdn: true,
    cdn_url: "https://cdn.zen-zone.com",
  },
};

class ConfigManager {
  private static instance: ConfigManager;
  private config: Config;
  private environment: string;

  private constructor() {
    this.environment = import.meta.env.MODE || 'development';
    this.config = mockConfig;
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public getConfig(): Config {
    return this.config;
  }

  public getEmailConfig() {
    return this.config.email;
  }

  public getServerConfig() {
    return this.config.server;
  }

  public getSecurityConfig() {
    return this.config.security;
  }

  public getFeatureFlags() {
    return this.config.features;
  }

  public isDevelopment(): boolean {
    return this.environment === 'development';
  }

  public isProduction(): boolean {
    return this.environment === 'production';
  }

  public validateConfig(): boolean {
    // Validate required email configuration
    const emailConfig = this.config.email;
    if (!emailConfig.smtp_host || !emailConfig.smtp_port || !emailConfig.smtp_user || !emailConfig.smtp_pass) {
      console.error('Missing required email configuration');
      return false;
    }

    // Validate server configuration
    const serverConfig = this.config.server;
    if (!serverConfig.base_url || !serverConfig.api_url) {
      console.error('Missing required server configuration');
      return false;
    }

    return true;
  }
}

export const configManager = ConfigManager.getInstance();
export type { Config };
