package com.example.e_commerceapp

import com.google.gson.annotations.SerializedName

data class User(
    @SerializedName("Email") val Email: String,
    @SerializedName("Password") val Password: String,
    @SerializedName("Name") val Name: String,
    @SerializedName("Role") val Role: String,
    @SerializedName("Address") val Address: String,
    @SerializedName("CreatedDate") val CreatedDate: String
)