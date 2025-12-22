package org.example.case_study_module_6.service;

import org.example.case_study_module_6.dto.RegisterRequest;
import org.example.case_study_module_6.entity.Customer;

public interface ICustomerService {
    Customer registerCustomer(RegisterRequest request);
}
