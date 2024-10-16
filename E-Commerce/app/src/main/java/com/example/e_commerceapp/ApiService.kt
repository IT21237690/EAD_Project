package com.example.e_commerceapp

import android.provider.ContactsContract.CommonDataKinds.Email
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.POST
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PUT
import retrofit2.http.Path

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

data class PlaceOrderRequest(val productId: String, val quantity: Int)

interface ApiService {
    @POST("User/add")
    fun signUp(@Body SignUpRequest: SignUpRequest): Call<SignUpResponse>

    @POST("User/login")
    fun login(@Body loginRequest: loginRequest): Call<LoginResponse>

    @GET("User/email/{email}")
    fun getUserByEmail(@Path("email") email: String): Call<User>

    @PUT("User/update/{email}")
    fun updateUserByEmail(@Path("email") email: String, @Body user: User): Call<Void>

    @DELETE("User/delete/{email}")
    fun deleteUserByEmail(@Path("email") email: String): Call<Void>

    @GET("Product/all")
    fun getProducts(): Call<List<Product>>

    @GET("Product/id/{id}")
    fun getProductById(@Path("id") id: String): Call<Product>

    @POST("Product/add-to-cart/{productId}")
    fun addToCart(@Path("productId") productId: String, @Header("Authorization") token: String): Call<Void>

    @POST("Order/place/{productId}")
    fun placeOrder(
        @Path("productId") productId: String,
        @Header("Authorization") token: String,
        @Body request: PlaceOrderRequest
    ): Call<Void>
}

