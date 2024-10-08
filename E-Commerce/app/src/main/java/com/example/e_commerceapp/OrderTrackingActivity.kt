package com.example.ead_pasindu
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.ead_pasindu.api.ApiClient
import com.example.ead_pasindu.api.ApiService
import com.example.ead_pasindu.databinding.ActivityOrderTrackingBinding
import com.example.ead_pasindu.models.Order
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class OrderTrackingActivity : AppCompatActivity() {
    private lateinit var binding: ActivityOrderTrackingBinding
    private lateinit var apiService: ApiService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityOrderTrackingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        apiService = ApiClient.getClient().create(ApiService::class.java)
        val userId = "sample_user_id" // Replace with real user ID

        apiService.getOrderTracking(userId).enqueue(object : Callback<List<Order>> {
            override fun onResponse(call: Call<List<Order>>, response: Response<List<Order>>) {
                if (response.isSuccessful) {
                    val orders = response.body() ?: emptyList()
                    val adapter = OrderAdapter(orders)
                    binding.recyclerView.apply {
                        layoutManager = LinearLayoutManager(this@OrderTrackingActivity)
                        this.adapter = adapter
                    }
                }
            }

            override fun onFailure(call: Call<List<Order>>, t: Throwable) {
                // Handle failure
            }
        })
    }
}
