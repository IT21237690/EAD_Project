package com.example.e_commerceapp

import androidx.lifecycle.ViewModel
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import android.util.Log
import android.widget.Toast

class VendorRatingViewModel : ViewModel() {

    // Function to send the rating data
    fun rateVendor(token: String, name: String, rating: String, comment: String) {
        val ratingRequest = VendorRatingRequest(name, rating, comment)

        // Create the Authorization header with the token
        val authHeader = "Bearer $token"

        RetrofitInstance.api.rateVendor(authHeader, ratingRequest).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    Log.d("VendorRatingViewModel", "Vendor rated successfully")
                } else {
                    Log.e("VendorRatingViewModel", "Failed to rate vendor: ${response.code()} - ${response.message()}")
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                Log.e("VendorRatingViewModel", "Error rating vendor", t)
            }
        })
    }
}
