package com.example.e_commerceapp

import android.provider.ContactsContract.CommonDataKinds.Email
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Header

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

    @GET("Product/all")  // Adjust the endpoint based on your API
    fun getProducts(): Call<List<Product>>

    @GET("Product/id/{id}")
    fun getProductById(@Path("id") id: String): Call<Product>

    @GET("User/email/{email}")
    fun getUserByEmail(@Path("email") email: String): Call<User>

    @GET("api/Order/customerOrders")
    fun getCustomerOrdersWithToken(
        @Header("Authorization") token: String
    ): Call<List<CustomerOrder>>

    @POST("api/Vendor/rate")
    fun rateVendor(
        @Header("Authorization") token: String, // Pass the token in the header
        @Body ratingRequest: VendorRatingRequest // Pass the rating data in the body
    ): Call<Void> // Assuming the API response has no body, but change this if your API sends data back
}

