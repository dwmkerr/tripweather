export class TripWeatherError extends Error {
  public title: string;
  public error?: Error;

  public constructor(title: string, message: string, error?: Error) {
    super(message);
    this.title = title;
    this.error = error;
  }

  public static fromError(title: string, err: unknown): TripWeatherError {
    //  Cast the internal error into an error object or return it if it is
    //  already one.
    const error = err as Error;
    if (error instanceof TripWeatherError) {
      return error;
    }
    return new TripWeatherError(
      title,
      error?.message || "Unknown error",
      error,
    );
  }
}
