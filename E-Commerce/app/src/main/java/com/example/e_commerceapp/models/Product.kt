package com.example.ead_pasindu.models
// Product.kt

data class Product(
    val id: String,
    val name: String,
    val description: String,
    val price: Double,
    val category: String
)

data class ProductResponse(
    val success: Boolean,
    val products: List<Product>
)
