package com.example.ead_pasindu.models

// User.kt

data class User(
    val email: String,
    val password: String,
    val username: String? = null
)

data class UserResponse(
    val success: Boolean,
    val message: String,
    val user: User? = null
)
