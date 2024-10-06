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

interface ApiService {
    @POST("User/add")
    fun signUp(@Body SignUpRequest: SignUpRequest): Call<SignUpResponse>
}

data class SignUpResponse(
    val message: String, // Change this based on your actual response structure
    val success: Boolean // Add fields according to your API response
)