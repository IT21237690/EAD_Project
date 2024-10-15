package com.example.e_commerceapp

import com.google.gson.annotations.SerializedName

data class Product(
    @SerializedName("Id") val Id: String,
    @SerializedName("ProductName") val ProductName: String,
    @SerializedName("Price") val Price: Double,
    @SerializedName("Description") val Description: String,
    @SerializedName("Category") val Category: String,
    @SerializedName("ImageBase64") val ImageBase64: String
)