package com.example.e_commerceapp
import com.google.gson.annotations.SerializedName

data class VendorRatingRequest(
    @SerializedName("Name")
    val name: String,

    @SerializedName("Rating")
    val rating: String,

    @SerializedName("Comment")
    val comment: String
)
