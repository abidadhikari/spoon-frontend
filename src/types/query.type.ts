export type QueryOf<T> = NonNullable<T extends { query?: infer Q } ? Q : never>;

export type PathOf<T> = NonNullable<T extends { path?: infer P } ? P : never>;

export type BodyOf<T> = NonNullable<T extends { body?: infer B } ? B : never>;
