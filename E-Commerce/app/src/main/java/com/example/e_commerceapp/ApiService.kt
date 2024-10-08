package com.example.e_commerceapp

import android.provider.ContactsContract.CommonDataKinds.Email
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

data class SignUpRequest(
    val email: String,
    val Password: String,
    val Name: String,
    val Role: String = "customer",
    val Address: String
)

data class SignUpResponse(
    val message: String, // Change this based on your actual response structure
    val success: Boolean // Add fields according to your API response
)

data class loginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val Token: String,   // Token received after login
    val success: Boolean // Change this based on your actual response structure
)

interface ApiService {
    @POST("User/add")
    fun signUp(@Body SignUpRequest: SignUpRequest): Call<SignUpResponse>

    @POST("User/login")
    fun login(@Body loginRequest: loginRequest): Call<LoginResponse>
}

