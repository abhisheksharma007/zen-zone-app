import { parse } from 'toml';
import fs from 'fs';
import path from 'path';

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

class ConfigManager {
  private static instance: ConfigManager;
  private config: Config;
  private environment: string;

  private constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): void {
    try {
      const configPath = path.resolve(process.cwd(), 'config.toml');
      const configFile = fs.readFileSync(configPath, 'utf-8');
      
      // Replace environment variables in the TOML content
      const processedConfig = this.processEnvVars(configFile);
      this.config = parse(processedConfig) as Config;
    } catch (error) {
      console.error('Error loading configuration:', error);
      throw new Error('Failed to load configuration');
    }
  }

  private processEnvVars(configContent: string): string {
    // Replace ${VARIABLE_NAME} with actual environment variable values
    return configContent.replace(/\${([^}]+)}/g, (match, variable) => {
      const value = process.env[variable];
      if (value === undefined) {
        console.warn(`Warning: Environment variable ${variable} is not set`);
        return '';
      }
      return value;
    });
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