package com.example.e_commerceapp

import com.google.gson.annotations.SerializedName

data class CustomerOrder(
    @SerializedName("_id")
    val id: String,

    @SerializedName("Quantity")
    val quantity: Int,

    @SerializedName("CustomerEmail")
    val customerEmail: String,

    @SerializedName("CustomerAddress")
    val customerAddress: String,

    @SerializedName("Status")
    val status: String,

    @SerializedName("TotalAmount")
    val totalAmount: Double,

    @SerializedName("CreatedDate")
    val createdDate: String,

    @SerializedName("ProductId")
    val productId: String,

    @SerializedName("ImageBase64")
    val imageBase64: String
)

