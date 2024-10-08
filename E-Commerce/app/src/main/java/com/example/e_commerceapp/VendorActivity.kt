package com.example.ead_pasindu

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.yourpackage.api.ApiClient
import com.yourpackage.api.ApiService
import com.yourpackage.databinding.ActivityVendorBinding
import com.yourpackage.models.VendorComment
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class VendorActivity : AppCompatActivity() {
    private lateinit var binding: ActivityVendorBinding
    private lateinit var apiService: ApiService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityVendorBinding.inflate(layoutInflater)
        setContentView(binding.root)

        apiService = ApiClient.getClient().create(ApiService::class.java)
        val vendorId = "sample_vendor_id" // Replace with real vendor ID

        binding.submitCommentButton.setOnClickListener {
            val commentText = binding.commentInput.text.toString()
            val comment = VendorComment(commentText)

            apiService.postVendorComment(vendorId, comment).enqueue(object : Callback<VendorResponse> {
                override fun onResponse(call: Call<VendorResponse>, response: Response<VendorResponse>) {
                    if (response.isSuccessful) {
                        // Comment posted
                    }
                }

                override fun onFailure(call: Call<VendorResponse>, t: Throwable) {
                    // Handle failure
                }
            })
        }
    }
}
