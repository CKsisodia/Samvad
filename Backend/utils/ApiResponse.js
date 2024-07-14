class ApiResponse {
  constructor(message = "Success", data) {
    this.message = message;
    this.data = data;
  }
  toJSON() {
    return {
      status: true,
      message: this.message,
      data: this.data,
    };
  }
}

module.exports = ApiResponse;
