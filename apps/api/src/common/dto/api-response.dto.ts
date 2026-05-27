export class ApiResponseDto<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}