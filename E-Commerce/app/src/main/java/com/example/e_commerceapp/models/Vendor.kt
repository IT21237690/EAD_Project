package com.example.ead_pasindu.models
// Vendor.kt
data class Vendor(
    val id: String,
    val name: String,
    val rating: Float
)

data class VendorComment(
    val comment: String
)

data class VendorResponse(
    val success: Boolean,
    val message: String
)
