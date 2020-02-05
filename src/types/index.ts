
type otherFlagsKeys = 'list' | 'on' | 'from' | 'to' | 'type' | 'tag';
export type otherFlags = {
    [f in otherFlagsKeys]?: string
};

export type Id<T> = { [K in keyof T]: T[K] }
