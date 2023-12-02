class StatusCode {
  static success = 200;
  static created = 201;
  static resetContent = 205;
  static notModified = 304;
  static badRequest = 400;
  static unauthorized = 401;
  static notFound = 404;
  static conflict = 409;
  static internalServerError = 500;
  static noContent = 204;
}

class ApiResponse {
  status: boolean;
  data: any;
  resultCode: number;
  message: string;

  constructor(status: boolean, data: any, resultCode: number, message: string) {
    this.status = status;
    this.data = data;
    this.resultCode = resultCode;
    this.message = message;
  }

  static customized(
    status: boolean,
    data: any,
    resultCode: number,
    message: string
  ): ApiResponse {
    return new ApiResponse(status, data, resultCode, message);
  }

  static unauthorized(message: string = "Unauthorized"): ApiResponse {
    return new ApiResponse(false, null, StatusCode.unauthorized, message);
  }

  static success(data: any, message: string = "success"): ApiResponse {
    return new ApiResponse(true, data, StatusCode.success, message);
  }

  static read(data: any, message: string = "Read successfully"): ApiResponse {
    return new ApiResponse(true, data, StatusCode.success, message);
  }

  static created(
    data: any,
    message: string = "Created successfully"
  ): ApiResponse {
    return new ApiResponse(true, data, StatusCode.created, message);
  }

  static updated(
    data: any,
    message: string = "Updated successfully"
  ): ApiResponse {
    return new ApiResponse(true, data, StatusCode.success, message);
  }

  static notModified(message: string = "Not modified"): ApiResponse {
    return new ApiResponse(true, null, StatusCode.notModified, message);
  }

  static deleted(message: string = "Deleted successfully"): ApiResponse {
    return new ApiResponse(true, null, StatusCode.success, message);
  }

  static notFound(message: string = "Not found"): ApiResponse {
    return new ApiResponse(false, null, StatusCode.notFound, message);
  }

  static conflict(message: string = "Conflict"): ApiResponse {
    return new ApiResponse(true, null, StatusCode.conflict, message);
  }

  static badRequest(message: string = "Bad request"): ApiResponse {
    return new ApiResponse(false, null, StatusCode.badRequest, message);
  }

  static internalServerError(
    message: string = "Internal server error"
  ): ApiResponse {
    return new ApiResponse(
      false,
      null,
      StatusCode.internalServerError,
      message
    );
  }
}

export default ApiResponse;
