import React, { useEffect, useState } from 'react';

enum LogLevel {
    Debug = 'debug',
    Info = 'info',
    Warning = 'warning',
    Error = 'error',
}

export interface LogRecord {
    logger: string; // 来源实例
    timestamp: number;
    level: LogLevel;
    message: any[];
}

type LogCallback = () => any;

export class LogStore {

    private records: LogRecord[];
    private callbacks: LogCallback[];

    private maximum: number;

    constructor(options?: { maximum: number }) {
        this.records = [];
        this.callbacks = [];
        this.maximum = options?.maximum || 5000;
    }

    createLogger(name: string): Logger {
        return new Logger(this, name);
    }

    append(rcd: LogRecord) {
        this.records.unshift(rcd);
        if (this.records.length > this.maximum) {
            this.records.pop();
        }
        this.callbacks.map(cb => cb());
    }

    addCallback(cb: LogCallback) {
        if (!this.callbacks.includes(cb)) {
            this.callbacks.push(cb);
        }
    }

    removeCallback(cb: LogCallback) {
        const idx = this.callbacks.indexOf(cb);
        if (idx > -1) {
            this.callbacks.splice(idx, 1);
        }
    }

    getRecords(): LogRecord[] {
        return this.records
    }

}


export class Logger {
    private store: LogStore;
    private name: string;

    constructor(store: LogStore, name: string) {
        this.store = store;
        this.name = name;
    }

    log(level: LogLevel, ...message: any[]) {
        this.store.append({
            timestamp: new Date().getTime(),
            level,
            message,
            logger: this.name
        });
    }

    debug(...message: any[]) {
        this.log(LogLevel.Debug, ...message);
    }
    info(...message: any[]) {
        this.log(LogLevel.Info, ...message);
    }
    warning(...message: any[]) {
        this.log(LogLevel.Warning, ...message);
    }
    error(...message: any[]) {
        this.log(LogLevel.Error, ...message);
    }

}


export function useLogs(store: LogStore) {

    const [records, setRecords] = useState<LogRecord[]>([]);

    useEffect(() => {
        setRecords(store.getRecords());
        const cb = () => setRecords(store.getRecords());
        store.addCallback(cb);
        return () => store.removeCallback(cb);
    }, [store]);

    return [records];
}
