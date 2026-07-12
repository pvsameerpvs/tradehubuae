type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private context: string;
  private minLevel: LogLevel;

  constructor(context: string = "app", minLevel?: LogLevel) {
    this.context = context;
    this.minLevel = minLevel ?? (process.env.NODE_ENV === "production" ? "info" : "debug");
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: { service: this.context, ...context },
      error,
    };

    if (process.env.NODE_ENV === "production") {
      console[level](JSON.stringify(entry));
    } else {
      const prefix = `[${entry.timestamp}] [${level.toUpperCase()}] [${this.context}]`;
      const suffix = context ? ` ${JSON.stringify(context)}` : "";
      if (error) {
        console[level](`${prefix} ${message}${suffix}`, error);
      } else {
        console[level](`${prefix} ${message}${suffix}`);
      }
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log("debug", message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log("info", message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log("warn", message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log("error", message, context, error);
  }

  child(subContext: string): Logger {
    return new Logger(`${this.context}:${subContext}`, this.minLevel);
  }
}

export const logger = new Logger("tradehubuae");
export type { Logger, LogLevel, LogEntry };
