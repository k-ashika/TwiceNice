package com.twicenice.twicenice_backend.controller;

import com.razorpay.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Value("${razorpay.key_id}")
    private String razorpayKeyId;

    @Value("${razorpay.key_secret}")
    private String razorpayKeySecret;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestParam double amount) {
        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject options = new JSONObject();
            options.put("amount", (int)(amount * 100)); 
            options.put("currency", "INR");
            options.put("receipt", "txn_" + System.currentTimeMillis());

            Order order = razorpay.orders.create(options);

            return ResponseEntity.ok(order.toJson());
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body("Error creating order: " + e.getMessage());
        }
    }
}
