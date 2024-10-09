package com.example.ead_pasindu.api

// ApiService.kt
import com.example.ead_pasindu.models.*
import retrofit2.Call
import retrofit2.http.*

interface ApiService {

    @POST("login")
    fun loginUser(@Body user: User): Call<UserResponse>

    @POST("register")
    fun registerUser(@Body user: User): Call<UserResponse>

    @GET("products")
    fun getProducts(): Call<List<Product>>

    @GET("orders/{userId}")
    fun getOrderTracking(@Path("userId") userId: String): Call<List<Order>>

    @POST("vendors/{vendorId}/comments")
    fun postVendorComment(@Path("vendorId") vendorId: String, @Body comment: VendorComment): Call<VendorResponse>
}
