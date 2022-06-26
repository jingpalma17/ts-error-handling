// https://benjaminjohnson.me/blog/typesafe-errors-in-typescript
// https://www.reddit.com/r/typescript/comments/8l3ar6/error_handling_in_typescript/
interface MapFns<T, E, TResult, EResult> {
    success: (a: T) => TResult;
    failure: (e: E) => EResult;
}

class Result<TSuccess, TError> {
    public static Success<T>(success: T) {
        return new Result<T, any>(success, null, false);
    }

    public static Failure<T>(error: T) {
        return new Result<any, T>(null, error, true);
    }

    constructor(
        private success: TSuccess,
        private error: TError,
        private isError: boolean
    ) {}

    when<T, E>(mapFns: MapFns<TSuccess, TError, T, E>) {
        return this.isError
            ? mapFns.failure(this.error)
            : mapFns.success(this.success);
    }
}

const foo = (): Result<string, string> => {
    if (Math.random() < 1) {
        return Result.Success('success');
    }
    return Result.Failure('error');
};

foo().when({
    success: result => console.log(result), // result typed as number
    failure: error => console.log(error)    // result typed as string
});