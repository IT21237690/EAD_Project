package com.example.e_commerceapp

import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import android.util.Base64
import android.graphics.BitmapFactory
import android.widget.Toast

class ViewProduct : AppCompatActivity() {

    private lateinit var imageView: ImageView
    private lateinit var itemNameTextView: TextView
    private lateinit var itemPriceTextView: TextView
    private lateinit var itemDescriptionTextView: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_view_product)

        imageView = findViewById(R.id.imageView9)
        itemNameTextView = findViewById(R.id.ItemName)
        itemPriceTextView = findViewById(R.id.ItemPrice)
        itemDescriptionTextView = findViewById(R.id.ItemDescription)

        val productId = intent.getStringExtra("PRODUCT_ID")
        Log.d("ViewProduct", "Received product ID: $productId")
        if (productId != null) {
            fetchProductDetails(productId) // Modify this method to accept String
        } else {
            Toast.makeText(this, "Invalid product ID", Toast.LENGTH_SHORT).show()
            Log.e("ViewProduct", "Invalid product ID received")
        }
    }

    private fun fetchProductDetails(productId: String) {
        val apiService = RetrofitInstance.api
        apiService.getProductById(productId).enqueue(object : Callback<Product> {
            override fun onResponse(call: Call<Product>, response: Response<Product>) {
                if (response.isSuccessful && response.body() != null) {
                    val product = response.body()!!
                    updateUI(product)
                    Log.d("ViewProduct", "Product details fetched successfully")
                } else {
                    Log.e("ViewProduct", "Error: ${response.code()} - ${response.message()}")
                    Toast.makeText(this@ViewProduct, "Failed to fetch product details", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Product>, t: Throwable) {
                Log.e("ViewProduct", "Error fetching product details", t)
                Toast.makeText(this@ViewProduct, "Network error", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun updateUI(product: Product) {
        itemNameTextView.text = product.ProductName
        itemPriceTextView.text = "LKR ${product.Price}"
        itemDescriptionTextView.text = product.Description

        try {
            val imageBytes = Base64.decode(product.ImageBase64, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
            imageView.setImageBitmap(bitmap)
        } catch (e: Exception) {
            Log.e("ViewProduct", "Error decoding image", e)
        }
    }
}