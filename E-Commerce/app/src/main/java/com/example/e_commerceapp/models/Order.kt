package com.example.ead_pasindu.models

// Order.kt

data class Order(
    val id: String,
    val userId: String,
    val products: List<Product>,
    val status: String,  // Status could be "processing", "shipped", "delivered", etc.
    val totalAmount: Double
)

data class OrderResponse(
    val success: Boolean,
    val orders: List<Order>
)
