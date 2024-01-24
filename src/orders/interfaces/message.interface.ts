export interface IMessage {
    level: string; // error, warning
    service: string; // 
    domain: string; //  
    context: string; // addEmployeeByUsername  getEmployeeByUsername
    exception: string; // DuplicateEmployeeCode
    message: string;
  }